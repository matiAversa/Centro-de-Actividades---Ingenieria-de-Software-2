package com.tekio.CentroDeActividadesCEF.DTO;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class LoginDTO {

    private String email;
    private String password;


    public LoginDTO (String email, String password){
        System.out.println("que aparece en el constr---"+ email);
        this.password = encriptar(password);
        this.email = email;
    }

    public String getMail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    private String encriptar (String passwordParam){

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String hash = passwordEncoder.encode(passwordParam);
        return hash;
    }

    @Override
    public String toString() {
        return "LoginDTO{" +
                "mail='" + email + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
