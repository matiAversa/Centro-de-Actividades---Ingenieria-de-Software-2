package com.tekio.CentroDeActividadesCEF.DTO;

public class CrearUsuarioRequest {

	private String nombre;
	private String apellido;
	private String dni;
	private String telefono;
	private String correo;
	private String contrasena;
	private Integer genero;
	private String fechaNacimiento;
	private String rol;

	public CrearUsuarioRequest() {
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

	public String getRol() {
		return rol;
	}

	public void setRol(String rol) {
		this.rol = rol;
	}

	public boolean validarDatos() {
		return nombre != null && !nombre.isBlank()
				&& apellido != null && !apellido.isBlank()
				&& dni != null && !dni.isBlank()
				&& telefono != null && !telefono.isBlank()
				&& correo != null && correo.contains("@") && correo.contains(".")
				&& contrasena != null && !contrasena.isBlank()
				&& genero != null
				&& fechaNacimiento != null && !fechaNacimiento.isBlank()
				&& rol != null && !rol.isBlank();
	}
}