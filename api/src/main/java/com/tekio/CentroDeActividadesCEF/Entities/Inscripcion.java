package com.tekio.CentroDeActividadesCEF.Entities;

import jakarta.persistence.*;

@Entity
@Table(name = "inscripciones")
public class Inscripcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Socio socio;

    @ManyToOne
    private Actividad actividad;

    private String fechaInscripcion;

    public Inscripcion() {
    }

    public Inscripcion(Long id, Socio socio, Actividad actividad, String fechaInscripcion) {
        this.id = id;
        this.socio = socio;
        this.actividad = actividad;
        this.fechaInscripcion = fechaInscripcion;
    }

    public Long getId() {
        return id;
    }

    public Socio getSocio() {
        return socio;
    }

    public Actividad getActividad() {
        return actividad;
    }

    public String getFechaInscripcion() {
        return fechaInscripcion;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setSocio(Socio socio) {
        this.socio = socio;
    }

    public void setActividad(Actividad actividad) {
        this.actividad = actividad;
    }

    public void setFechaInscripcion(String fechaInscripcion) {
        this.fechaInscripcion = fechaInscripcion;
    }
}