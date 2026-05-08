package com.tekio.CentroDeActividadesCEF.Entities;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
public class FichaMedica {

    @Id
    @GeneratedValue (strategy = IDENTITY)
    private Integer idFichaMedica;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idUsuario", nullable = false, unique = true)
    private Usuario usuario;

}
