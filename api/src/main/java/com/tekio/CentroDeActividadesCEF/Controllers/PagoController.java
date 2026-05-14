package com.tekio.CentroDeActividadesCEF.Controllers;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.*;
import com.mercadopago.resources.preference.Preference;
import com.tekio.CentroDeActividadesCEF.DTO.CarritoDTO;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.math.BigDecimal;
import java.util.Arrays;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/pagos")
@CrossOrigin(origins = "http://localhost:5173")
public class PagoController {

    @Value("${mercado_pago.access_token}")
    String accessToken;

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
                    .success("http://localhost:5173/success")
                    .pending("http://localhost:5173/pending")
                    .failure("http://localhost:5173/failure")
                    .build();

            PreferenceRequest request = PreferenceRequest.builder()
                    .items(Collections.singletonList(item))
                    .backUrls(backUrls)
                    //.autoReturn("appproved")
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
}