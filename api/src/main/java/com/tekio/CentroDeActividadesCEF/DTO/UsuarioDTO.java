package com.tekio.CentroDeActividadesCEF.DTO;

public class UsuarioDTO {

    private Integer Id;
    private String nombre;
    private String apellido;
    private String dni;
    private String fechaNacimiento; // formato DD/MM/AAAA
    private String genero;
    private String telefono;
    private String correo;
    private String rol;

    public UsuarioDTO(Integer userId, String nombre, String apellido, String dni, String fechaNacimiento, String genero, String telefono, String correo, String rol) {
        this.Id = userId;
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.fechaNacimiento = fechaNacimiento;
        this.genero = genero;
        this.telefono = telefono;
        this.correo = correo;
        this.rol = rol;
    }

    public Integer getId() {
        return Id;
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

    public String getGenero() {
        return genero;
    }

    public String getTelefono() {
        return telefono;
    }

    public String getCorreo() {
        return correo;
    }

    public String getRol() {
        return rol;
    }
}
