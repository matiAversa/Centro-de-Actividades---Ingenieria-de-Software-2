package com.tekio.CentroDeActividadesCEF.Controllers;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.*;
import com.mercadopago.resources.preference.Preference;
import com.tekio.CentroDeActividadesCEF.DTO.CarritoDTO;
import com.tekio.CentroDeActividadesCEF.Entities.Pago;
import com.tekio.CentroDeActividadesCEF.Services.PagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Arrays;
import org.springframework.beans.factory.annotation.Value;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import org.springframework.http.ResponseEntity;


@RestController
@RequestMapping("/api/pagos")
@CrossOrigin(origins = "https://ambush-unlucky-morally.ngrok-free.dev")
public class PagoController {

    @Value("${mercado_pago.access_token}")
    String accessToken;

    @Autowired
    private PagoService pagoService;

    @PostMapping("/crear-preferencia")
    public String crear(@RequestBody CarritoDTO carrito) {
        System.out.println("Procesando pago para: " + carrito.getNombre());

        MercadoPagoConfig.setAccessToken(accessToken);
        PreferenceClient client = new PreferenceClient();

        try {
            PreferenceItemRequest item = PreferenceItemRequest.builder()
                    .title(carrito.getNombre())
                    .quantity(1)
                    .unitPrice(new BigDecimal(carrito.getPrecio().toString()))
                    .currencyId("ARS")
                    .build();

            PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                    .success("https://ambush-unlucky-morally.ngrok-free.dev/success")
                    .pending("https://ambush-unlucky-morally.ngrok-free.dev/pending")
                    .failure("https://ambush-unlucky-morally.ngrok-free.dev/failure")
                    .build();

            System.out.println(backUrls);

            PreferenceRequest request = PreferenceRequest.builder()
                    .items(Collections.singletonList(item))
                    .backUrls(backUrls)
                    .autoReturn("approved")
                    .build();

            Preference preference = client.create(request);
            return preference.getId();

        } catch (MPApiException e) {
            System.err.println("Código MP: " + e.getApiResponse().getStatusCode());
            System.err.println("Cuerpo del error: " + e.getApiResponse().getContent());
            return "Error de MP: " + e.getApiResponse().getContent();
        } catch (Exception e) {
            e.printStackTrace();
            return "Error general: " + e.getMessage();
        }
    }

    @GetMapping("/socio/{id}")
    public ResponseEntity<List<Pago>> getPagosPorId(@PathVariable("id") Long id) {
        List<Pago> pagos = pagoService.getPagosPorUsuario(id);

        if (pagos.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(pagos);
    }
}