package com.tekio.CentroDeActividadesCEF.Controllers;

import com.tekio.CentroDeActividadesCEF.DTO.DashboardResumenResponse;
import com.tekio.CentroDeActividadesCEF.Repositories.ActividadRepository;
import com.tekio.CentroDeActividadesCEF.Repositories.ClaseRepository;
import com.tekio.CentroDeActividadesCEF.Repositories.InscripcionRepository;
import com.tekio.CentroDeActividadesCEF.Repositories.SocioRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final SocioRepository socioRepository;
    private final ActividadRepository actividadRepository;
    private final InscripcionRepository inscripcionRepository;
    private final ClaseRepository claseRepository;

    public DashboardController(
            SocioRepository socioRepository,
            ActividadRepository actividadRepository,
            InscripcionRepository inscripcionRepository,
            ClaseRepository claseRepository) {
        this.socioRepository = socioRepository;
        this.actividadRepository = actividadRepository;
        this.inscripcionRepository = inscripcionRepository;
        this.claseRepository = claseRepository;
    }

    @GetMapping("/resumen")
    public DashboardResumenResponse obtenerResumen() {
        return new DashboardResumenResponse(
                socioRepository.countByEstadoIgnoreCase("Activo"),
                actividadRepository.count(),
                inscripcionRepository.count(),
                claseRepository.countByCuposDisponiblesLessThanEqual(0));
    }
}