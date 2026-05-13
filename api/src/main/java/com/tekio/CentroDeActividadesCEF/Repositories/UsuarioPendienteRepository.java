package com.tekio.CentroDeActividadesCEF.Repositories;

import com.tekio.CentroDeActividadesCEF.Entities.UsuarioPendiente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioPendienteRepository extends JpaRepository<UsuarioPendiente, Integer> {

    boolean existsByCorreo(String correo);
    UsuarioPendiente findByCorreo(String correo);
    void deleteByCorreo(String correo);


}
