/*
package com.tekio.CentroDeActividadesCEF.Services;

import com.tekio.CentroDeActividadesCEF.Entities.Socio;
import com.tekio.CentroDeActividadesCEF.Repositories.SocioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SocioService {

    private final SocioRepository socioRepository;

    public SocioService(SocioRepository socioRepository) {
        this.socioRepository = socioRepository;
    }

    public List<Socio> obtenerTodos() {
        return socioRepository.findAll();
    }

    public Socio crear(Socio socio) {
        if (socio.getCuota() == null || socio.getCuota().isBlank()) {
            socio.setCuota("Pendiente");
        }

        if (socio.getEstado() == null || socio.getEstado().isBlank()) {
            socio.setEstado("Activo");
        }

        return socioRepository.save(socio);
    }

    public Socio obtenerPorId(Long id) {
        return socioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Socio no encontrado"));
    }

    public Socio actualizar(Long id, Socio datos) {
        Socio socio = socioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Socio no encontrado"));

        socio.setNombre(datos.getNombre());
        socio.setEmail(datos.getEmail());
        socio.setTelefono(datos.getTelefono());
        socio.setFechaNacimiento(datos.getFechaNacimiento());
        socio.setCuota(datos.getCuota());
        socio.setEstado(datos.getEstado());

        return socioRepository.save(socio);
    }

    public void eliminar(Long id) {
        socioRepository.deleteById(id);
    }
}

 */