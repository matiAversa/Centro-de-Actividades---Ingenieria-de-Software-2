package com.tekio.CentroDeActividadesCEF.Services;

import com.tekio.CentroDeActividadesCEF.DTO.SignUpRequest;
import com.tekio.CentroDeActividadesCEF.Entities.Usuario;
import com.tekio.CentroDeActividadesCEF.Entities.UsuarioPendiente;
import com.tekio.CentroDeActividadesCEF.Repositories.UsuarioPendienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioPendienteService {

    private final UsuarioPendienteRepository usuarioPendienteRepository;

    @Autowired
    public UsuarioPendienteService(
            UsuarioPendienteRepository usuarioPendienteRepository) {
        this.usuarioPendienteRepository = usuarioPendienteRepository;
    }

    public boolean existeEmail(String email) {
        if (email == null)
            return false;

        String normalized = email.trim().toLowerCase();

        return usuarioPendienteRepository
                .existsByCorreo(normalized);
    }

    public void almacenarUsuario(
            SignUpRequest datos) {
        this.usuarioPendienteRepository.save(
                new UsuarioPendiente(datos));
    }

    public Usuario getUsusarioWithCorreo(
            String mail) {
        UsuarioPendiente up = this.usuarioPendienteRepository
                .findByCorreo(mail);

        return up.pendienteAUsuario();
    }

    public void deleteWithCorreo(
            String mail) {
        this.usuarioPendienteRepository
                .deleteByCorreo(mail);
    }
}