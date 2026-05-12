package com.tekio.CentroDeActividadesCEF.DTO;

import tools.jackson.databind.ObjectMapper;

public class MailConCodigo {

    private String correo;
    private String codigo;

    public MailConCodigo (String correo, String codigo){
        this.correo = correo;
        this.codigo = codigo;
    }
    public String toJsonString(ObjectMapper mapper) {
        try {
            return mapper.writeValueAsString(this);
        } catch (Exception e) {
            throw new RuntimeException("No se pudo serializar a JSON", e);
        }
    }
}


