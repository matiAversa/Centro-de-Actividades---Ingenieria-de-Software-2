package com.tekio.CentroDeActividadesCEF.Repositories;

import com.tekio.CentroDeActividadesCEF.Entities.UsuarioPendiente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioPendienteRepository extends JpaRepository<UsuarioPendiente, Long> {

    boolean existsByCorreo(String correo);
    UsuarioPendiente findByCorreo(String correo);
    void deleteByCorreo(String correo);


}
