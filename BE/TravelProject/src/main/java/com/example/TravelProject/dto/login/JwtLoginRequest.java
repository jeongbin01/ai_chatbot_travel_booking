package com.example.TravelProject.dto.login;

import lombok.Getter;

@Getter
public class JwtLoginRequest {
    private String username;
    private String password;
}
