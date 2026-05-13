package com.tekio.CentroDeActividadesCEF.Entities;

import jakarta.persistence.*;
import org.antlr.v4.runtime.misc.NotNull;

import java.util.ArrayList;
import java.util.List;

import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
public class Genero {
    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Integer idGenero;

    @NotNull
    private String nombreGenero;

    @OneToMany (mappedBy = "genero", fetch = FetchType.LAZY)
    private List<Usuario> personas = new ArrayList<>();


    public String getNombreGenero() {
        return nombreGenero;
    }

    public Genero() {
    }
}
