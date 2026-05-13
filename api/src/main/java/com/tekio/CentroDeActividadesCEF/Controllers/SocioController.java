package com.tekio.CentroDeActividadesCEF.Controllers;

import com.tekio.CentroDeActividadesCEF.Entities.Socio;
import com.tekio.CentroDeActividadesCEF.Services.SocioService;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/socios")
@CrossOrigin(origins = "http://localhost:5173")
public class SocioController {

    private final SocioService socioService;

    public SocioController(SocioService socioService) {
        this.socioService = socioService;
    }

    @GetMapping
    public List<Socio> obtenerTodos() {
        return socioService.obtenerTodos();
    }

    @GetMapping("/{id}")
    public Socio obtenerPorId(@PathVariable Long id) {
        return socioService.obtenerPorId(id);
    }

    @PostMapping
    public Socio crear(@Validated @RequestBody Socio socio) {
        return socioService.crear(socio);
    }

    @PutMapping("/{id}")
    public Socio actualizar(
            @PathVariable Long id,
            @Validated @RequestBody Socio socio) {
        return socioService.actualizar(id, socio);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        socioService.eliminar(id);
    }
}