package com.tekio.CentroDeActividadesCEF.Services;

import com.tekio.CentroDeActividadesCEF.Entities.Actividad;
import com.tekio.CentroDeActividadesCEF.Entities.Inscripcion;
import com.tekio.CentroDeActividadesCEF.Entities.Socio;
import com.tekio.CentroDeActividadesCEF.Repositories.ActividadRepository;
import com.tekio.CentroDeActividadesCEF.Repositories.InscripcionRepository;
import com.tekio.CentroDeActividadesCEF.Repositories.SocioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class InscripcionService {

    private final InscripcionRepository inscripcionRepository;
    private final SocioRepository socioRepository;
    private final ActividadRepository actividadRepository;

    public InscripcionService(
            InscripcionRepository inscripcionRepository,
            SocioRepository socioRepository,
            ActividadRepository actividadRepository) {
        this.inscripcionRepository = inscripcionRepository;
        this.socioRepository = socioRepository;
        this.actividadRepository = actividadRepository;
    }

    public List<Inscripcion> obtenerTodas() {
        return inscripcionRepository.findAll();
    }

    public Inscripcion crear(Long socioId, Long actividadId) {
        Socio socio = socioRepository.findById(socioId)
                .orElseThrow(() -> new RuntimeException("Socio no encontrado"));

        Actividad actividad = actividadRepository.findById(actividadId)
                .orElseThrow(() -> new RuntimeException("Actividad no encontrada"));

        if (actividad.getCupos() == null || actividad.getCupos() <= 0) {
            throw new RuntimeException("No hay cupos disponibles");
        }

        boolean yaInscripto = inscripcionRepository.existsBySocioAndActividad(socio, actividad);

        if (yaInscripto) {
            throw new RuntimeException("El socio ya está inscripto en esta actividad");
        }

        List<Inscripcion> inscripcionesDelSocio = inscripcionRepository.findBySocio(socio);

        boolean tieneMismoHorario = inscripcionesDelSocio.stream()
                .anyMatch(inscripcion -> inscripcion.getActividad() != null
                        && inscripcion.getActividad().getHorario() != null
                        && inscripcion.getActividad().getHorario().equalsIgnoreCase(actividad.getHorario()));

        if (tieneMismoHorario) {
            throw new RuntimeException("El socio ya tiene una actividad en ese horario");
        }

        actividad.setCupos(actividad.getCupos() - 1);
        actividadRepository.save(actividad);

        Inscripcion inscripcion = new Inscripcion();
        inscripcion.setSocio(socio);
        inscripcion.setActividad(actividad);
        inscripcion.setFechaInscripcion(LocalDate.now().toString());

        return inscripcionRepository.save(inscripcion);
    }

    public void eliminar(Long id) {
        Inscripcion inscripcion = inscripcionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inscripción no encontrada"));

        Actividad actividad = inscripcion.getActividad();

        if (actividad != null && actividad.getCupos() != null) {
            actividad.setCupos(actividad.getCupos() + 1);
            actividadRepository.save(actividad);
        }

        inscripcionRepository.deleteById(id);
    }
}