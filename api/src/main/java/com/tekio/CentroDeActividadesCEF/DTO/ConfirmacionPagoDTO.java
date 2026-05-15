package com.tekio.CentroDeActividadesCEF.DTO;

import java.io.Serializable;

public class ConfirmacionPagoDTO implements Serializable {

    private String paymentId;
    private String status;
    private Long externalReference;
    private Double monto;
    private Long usuarioId;
    private Long claseId;

    public ConfirmacionPagoDTO() {
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getExternalReference() {
        return externalReference;
    }

    public void setExternalReference(Long externalReference) {
        this.externalReference = externalReference;
    }

    public Double getMonto() {
        return monto;
    }

    public void setMonto(Double monto) {
        this.monto = monto;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public Long getClaseId() {
        return claseId;
    }

    public void setClaseId(Long claseId) {
        this.claseId = claseId;
    }
}