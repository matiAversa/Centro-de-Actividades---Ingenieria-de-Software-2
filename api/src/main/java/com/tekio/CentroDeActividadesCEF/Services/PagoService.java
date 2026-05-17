package com.tekio.CentroDeActividadesCEF.Services;
import com.tekio.CentroDeActividadesCEF.DTO.ConfirmacionPagoDTO;
import com.tekio.CentroDeActividadesCEF.Entities.*;
import com.tekio.CentroDeActividadesCEF.Repositories.ClaseRepository;
import com.tekio.CentroDeActividadesCEF.Repositories.InscripcionRepository;
import com.tekio.CentroDeActividadesCEF.Repositories.PagoRepository;
import com.tekio.CentroDeActividadesCEF.Repositories.UsuarioRepository;
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
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ClaseRepository claseRepository;

    @Transactional
    public void procesarExito(ConfirmacionPagoDTO datos) {
        if (pagoRepository.findByMpPaymentId(datos.getPaymentId()).isPresent()) {
            return;
        }
        Usuario socio = usuarioRepository.findById(datos.getUsuarioId())
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));


        Clase clase = claseRepository.findById(datos.getClaseId().longValue())
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