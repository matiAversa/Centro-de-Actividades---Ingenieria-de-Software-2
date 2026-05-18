package com.tekio.CentroDeActividadesCEF.DTO;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class LoginDTO {

    private String email;
    private String password;


    public LoginDTO (String email, String password){
        //this.password = encriptar(password);
        this.password = password;
        this.email = email;
    }

    public String getMail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    private String encriptar (String passwordParam){
        System.out.println("password q llega del login antes de encode: -- "+ passwordParam);
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
