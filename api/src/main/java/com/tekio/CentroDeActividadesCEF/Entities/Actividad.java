package com.tekio.CentroDeActividadesCEF.Entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "actividades")
public class Actividad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String nombre;

    @NotBlank
    private String profesor;

    @NotBlank
    private String horario;

    @Min(0)
    private Integer cupos;

    public Actividad() {
    }

    public Actividad(Long id, String nombre, String profesor, String horario, Integer cupos) {
        this.id = id;
        this.nombre = nombre;
        this.profesor = profesor;
        this.horario = horario;
        this.cupos = cupos;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getProfesor() {
        return profesor;
    }

    public String getHorario() {
        return horario;
    }

    public Integer getCupos() {
        return cupos;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setProfesor(String profesor) {
        this.profesor = profesor;
    }

    public void setHorario(String horario) {
        this.horario = horario;
    }

    public void setCupos(Integer cupos) {
        this.cupos = cupos;
    }
}