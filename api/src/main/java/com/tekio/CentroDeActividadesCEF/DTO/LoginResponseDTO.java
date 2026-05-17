package com.tekio.CentroDeActividadesCEF.DTO;

public class LoginResponseDTO {

    private Integer userId;
    private String rol;

    public LoginResponseDTO(Integer userId, String rol) {
        this.userId = userId;
        this.rol = rol;
    }

    public Integer getUserId() {
        return userId;
    }

    public String getRol() {
        return rol;
    }
}
