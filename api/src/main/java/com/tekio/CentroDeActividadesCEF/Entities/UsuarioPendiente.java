package com.tekio.CentroDeActividadesCEF.Entities;

import com.tekio.CentroDeActividadesCEF.DTO.SignUpRequest;
import jakarta.persistence.*;
import org.antlr.v4.runtime.misc.NotNull;

@Entity
public class UsuarioPendiente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    @NotNull
    private String nombre;

    @NotNull
    private String apellido;

    @NotNull
    private String dni;

    @NotNull
    private String fechaNacimiento; // formato DD/MM/AAAA

    @NotNull
    private Integer genero;

    @NotNull
    private String telefono;

    @NotNull
    @Column(unique = true, nullable = false)
    private String correo;

    @NotNull
    private String contrasena;

    @NotNull
    private String codigo;


    public UsuarioPendiente() {
    }

    public UsuarioPendiente(String nombre, String apellido, String dni, String fechaNacimiento, Integer genero, String telefono, String correo, String contrasena) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.fechaNacimiento = fechaNacimiento;
        this.genero = genero;
        this.telefono = telefono;
        this.correo = correo;
        this.contrasena = contrasena;
    }

    public UsuarioPendiente (SignUpRequest datos, String codigo){

            this.apellido = datos.getApellido();
            this.dni = datos.getDni();
            this.nombre = datos.getNombre();
            this.contrasena = datos.getContrasena();
            this.genero = datos.getGenero();
            this.correo = datos.getCorreo();
            this.fechaNacimiento = datos.getFechaNacimiento();
            this.telefono = datos.getTelefono();
            this.codigo = codigo;

    }

    public String getCodigo (){
        return this.codigo;
    }

    public Integer getGenero (){
        return this.genero;
    }

    public void actualizarCodigo (String codigoNuevo){
        this.codigo = codigoNuevo;
    }

    public Usuario pendienteAUsuario (Genero genero, Rol rol){
        Usuario u = new Usuario(nombre, apellido, dni, fechaNacimiento, genero, telefono, correo, contrasena, rol);
        u.normalizarDatos();
        return u;
    }
}