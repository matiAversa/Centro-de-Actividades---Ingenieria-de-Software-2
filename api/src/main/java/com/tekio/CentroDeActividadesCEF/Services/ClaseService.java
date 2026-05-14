package com.tekio.CentroDeActividadesCEF.Services;

import com.tekio.CentroDeActividadesCEF.DTO.CrearClasesRecurrentesRequest;
import com.tekio.CentroDeActividadesCEF.Entities.Actividad;
import com.tekio.CentroDeActividadesCEF.Entities.Clase;
import com.tekio.CentroDeActividadesCEF.Repositories.ActividadRepository;
import com.tekio.CentroDeActividadesCEF.Repositories.ClaseRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class ClaseService {

    private final ClaseRepository claseRepository;
    private final ActividadRepository actividadRepository;

    public ClaseService(
            ClaseRepository claseRepository,
            ActividadRepository actividadRepository) {
        this.claseRepository = claseRepository;
        this.actividadRepository = actividadRepository;
    }

    public List<Clase> obtenerTodas() {
        return claseRepository.findAll();
    }

    public List<Clase> obtenerProximas() {
        return claseRepository
                .findByFechaGreaterThanEqualOrderByFechaAscHoraInicioAsc(
                        LocalDate.now());
    }

    public Clase crear(Long actividadId, Clase clase) {

        Actividad actividad = actividadRepository.findById(actividadId)
                .orElseThrow(() -> new RuntimeException(
                        "Actividad no encontrada"));

        clase.setActividad(actividad);

        if (clase.getCuposDisponibles() == null) {
            clase.setCuposDisponibles(
                    clase.getCupoMaximo());
        }

        if (clase.getEstado() == null
                || clase.getEstado().isBlank()) {

            clase.setEstado("ACTIVA");
        }

        return claseRepository.save(clase);
    }

    public List<Clase> crearRecurrentes(
            CrearClasesRecurrentesRequest request) {

        Actividad actividad = actividadRepository.findById(
                request.getActividadId())
                .orElseThrow(() -> new RuntimeException(
                        "Actividad no encontrada"));

        List<Clase> clasesCreadas = new ArrayList<>();

        LocalDate fecha = request.getFechaInicio();

        while (!fecha.isAfter(
                request.getFechaFin())) {

            if (fecha.getDayOfWeek()
                    .equals(
                            request.getDiaSemana())) {

                Clase clase = new Clase();

                clase.setActividad(
                        actividad);

                clase.setFecha(
                        fecha);

                clase.setHoraInicio(
                        request.getHoraInicio());

                clase.setHoraFin(
                        request.getHoraFin());

                clase.setProfesor(
                        request.getProfesor());

                clase.setCupoMaximo(
                        request.getCupoMaximo());

                clase.setCuposDisponibles(
                        request.getCupoMaximo());

                clase.setEstado(
                        "ACTIVA");

                clase.setPrecio(
                        request.getPrecio()
                );

                clasesCreadas.add(
                        claseRepository.save(
                                clase));
            }

            fecha = fecha.plusDays(1);
        }

        return clasesCreadas;
    }

    public void eliminar(Long id) {
        claseRepository.deleteById(id);
    }
}