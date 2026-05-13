package com.tekio.CentroDeActividadesCEF.Services;

import com.tekio.CentroDeActividadesCEF.DTO.SignUpRequest;
import com.tekio.CentroDeActividadesCEF.Entities.Usuario;
import com.tekio.CentroDeActividadesCEF.Repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    private UsuarioRepository usuarioRepository;


    @Autowired
    public UsuarioService (UsuarioRepository usuarioRepository){
        this.usuarioRepository = usuarioRepository;
    }

    public boolean existeCorreo(String email) {
        if (email == null) return false;
        String normalized = email.trim().toLowerCase();
        return usuarioRepository.existsByCorreo(normalized);
    }

    public void almacenarUsuario (Usuario datos){
        this.usuarioRepository.save(datos);

    }

}
