package com.tekio.CentroDeActividadesCEF.Controllers;

import com.tekio.CentroDeActividadesCEF.DTO.CrearClasesRecurrentesRequest;
import com.tekio.CentroDeActividadesCEF.Entities.Clase;
import com.tekio.CentroDeActividadesCEF.Services.ClaseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clases")
@CrossOrigin(origins = "http://localhost:5173")
public class ClaseController {

    private final ClaseService claseService;

    public ClaseController(ClaseService claseService) {
        this.claseService = claseService;
    }

    @GetMapping
    public List<Clase> obtenerTodas() {
        return claseService.obtenerTodas();
    }

    @GetMapping("/proximas")
    public List<Clase> obtenerProximas() {
        return claseService.obtenerProximas();
    }

    @PostMapping
    public Clase crear(
            @RequestParam Long actividadId,
            @RequestBody Clase clase) {
        return claseService.crear(actividadId, clase);
    }

    @PostMapping("/recurrentes")
    public List<Clase> crearRecurrentes(
            @RequestBody CrearClasesRecurrentesRequest request) {
        return claseService.crearRecurrentes(request);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        claseService.eliminar(id);
    }
}