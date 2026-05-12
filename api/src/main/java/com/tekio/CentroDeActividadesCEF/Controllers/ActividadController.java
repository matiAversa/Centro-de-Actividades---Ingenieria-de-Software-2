package com.tekio.CentroDeActividadesCEF.Controllers;

import com.tekio.CentroDeActividadesCEF.Entities.Actividad;
import com.tekio.CentroDeActividadesCEF.Services.ActividadService;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/actividades")
@CrossOrigin(origins = "http://localhost:5173")
public class ActividadController {

    private final ActividadService actividadService;

    public ActividadController(ActividadService actividadService) {
        this.actividadService = actividadService;
    }

    @GetMapping
    public List<Actividad> obtenerTodas() {
        return actividadService.obtenerTodas();
    }

    @PostMapping
    public Actividad crear(@Validated @RequestBody Actividad actividad) {
        return actividadService.crear(actividad);
    }

    @PutMapping("/{id}")
    public Actividad actualizar(
            @PathVariable Long id,
            @Validated @RequestBody Actividad actividad) {
        return actividadService.actualizar(id, actividad);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        actividadService.eliminar(id);
    }
}