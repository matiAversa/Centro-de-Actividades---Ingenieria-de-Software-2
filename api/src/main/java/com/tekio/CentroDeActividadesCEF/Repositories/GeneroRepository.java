package com.tekio.CentroDeActividadesCEF.Repositories;


import com.tekio.CentroDeActividadesCEF.Entities.Genero;
import com.tekio.CentroDeActividadesCEF.Entities.UsuarioPendiente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface GeneroRepository extends JpaRepository<Genero, Integer> {

	Optional<Genero> findByNombreGenero(String nombreGenero);

}
