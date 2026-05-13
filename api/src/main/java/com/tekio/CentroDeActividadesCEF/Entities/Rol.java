package com.tekio.CentroDeActividadesCEF.Entities;

import jakarta.persistence.*;
import org.antlr.v4.runtime.misc.NotNull;

import java.util.ArrayList;
import java.util.List;

import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
public class Rol {

    @Id
    @GeneratedValue (strategy = IDENTITY)
    private Integer idRol;

    @NotNull
    private String nombreRol;

    @OneToMany(mappedBy = "rol", fetch = FetchType.LAZY)
    private List<Usuario> personas = new ArrayList<>();


    public Rol() {
    }
}
