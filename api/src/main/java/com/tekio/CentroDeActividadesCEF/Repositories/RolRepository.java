package com.tekio.CentroDeActividadesCEF.Repositories;

import com.tekio.CentroDeActividadesCEF.Entities.Rol;
import com.tekio.CentroDeActividadesCEF.Entities.UsuarioPendiente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RolRepository extends JpaRepository<Rol, Integer> {
}
