package com.tekio.CentroDeActividadesCEF.Controllers;

import com.tekio.CentroDeActividadesCEF.Auxiliar.VerificationCode;
import com.tekio.CentroDeActividadesCEF.DTO.MailConCodigo;
import com.tekio.CentroDeActividadesCEF.DTO.SignUpRequest;
import com.tekio.CentroDeActividadesCEF.Services.EmailService;
import com.tekio.CentroDeActividadesCEF.Services.UsuarioPendienteService;
import com.tekio.CentroDeActividadesCEF.Services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping ("/User")
public class UsuarioController {

    UsuarioService usuarioService;
    UsuarioPendienteService usuarioPendienteService;
    EmailService emailService;


    @Autowired
    public UsuarioController (UsuarioService usuarioService, EmailService emailService, UsuarioPendienteService usuarioPendienteService){
        this.usuarioService = usuarioService;
        this.emailService = emailService;
        this.usuarioPendienteService = usuarioPendienteService;
    }

    @PostMapping("/validacion")
    public ResponseEntity<String> validacion(@RequestBody SignUpRequest body){
        try {
        if (!body.ValidarDatos()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error en alguna validacion de datos");
        }
        if (usuarioService.existeCorreo(body.getCorreo())){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("el mail ya existe en el sistema");
        }
        VerificationCode generadorCodigo = new VerificationCode();
        String codigoCorreo = generadorCodigo.generarCodigoCorreo();
        this.emailService.sendVerificationCode(body.getCorreo(), codigoCorreo);
        this.usuarioPendienteService.almacenarUsuario(body);
        return ResponseEntity.status(HttpStatus.OK).body(new MailConCodigo(body.getCorreo(), codigoCorreo).toString());
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("error en endpoint '/verificado'");
        }
    }

    @PostMapping("/verficado")
    public ResponseEntity<String> verificado (@RequestBody String mail){
        try {
            this.usuarioService.almacenarUsuario(this.usuarioPendienteService.getUsusarioWithCorreo(mail));
            return ResponseEntity.status(HttpStatus.OK).body("usuario guardado correctamente");
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("error en endpoint '/verificado'");
        }
    }

    @PostMapping("/eliminarPendiente")
    public ResponseEntity<String> eliminarPendiente (@RequestBody String mail){
        try {
            this.usuarioPendienteService.deleteWithCorreo(mail);
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("error en endpoint '/verificado'");
        }
    }


}
