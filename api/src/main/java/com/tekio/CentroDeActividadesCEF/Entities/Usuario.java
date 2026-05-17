package com.tekio.CentroDeActividadesCEF.Entities;
import jakarta.persistence.*;
import org.antlr.v4.runtime.misc.NotNull;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Locale;


@Entity
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private String nombre;

    @NotNull
    private String apellido;

    @NotNull
    private String dni;

    @NotNull
    private String fechaNacimiento; // formato DD/MM/AAAA

    @NotNull
    @JoinColumn(name = "idGenero", nullable = false)
    @ManyToOne (fetch = FetchType.EAGER, optional = false)
    private Genero genero;

    @NotNull
    private String telefono;

    @NotNull
    @Column(unique = true, nullable = false)
    private String correo;

    @NotNull
    private String contrasena;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "idRol", nullable = false)
    private Rol rol;

    private String estado;


    @OneToOne(mappedBy = "usuario", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private FichaMedica fichaMedica;

    public Usuario() {
    }

    public Usuario(String nombre, String apellido, String dni, String fechaNacimiento, Genero genero, String telefono, String correo, String contrasena, Rol rol) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.fechaNacimiento = fechaNacimiento;
        this.genero = genero;
        this.telefono = telefono;
        this.correo = correo;
        this.contrasena = contrasena;
        this.rol = rol;
    }

    public void normalizarDatos(){

        this.correo = this.correo.trim().toLowerCase();

    }

    public Boolean compararPasswords (String pass){
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        return passwordEncoder.matches(this.contrasena, pass);
    }

    public String getRol (){
        return this.rol.getIdRol().toString();
    }

    public Integer getId() {
        return this.id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public String getDni() {
        return dni;
    }

    public String getFechaNacimiento() {
        return fechaNacimiento;
    }

    public Genero getGenero() {
        return genero;
    }

    public String getTelefono() {
        return telefono;
    }

    public String getCorreo() {
        return correo;
    }

    public String getEstado() {
        return estado;
    }
}
