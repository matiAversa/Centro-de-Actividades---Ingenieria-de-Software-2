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
    @JoinColumn(name = "clase_id")
    private Clase clase;

    private String fechaInscripcion;

    private String estadoPago = "PENDIENTE_PAGO";

    public Inscripcion() {
    }

    public Inscripcion(
            Long id,
            Socio socio,
            Clase clase,
            String fechaInscripcion,
            String estadoPago) {
        this.id = id;
        this.socio = socio;
        this.clase = clase;
        this.fechaInscripcion = fechaInscripcion;
        this.estadoPago = estadoPago;
    }

    public Long getId() {
        return id;
    }

    public Socio getSocio() {
        return socio;
    }

    public Clase getClase() {
        return clase;
    }

    public String getFechaInscripcion() {
        return fechaInscripcion;
    }

    public String getEstadoPago() {
        return estadoPago;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setSocio(Socio socio) {
        this.socio = socio;
    }

    public void setClase(Clase clase) {
        this.clase = clase;
    }

    public void setFechaInscripcion(String fechaInscripcion) {
        this.fechaInscripcion = fechaInscripcion;
    }

    public void setEstadoPago(String estadoPago) {
        this.estadoPago = estadoPago;
    }
}