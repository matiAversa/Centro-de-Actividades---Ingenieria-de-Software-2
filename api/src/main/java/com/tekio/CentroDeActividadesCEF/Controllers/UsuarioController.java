package com.tekio.CentroDeActividadesCEF.Controllers;

import com.tekio.CentroDeActividadesCEF.Auxiliar.VerificationCode;
import com.tekio.CentroDeActividadesCEF.DTO.*;
import com.tekio.CentroDeActividadesCEF.Entities.Usuario;
import com.tekio.CentroDeActividadesCEF.Services.EmailService;
import com.tekio.CentroDeActividadesCEF.Services.UsuarioPendienteService;
import com.tekio.CentroDeActividadesCEF.Services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;

@CrossOrigin(origins = "http://localhost:5173")
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

    @PostMapping("/EnvioDeCodigo")
    public ResponseEntity<String> EnvioDeCodigo(@RequestBody SignUpRequest body){
        try {
        if (!body.ValidarDatos()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error en la validacion de datos.");
        }
        if (usuarioService.existeCorreo(body.getCorreo())){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El mail ya esta registrado en el sistema.");
        }
        if (!esMayorDe14(body.getFechaNacimiento())){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El usuario debe ser mayor de 14 años de edad.");

        }
        String codigoCorreo = VerificationCode.generarCodigoCorreo();
        this.usuarioPendienteService.almacenarUsuario(body, codigoCorreo);
        this.emailService.sendVerificationCode(body.getCorreo(), codigoCorreo);
        return ResponseEntity.status(HttpStatus.OK).body(body.getCorreo());
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("error en endpoint '/EnvioDeCodigo'");
        }
    }

    private Boolean esMayorDe14 (String fechaString) {

        if (fechaString.isEmpty()) return false;
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        LocalDate fechaLD = LocalDate.parse(fechaString, dateFormatter);
        int edad = Period.between(fechaLD, LocalDate.now()).getYears();

        return edad >= 14;
    }

    @PostMapping("/ValidarCodigo")
    public ResponseEntity<String> ValidarCodigo  (@RequestBody MailConCodigo body){

        try{
            if (this.usuarioPendienteService.validarCodigo (body)){
                this.usuarioService.almacenarUsuario(this.usuarioPendienteService.getUsusarioWithCorreo(body.getCorreo()));
                this.usuarioPendienteService.borrarPendiente(body.getCorreo());
                return ResponseEntity.status(HttpStatus.OK).body("");
            }else{
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("el codigo no es correcto, intentarlo nuevamente.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("error en endpoint '/ValidarCodigo'");

        }

    }

    @PostMapping("/eliminarPendiente")
    public ResponseEntity<String> eliminarPendiente (@RequestBody String mail){
        try {
            this.usuarioPendienteService.borrarPendiente(mail);
            return ResponseEntity.status(HttpStatus.OK).body("se elimino el usuario pendiente");
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("error en endpoint '/verificado'");
        }
    }

    @PostMapping("/ReenviarCodigo")
    public ResponseEntity<String> ReenviarCodigo (@RequestBody MailConCodigo body){
        String correo = body.getCorreo();
        try{

            String nuevoCodigoCorreo = VerificationCode.generarCodigoCorreo();
            this.usuarioPendienteService.actualizarCodigo(correo, nuevoCodigoCorreo);
            this.emailService.sendVerificationCode(correo, nuevoCodigoCorreo);

            return ResponseEntity.status(HttpStatus.OK).body("se reenvio el codigo correctamente al mail: " + correo);

        }catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("error en endpoint '/ReenviarCodigo'");

        }

    }

    @PostMapping({"/CrearRecepcionista", "/api/User/CrearRecepcionista"})
    public ResponseEntity<Usuario> CrearRecepcionista(@RequestBody CrearUsuarioRequest body){
        try {
            Usuario usuarioCreado = this.usuarioService.crearUsuarioConRol(body);
            return ResponseEntity.status(HttpStatus.CREATED).body(usuarioCreado);
        }catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping ("/Login")
    public ResponseEntity<?> Login (@RequestBody LoginDTO body ){

        try {
            System.out.println(body.toString());
            Usuario user = usuarioService.encontrarConCorreo(body.getMail());
            if (user == null){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("no existe el usuario");
            }
            if (user.compararPasswords(body.getPassword())){
                return ResponseEntity.status(HttpStatus.OK).body(new LoginResponseDTO(user.getId(), user.getRol()));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("password incorrecta");
        } catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("error 500");
        }

    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUsuario(@PathVariable Integer id) {
        Usuario u = usuarioService.buscarPorId(id);
        if (u == null) {
            return ResponseEntity.notFound().build();
        }
        UsuarioDTO dto = new UsuarioDTO(
                u.getId(),
                u.getNombre(),
                u.getApellido(),
                u.getDni(),
                u.getFechaNacimiento(),
                u.getGenero().getNombreGenero(),
                u.getTelefono(),
                u.getCorreo(),
                u.getRol()
        );
        return ResponseEntity.ok(dto);
    }




}
