package com.tekio.CentroDeActividadesCEF.Services;

import com.tekio.CentroDeActividadesCEF.DTO.MailConCodigo;
import com.tekio.CentroDeActividadesCEF.DTO.SignUpRequest;
import com.tekio.CentroDeActividadesCEF.Entities.Genero;
import com.tekio.CentroDeActividadesCEF.Entities.Rol;
import com.tekio.CentroDeActividadesCEF.Entities.Usuario;
import com.tekio.CentroDeActividadesCEF.Entities.UsuarioPendiente;
import com.tekio.CentroDeActividadesCEF.Repositories.GeneroRepository;
import com.tekio.CentroDeActividadesCEF.Repositories.RolRepository;
import com.tekio.CentroDeActividadesCEF.Repositories.UsuarioPendienteRepository;
import com.tekio.CentroDeActividadesCEF.Repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioPendienteService {


    private UsuarioPendienteRepository usuarioPendienteRepository;
    private GeneroRepository generoRepository;
    private RolRepository rolRepository;


    @Autowired
    public UsuarioPendienteService (UsuarioPendienteRepository usuarioPendienteRepository, GeneroRepository generoRepository, RolRepository rolRepository){
        this.usuarioPendienteRepository = usuarioPendienteRepository;
        this.generoRepository = generoRepository;
        this.rolRepository = rolRepository;
    }

    public boolean existeEmail(String email) {
        if (email == null) return false;
        String normalized = email.trim().toLowerCase();
        return usuarioPendienteRepository.existsByCorreo(normalized);
    }

    public void almacenarUsuario (SignUpRequest datos, String codigo){
        this.usuarioPendienteRepository.save(new UsuarioPendiente(datos, codigo));
    }

    public Usuario getUsusarioWithCorreo (String mail){

        UsuarioPendiente up = this.usuarioPendienteRepository.findByCorreo(mail);
        Genero genero = generoRepository.findById(up.getGenero()).orElse(null);
        Rol rol = this.rolRepository.findById(1).orElse(null);
        return up.pendienteAUsuario(genero, rol);
    }

    public void deleteWithCorreo (String mail){
        this.usuarioPendienteRepository.deleteByCorreo(mail);
    }

    public Boolean validarCodigo (MailConCodigo data){
        UsuarioPendiente up = usuarioPendienteRepository.findByCorreo(data.getCorreo());
        if (data.getCodigo().equals(up.getCodigo())){
            return true;
        }
        return false;
    }

}
