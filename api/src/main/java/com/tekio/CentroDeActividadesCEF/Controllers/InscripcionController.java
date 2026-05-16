package com.tekio.CentroDeActividadesCEF.Controllers;

import com.tekio.CentroDeActividadesCEF.DTO.ConfirmacionPagoDTO;
import com.tekio.CentroDeActividadesCEF.DTO.InscripcionMensualRequest;
import com.tekio.CentroDeActividadesCEF.Entities.Inscripcion;
import com.tekio.CentroDeActividadesCEF.Services.InscripcionService;
import com.tekio.CentroDeActividadesCEF.Services.PagoService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inscripciones")
@CrossOrigin(origins = "http://localhost:5173")
public class InscripcionController {

    private final InscripcionService inscripcionService;

    public InscripcionController(
            InscripcionService inscripcionService) {
        this.inscripcionService = inscripcionService;
    }

    @GetMapping
    public List<Inscripcion> obtenerTodas() {
        return inscripcionService.obtenerTodas();
    }

    @GetMapping("/socio/{socioId}")
    public List<Inscripcion> obtenerPorSocio(
            @PathVariable Long socioId) {
        return inscripcionService.obtenerPorSocio(
                socioId);
    }

    @PostMapping
    public Inscripcion crear(
            @RequestParam Long socioId,
            @RequestParam Long claseId) {
        return inscripcionService.crear(
                socioId,
                claseId);
    }

    @PostMapping("/mensual")
    public List<Inscripcion> crearMensual(
            @RequestBody InscripcionMensualRequest request) {
        return inscripcionService.crearMensual(
                request);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        inscripcionService.eliminar(id);
    }

    @Autowired
    private PagoService pagoService;

    @PostMapping("/confirmar")
    @Transactional
    public ResponseEntity<?> confirmar(@RequestBody ConfirmacionPagoDTO datos) {
        try {
            pagoService.procesarExito(datos);
            inscripcionService.crear(datos.getUsuarioId(), datos.getClaseId());
            return ResponseEntity.ok(Map.of("message", "Proceso completado con éxito"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al procesar: " + e.getMessage());
        }
    }
}
