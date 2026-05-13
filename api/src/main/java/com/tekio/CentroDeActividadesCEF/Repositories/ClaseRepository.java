package com.tekio.CentroDeActividadesCEF.Repositories;

import com.tekio.CentroDeActividadesCEF.Entities.Clase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ClaseRepository extends JpaRepository<Clase, Long> {

    List<Clase> findByFechaGreaterThanEqualOrderByFechaAscHoraInicioAsc(
            LocalDate fecha);

    List<Clase> findByActividadIdAndFechaBetweenOrderByFechaAscHoraInicioAsc(
            Long actividadId,
            LocalDate fechaInicio,
            LocalDate fechaFin);
}