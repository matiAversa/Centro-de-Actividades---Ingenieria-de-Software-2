package com.tekio.CentroDeActividadesCEF.Entities;
import jakarta.persistence.*;


@Entity
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    private String nombre;

    private String apellido;

    private String dni;

    private String fechaNacimiento; // formato DD/MM/AAAA

//    @ManyToOne
//    private Genero genero;

    private String telefono;

    private String correo;

    private String contrasena;

//    @ManyToOne
//    private Rol rol;
//
//    @ManyToOne
//    private FichaMedica fichaMedica;
}
