package com.tekio.CentroDeActividadesCEF.DTO;

import java.time.LocalDate;

public class InscripcionMensualRequest {

    private Integer socioId;
    private Long actividadId;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;

    public InscripcionMensualRequest(Integer socioId, Long actividadId, LocalDate fechaInicio, LocalDate fechaFin) {
        this.socioId = socioId;
        this.actividadId = actividadId;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
    }

    public Integer getSocioId() {
        return socioId;
    }

    public void setSocioId(Integer socioId) {
        this.socioId = socioId;
    }

    public Long getActividadId() {
        return actividadId;
    }

    public void setActividadId(Long actividadId) {
        this.actividadId = actividadId;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }
}