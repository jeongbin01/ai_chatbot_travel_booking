package com.example.TravelProject.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;


import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtProvider {
    private Key key;
    private final long ACCESS_TOKEN_VALIDITY = 1000L * 60 * 60;      // 1시간
    private final long REFRESH_TOKEN_VALIDITY = 1000L * 60 * 60 * 24; // 24시간
    @Value("${jwt.secret}")
    private String jwtSecret;
    @PostConstruct
    public void init() {
        byte[] secretBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        key = Keys.hmacShaKeyFor(secretBytes);
    }

    public String createAccessToken(String subject) {
        Date now = new Date();
        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + ACCESS_TOKEN_VALIDITY))
                .signWith(key)
                .compact();
    }

    public String createRefreshToken(String subject) {
        Date now = new Date();
        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + REFRESH_TOKEN_VALIDITY))
                .signWith(key)
                .compact();
    }

    public Jws<Claims> parseToken(String token) throws JwtException {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
    }
    public String getUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("username", String.class);
    }

    public String getRole(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("role", String.class);
    }

    public Boolean isExpired(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)    // 변경
                .getBody()
                .getExpiration()
                .before(new Date());
    }

    public String createJwt(String username, String role, Long expiredMs) {
        Claims claims = Jwts.claims();
        claims.put("username", username);
        claims.put("role", role);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiredMs))
                .signWith(key)
                .compact();
    }
}
