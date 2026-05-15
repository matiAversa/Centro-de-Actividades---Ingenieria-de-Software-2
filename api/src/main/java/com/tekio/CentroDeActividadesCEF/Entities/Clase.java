package com.tekio.CentroDeActividadesCEF.Entities;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "clases")
public class Clase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate fecha;

    private LocalTime horaInicio;

    private LocalTime horaFin;

    private String profesor;

    private Integer cupoMaximo;

    private Integer cuposDisponibles;

    private String estado;

    private Double precio;

    @ManyToOne
    @JoinColumn(name = "actividad_id")
    private Actividad actividad;

    public Clase() {
    }

    public Long getId() {
        return id;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public LocalTime getHoraFin() {
        return horaFin;
    }

    public String getProfesor() {
        return profesor;
    }

    public Integer getCupoMaximo() {
        return cupoMaximo;
    }

    public Integer getCuposDisponibles() {
        return cuposDisponibles;
    }

    public String getEstado() {
        return estado;
    }

    public Actividad getActividad() {
        return actividad;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public void setHoraFin(LocalTime horaFin) {
        this.horaFin = horaFin;
    }

    public void setProfesor(String profesor) {
        this.profesor = profesor;
    }

    public void setCupoMaximo(Integer cupoMaximo) {
        this.cupoMaximo = cupoMaximo;
    }

    public void setCuposDisponibles(Integer cuposDisponibles) {
        this.cuposDisponibles = cuposDisponibles;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public void setActividad(Actividad actividad) {
        this.actividad = actividad;
    }

    public Double getPrecio() {
        return precio;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }
}