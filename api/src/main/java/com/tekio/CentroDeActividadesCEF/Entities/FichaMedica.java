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
    @JoinColumn(name = "id_usuario", nullable = false, unique = true) // FK en ficha_medica
    private Usuario usuario;

}
