package com.tekio.CentroDeActividadesCEF.DTO;

import tools.jackson.databind.ObjectMapper;

public class CarritoDTO {

    private String nombre;
    private Double precio;

    public CarritoDTO(String nombre, Double precio) {
        this.nombre = nombre;
        this.precio = precio;
    }

    public String getNombre() {
        return this.nombre;
    }

    public Double getPrecio() {
        return this.precio;
    }
}

