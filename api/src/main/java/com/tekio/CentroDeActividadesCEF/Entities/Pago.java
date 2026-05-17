package com.tekio.CentroDeActividadesCEF.Entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pagos")
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "mp_payment_id", unique = true)
    private String mpPaymentId;

    private Double monto;

    private String moneda = "ARS";

    @Column(name = "fecha_pago")
    private LocalDateTime fechaPago;

    private String estado;

    private String metodo;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario socio;

    @ManyToOne
    @JoinColumn(name = "clase_id", nullable = true)
    private Clase clase;

    public Pago() {
    }

    public Pago(String mpPaymentId, Double monto, String estado, Usuario socio) {
        this.mpPaymentId = mpPaymentId;
        this.monto = monto;
        this.estado = estado;
        this.socio = socio;
        this.fechaPago = LocalDateTime.now();
        this.metodo = "Mercado Pago";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMpPaymentId() { return mpPaymentId; }
    public void setMpPaymentId(String mpPaymentId) { this.mpPaymentId = mpPaymentId; }

    public Double getMonto() { return monto; }
    public void setMonto(Double monto) { this.monto = monto; }

    public LocalDateTime getFechaPago() { return fechaPago; }
    public void setFechaPago(LocalDateTime fechaPago) { this.fechaPago = fechaPago; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public Usuario getSocio() { return socio; }
    public void setSocio(Usuario socio) { this.socio = socio; }

    public String getMetodo() { return metodo; }
    public void setMetodo(String metodo) { this.metodo = metodo; }

    public Clase getClase() { return clase; }
    public void setClase(Clase clase) { this.clase = clase; }
}