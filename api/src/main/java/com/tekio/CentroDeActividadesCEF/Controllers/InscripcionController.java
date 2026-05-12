package com.tekio.CentroDeActividadesCEF.Controllers;

import com.tekio.CentroDeActividadesCEF.Entities.Inscripcion;
import com.tekio.CentroDeActividadesCEF.Services.InscripcionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inscripciones")
@CrossOrigin(origins = "http://localhost:5173")
public class InscripcionController {

    private final InscripcionService inscripcionService;

    public InscripcionController(InscripcionService inscripcionService) {
        this.inscripcionService = inscripcionService;
    }

    @GetMapping
    public List<Inscripcion> obtenerTodas() {
        return inscripcionService.obtenerTodas();
    }

    @PostMapping
    public Inscripcion crear(
            @RequestParam Long socioId,
            @RequestParam Long actividadId) {
        return inscripcionService.crear(socioId, actividadId);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        inscripcionService.eliminar(id);
    }
}