package com.tekio.CentroDeActividadesCEF.Services;
import com.tekio.CentroDeActividadesCEF.DTO.ConfirmacionPagoDTO;
import com.tekio.CentroDeActividadesCEF.Entities.Clase;
import com.tekio.CentroDeActividadesCEF.Entities.Inscripcion;
import com.tekio.CentroDeActividadesCEF.Entities.Pago;
import com.tekio.CentroDeActividadesCEF.Entities.Socio;
import com.tekio.CentroDeActividadesCEF.Repositories.ClaseRepository;
import com.tekio.CentroDeActividadesCEF.Repositories.InscripcionRepository;
import com.tekio.CentroDeActividadesCEF.Repositories.PagoRepository;
import com.tekio.CentroDeActividadesCEF.Repositories.SocioRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

import java.time.LocalDateTime;

@Service
public class PagoService {

    @Autowired
    private PagoRepository pagoRepository;

    @Autowired
    private InscripcionRepository inscripcionRepository;

    @Autowired
    private SocioRepository socioRepository;

    @Autowired
    private ClaseRepository claseRepository;

    @Transactional
    public void procesarExito(ConfirmacionPagoDTO datos) {
        if (pagoRepository.findByMpPaymentId(datos.getPaymentId()).isPresent()) {
            return;
        }
        Socio socio = socioRepository.findById(datos.getUsuarioId())
                .orElseThrow(() -> new EntityNotFoundException("Socio no encontrado"));

        Clase clase = claseRepository.findById(datos.getClaseId())
                .orElseThrow(() -> new EntityNotFoundException("Clase no encontrada"));

        Pago nuevoPago = new Pago();
        nuevoPago.setMpPaymentId(datos.getPaymentId());
        nuevoPago.setMonto(datos.getMonto());
        nuevoPago.setEstado(datos.getStatus());
        nuevoPago.setSocio(socio);
        nuevoPago.setClase(clase);
        nuevoPago.setFechaPago(LocalDateTime.now());
        nuevoPago.setMetodo("Mercado Pago");

        pagoRepository.save(nuevoPago);
    }

    public List<Pago> getPagosPorUsuario(Long usuarioId) {
        return pagoRepository.findBySocio_Id(usuarioId);
    }
}