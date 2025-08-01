package com.example.TravelProject.jwt;

import com.example.TravelProject.dto.login.UserDTO;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;

    public JwtFilter(JwtProvider jwtProvider) {
        this.jwtProvider = jwtProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String requestUri = request.getRequestURI();

        // 로그인 및 OAuth2 관련 요청은 JWT 검사 건너뜀
        if (requestUri.matches("^/app/login(?:/.*)?$") || requestUri.matches("^/app/oauth2(?:/.*)?$")) {
            filterChain.doFilter(request, response);
            return;
        }
        System.out.println("requestUri: "+requestUri);
        String token = null;

        // 1. 먼저 Authorization 헤더에서 토큰 확인
        String headerAuth = request.getHeader("Authorization");
        if (headerAuth != null && !headerAuth.isEmpty()) {
            if (headerAuth.startsWith("Bearer ")) {
                token = headerAuth.substring(7).trim();  // 공백 제거 추가
            } else {
                token = headerAuth.trim();  // 공백 제거 추가
            }
            System.out.println("JWT from Header: " + token);
        }

        // 2. 헤더에 없으면 쿠키에서 찾기
        if (token == null) {
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    System.out.println(cookie);
                    if ("Authorization".equals(cookie.getName()) || "access_token".equals(cookie.getName())) {
                        token = cookie.getValue();
                        System.out.println("JWT from Cookie: " + token);
                        break;
                    }
                }
            }
        }

        // 3. 여전히 없으면 필터 통과
        if (token == null) {
            System.out.println("JWT not found");
            filterChain.doFilter(request, response);
            return;
        }

        // 4. 만료된 토큰은 거부
        if (jwtProvider.isExpired(token)) {
            System.out.println("JWT expired");
            filterChain.doFilter(request, response);
            return;
        }

        // 5. 토큰에서 사용자 정보 추출
        String username = jwtProvider.getUsername(token);
        String role = jwtProvider.getRole(token);

        UserDTO userDTO = new UserDTO();
        userDTO.setUsername(username);
        userDTO.setRole(role);

        filterChain.doFilter(request, response);
    }
}
