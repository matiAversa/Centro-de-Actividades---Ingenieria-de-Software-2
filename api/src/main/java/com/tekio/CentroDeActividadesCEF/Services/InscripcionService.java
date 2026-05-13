package com.tekio.CentroDeActividadesCEF.Services;

import com.tekio.CentroDeActividadesCEF.DTO.InscripcionMensualRequest;
import com.tekio.CentroDeActividadesCEF.Entities.Clase;
import com.tekio.CentroDeActividadesCEF.Entities.Inscripcion;
import com.tekio.CentroDeActividadesCEF.Entities.Socio;
import com.tekio.CentroDeActividadesCEF.Repositories.ClaseRepository;
import com.tekio.CentroDeActividadesCEF.Repositories.InscripcionRepository;
import com.tekio.CentroDeActividadesCEF.Repositories.SocioRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class InscripcionService {

    private final InscripcionRepository inscripcionRepository;
    private final SocioRepository socioRepository;
    private final ClaseRepository claseRepository;

    public InscripcionService(
            InscripcionRepository inscripcionRepository,
            SocioRepository socioRepository,
            ClaseRepository claseRepository) {
        this.inscripcionRepository = inscripcionRepository;
        this.socioRepository = socioRepository;
        this.claseRepository = claseRepository;
    }

    public List<Inscripcion> obtenerTodas() {
        return inscripcionRepository.findAll();
    }

    public List<Inscripcion> obtenerPorSocio(
            Long socioId) {
        Socio socio = socioRepository.findById(socioId)
                .orElseThrow(() -> new RuntimeException(
                        "Socio no encontrado"));

        return inscripcionRepository
                .findBySocio(socio);
    }

    public Inscripcion crear(
            Long socioId,
            Long claseId) {

        Socio socio = socioRepository.findById(socioId)
                .orElseThrow(() -> new RuntimeException(
                        "Socio no encontrado"));

        Clase clase = claseRepository.findById(claseId)
                .orElseThrow(() -> new RuntimeException(
                        "Clase no encontrada"));

        validarInscripcion(
                socio,
                clase);

        clase.setCuposDisponibles(
                clase.getCuposDisponibles() - 1);

        claseRepository.save(clase);

        Inscripcion inscripcion = new Inscripcion();

        inscripcion.setSocio(socio);
        inscripcion.setClase(clase);

        inscripcion.setFechaInscripcion(
                LocalDate.now().toString());

        inscripcion.setEstadoPago(
                "PENDIENTE_PAGO");

        return inscripcionRepository
                .save(inscripcion);
    }

    @Transactional
    public List<Inscripcion> crearMensual(
            InscripcionMensualRequest request) {

        Socio socio = socioRepository.findById(
                request.getSocioId())
                .orElseThrow(() -> new RuntimeException(
                        "Socio no encontrado"));

        List<Clase> clasesDelMes = claseRepository
                .findByActividadIdAndFechaBetweenOrderByFechaAscHoraInicioAsc(
                        request.getActividadId(),
                        request.getFechaInicio(),
                        request.getFechaFin());

        if (clasesDelMes.isEmpty()) {
            throw new RuntimeException(
                    "No hay clases disponibles para esa actividad en el rango elegido");
        }

        for (Clase clase : clasesDelMes) {
            validarInscripcion(
                    socio,
                    clase);
        }

        return clasesDelMes.stream()
                .map(clase -> {

                    clase.setCuposDisponibles(
                            clase.getCuposDisponibles() - 1);

                    claseRepository.save(
                            clase);

                    Inscripcion inscripcion = new Inscripcion();

                    inscripcion.setSocio(
                            socio);

                    inscripcion.setClase(
                            clase);

                    inscripcion.setFechaInscripcion(
                            LocalDate.now().toString());

                    inscripcion.setEstadoPago(
                            "PENDIENTE_PAGO");

                    return inscripcionRepository
                            .save(inscripcion);
                })
                .toList();
    }

    private void validarInscripcion(
            Socio socio,
            Clase clase) {

        if (clase.getCuposDisponibles() == null
                || clase.getCuposDisponibles() <= 0) {

            throw new RuntimeException(
                    "No hay cupos disponibles");
        }

        boolean yaInscripto = inscripcionRepository
                .existsBySocioAndClase(
                        socio,
                        clase);

        if (yaInscripto) {
            throw new RuntimeException(
                    "El socio ya está inscripto en esta clase");
        }

        List<Inscripcion> inscripcionesDelSocio = inscripcionRepository
                .findBySocio(socio);

        boolean tieneMismoHorario = inscripcionesDelSocio
                .stream()
                .anyMatch(
                        inscripcion -> inscripcion.getClase() != null
                                && inscripcion
                                        .getClase()
                                        .getFecha() != null
                                && inscripcion
                                        .getClase()
                                        .getHoraInicio() != null
                                && inscripcion
                                        .getClase()
                                        .getFecha()
                                        .equals(
                                                clase.getFecha())
                                && inscripcion
                                        .getClase()
                                        .getHoraInicio()
                                        .equals(
                                                clase.getHoraInicio()));

        if (tieneMismoHorario) {
            throw new RuntimeException(
                    "El socio ya tiene una clase en ese horario");
        }
    }

    public void eliminar(Long id) {

        Inscripcion inscripcion = inscripcionRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Inscripción no encontrada"));

        Clase clase = inscripcion.getClase();

        if (clase != null
                && clase.getCuposDisponibles() != null) {

            clase.setCuposDisponibles(
                    clase.getCuposDisponibles() + 1);

            claseRepository.save(clase);
        }

        inscripcionRepository.deleteById(
                id);
    }
}