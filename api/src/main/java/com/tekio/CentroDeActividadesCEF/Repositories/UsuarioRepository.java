package com.tekio.CentroDeActividadesCEF.Repositories;

import com.tekio.CentroDeActividadesCEF.Entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    boolean existsByCorreo(String correo);
    Usuario findByCorreo (String correo);
    long countByEstadoIgnoreCase(String estado);
    java.util.List<Usuario> findByRol_IdRol(Integer idRol);
}
