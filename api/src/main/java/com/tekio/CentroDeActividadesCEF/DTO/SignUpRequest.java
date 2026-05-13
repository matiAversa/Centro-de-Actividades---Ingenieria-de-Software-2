package com.tekio.CentroDeActividadesCEF.DTO;

import com.tekio.CentroDeActividadesCEF.Entities.Genero;

public class SignUpRequest {

    private String nombre;
    private String apellido;
    private String dni;
    private String telefono;
    private String correo;
    private String contrasena;
    private Integer genero;          // o Integer generoId
    private String fechaNacimiento;

    public SignUpRequest(String nombre, String apellido, String dni, String telefono, String correo, String contrasena, Integer genero, String fechaNacimiento) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.telefono = telefono;
        this.correo = correo;
        this.contrasena = contrasena;
        this.genero = genero;
        this.fechaNacimiento = fechaNacimiento;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }

    public Integer getGenero() {
        return genero;
    }

    public void setGenero(Integer genero) {
        this.genero = genero;
    }

    public String getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(String fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public boolean ValidarDatos (){

        if (nombre.isEmpty()){
            return false;
        }
        if (apellido.isEmpty()){
            return false;
        }
        if (dni.isEmpty()){
            return false;
        }
        if (telefono.isEmpty()){
            return false;
        }
        if (correo.isEmpty() && correo.contains("@") && correo.contains(".com")){
            return false;
        }
        if (contrasena.isEmpty()){
            return false;
        }
        if (genero == null){
            return false;
        }
        if (fechaNacimiento.isEmpty()){
            return false;
        }
        return true;

    }

}
