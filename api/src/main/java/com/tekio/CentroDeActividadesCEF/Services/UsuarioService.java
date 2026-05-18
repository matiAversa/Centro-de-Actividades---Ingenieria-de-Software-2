package com.tekio.CentroDeActividadesCEF.Services;

import com.tekio.CentroDeActividadesCEF.DTO.CrearUsuarioRequest;
import com.tekio.CentroDeActividadesCEF.DTO.LoginDTO;
import com.tekio.CentroDeActividadesCEF.DTO.UsuarioDTO;
import com.tekio.CentroDeActividadesCEF.Entities.Genero;
import com.tekio.CentroDeActividadesCEF.Entities.Rol;
import com.tekio.CentroDeActividadesCEF.Entities.Usuario;
import com.tekio.CentroDeActividadesCEF.Repositories.GeneroRepository;
import com.tekio.CentroDeActividadesCEF.Repositories.RolRepository;
import com.tekio.CentroDeActividadesCEF.Repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
public class UsuarioService {

    private UsuarioRepository usuarioRepository;
    private GeneroRepository generoRepository;
    private RolRepository rolRepository;


    @Autowired
    public UsuarioService (UsuarioRepository usuarioRepository, GeneroRepository generoRepository, RolRepository rolRepository){
        this.usuarioRepository = usuarioRepository;
        this.generoRepository = generoRepository;
        this.rolRepository = rolRepository;
    }

    public boolean existeCorreo(String email) {
        if (email == null) return false;
        String normalized = email.trim().toLowerCase();
        return usuarioRepository.existsByCorreo(normalized);
    }

    public Usuario almacenarUsuario (Usuario datos){
        return this.usuarioRepository.save(datos);
    }

    public Usuario crearUsuarioConRol(CrearUsuarioRequest datos) {
        if (datos == null || !datos.validarDatos()) {
            throw new RuntimeException("Error en la validacion de datos.");
        }

        String correoNormalizado = datos.getCorreo().trim().toLowerCase(Locale.ROOT);
        if (existeCorreo(correoNormalizado)) {
            throw new RuntimeException("El mail ya esta registrado en el sistema.");
        }

        Genero genero = generoRepository.findById(datos.getGenero())
                .orElseThrow(() -> new RuntimeException("Genero no encontrado"));

        String rolSolicitado = datos.getRol() == null || datos.getRol().isBlank()
                ? "RECEPCIONISTA"
                : datos.getRol().trim().toUpperCase(Locale.ROOT);

        Rol rol = rolRepository.findByNombreRol(rolSolicitado)
                .orElseGet(() -> rolRepository.save(new Rol(rolSolicitado)));

        Usuario nuevoUsuario = new Usuario(
                datos.getNombre().trim(),
                datos.getApellido().trim(),
                datos.getDni().trim(),
                datos.getFechaNacimiento().trim(),
                genero,
                datos.getTelefono().trim(),
                correoNormalizado,
                datos.getContrasena(),
                rol
        );

        nuevoUsuario.normalizarDatos();
        return this.usuarioRepository.save(nuevoUsuario);

    }

    public Usuario encontrarConCorreo (String mail){
        return this.usuarioRepository.findByCorreo(mail);
    }

    public Usuario buscarPorId(Integer id) {
        return this.usuarioRepository.findById(id)
                .orElseThrow();
    }

    public List<Usuario> obtenerSocios() {
        return usuarioRepository.findByRolIdRol(3);

    }
    
    public Usuario actualizarUsuarioDesdeDTO(Integer id, UsuarioDTO dto) {
        Usuario u = this.usuarioRepository.findById(id).orElseThrow();

        if (dto.getNombre() != null && !dto.getNombre().isBlank()) u.setNombre(dto.getNombre().trim());
        if (dto.getApellido() != null && !dto.getApellido().isBlank()) u.setApellido(dto.getApellido().trim());
        if (dto.getDni() != null && !dto.getDni().isBlank()) u.setDni(dto.getDni().trim());
        if (dto.getFechaNacimiento() != null && !dto.getFechaNacimiento().isBlank()) u.setFechaNacimiento(dto.getFechaNacimiento().trim());
        if (dto.getTelefono() != null && !dto.getTelefono().isBlank()) u.setTelefono(dto.getTelefono().trim());

        if (dto.getCorreo() != null && !dto.getCorreo().isBlank()){
            String normalized = dto.getCorreo().trim().toLowerCase();
            if (!normalized.equals(u.getCorreo()) && existeCorreo(normalized)) {
                throw new RuntimeException("El mail ya esta registrado en el sistema.");
            }
            u.setCorreo(normalized);
        }

        if (dto.getGenero() != null && !dto.getGenero().isBlank()){
            java.util.Optional<Genero> generoOpt = this.generoRepository.findByNombreGenero(dto.getGenero().trim());
            if (generoOpt.isPresent()){
                u.setGenero(generoOpt.get());
            } else {
                throw new RuntimeException("Genero no encontrado");
            }
        }

        u.normalizarDatos();
        return this.usuarioRepository.save(u);
    }

}
