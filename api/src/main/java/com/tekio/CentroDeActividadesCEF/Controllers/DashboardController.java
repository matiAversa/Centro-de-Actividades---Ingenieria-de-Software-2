package com.tekio.CentroDeActividadesCEF.Controllers;

import com.tekio.CentroDeActividadesCEF.DTO.DashboardResumenResponse;
import com.tekio.CentroDeActividadesCEF.Repositories.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final UsuarioRepository usuarioRepository;
    private final ActividadRepository actividadRepository;
    private final InscripcionRepository inscripcionRepository;
    private final ClaseRepository claseRepository;

    public DashboardController(
            UsuarioRepository usuarioRepository,
            ActividadRepository actividadRepository,
            InscripcionRepository inscripcionRepository,
            ClaseRepository claseRepository) {
        this.usuarioRepository = usuarioRepository;
        this.actividadRepository = actividadRepository;
        this.inscripcionRepository = inscripcionRepository;
        this.claseRepository = claseRepository;
    }

    @GetMapping("/resumen")
    public DashboardResumenResponse obtenerResumen() {
        return new DashboardResumenResponse(
                usuarioRepository.countByEstadoIgnoreCase("Activo"),
                actividadRepository.count(),
                inscripcionRepository.count(),
                claseRepository.countByCuposDisponiblesLessThanEqual(0));
    }
}