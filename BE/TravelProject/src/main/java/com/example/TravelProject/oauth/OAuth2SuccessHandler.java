package com.example.TravelProject.oauth;

import com.example.TravelProject.dto.GoogleOAuth2User;
import com.example.TravelProject.entity.useraccount.User;
import com.example.TravelProject.jwt.JwtProvider;
import com.example.TravelProject.repository.UserAccount.UserRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        GoogleOAuth2User customUser = (GoogleOAuth2User) authentication.getPrincipal();
        String email = customUser.getEmail();
        String username = customUser.getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String accessToken = jwtProvider.createAccessToken(email);
        String refreshToken = jwtProvider.createRefreshToken(email);

//        String redirectUrl = "http://localhost:3000/oauth/callback" +
//                "?accessToken=" + URLEncoder.encode(accessToken, StandardCharsets.UTF_8) +
//                "&refreshToken=" + URLEncoder.encode(refreshToken, StandardCharsets.UTF_8) +
//                "&username=" + URLEncoder.encode(username, StandardCharsets.UTF_8)+
//                "&email=" + URLEncoder.encode(email, StandardCharsets.UTF_8);`
//
//        response.sendRedirect(redirectUrl);
        String accessTokenCookie = String.format("jwtToken=%s; Path=/; Max-Age=%d; HttpOnly; Secure; SameSite=Strict",
                accessToken, 60 * 62);
        response.addHeader("Set-Cookie", accessTokenCookie);

        String refreshTokenCookie = String.format("refreshToken=%s; Path=/; Max-Age=%d; HttpOnly; Secure; SameSite=Strict",
                refreshToken, 60 * 20);
        response.addHeader("Set-Cookie", refreshTokenCookie);

        String usernameCookie = String.format("username=%s; Path=/; Max-Age=%d; SameSite=Strict",
                username, 60 * 20);
        response.addHeader("Set-Cookie", usernameCookie);

        String emailCookie = String.format("email=%s; Path=/; Max-Age=%d; SameSite=Strict",
                email, 60 * 20);
        response.addHeader("Set-Cookie", emailCookie);

        // 직접 홈페이지로 리다이렉트
        response.sendRedirect("http://localhost:3000/");
    }
}
