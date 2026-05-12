package com.tekio.CentroDeActividadesCEF.Repositories;

import com.tekio.CentroDeActividadesCEF.Entities.Actividad;
import com.tekio.CentroDeActividadesCEF.Entities.Inscripcion;
import com.tekio.CentroDeActividadesCEF.Entities.Socio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InscripcionRepository extends JpaRepository<Inscripcion, Long> {

    boolean existsBySocioAndActividad(Socio socio, Actividad actividad);

    List<Inscripcion> findBySocio(Socio socio);
}