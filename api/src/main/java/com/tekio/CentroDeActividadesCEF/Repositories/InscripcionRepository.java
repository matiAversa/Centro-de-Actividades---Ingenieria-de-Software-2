package com.tekio.CentroDeActividadesCEF.Repositories;

import com.tekio.CentroDeActividadesCEF.Entities.Clase;
import com.tekio.CentroDeActividadesCEF.Entities.Inscripcion;
import com.tekio.CentroDeActividadesCEF.Entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InscripcionRepository extends JpaRepository<Inscripcion, Long> {

    boolean existsBySocioAndClase(Usuario socio, Clase clase);

    List<Inscripcion> findBySocio(Usuario socio);
}