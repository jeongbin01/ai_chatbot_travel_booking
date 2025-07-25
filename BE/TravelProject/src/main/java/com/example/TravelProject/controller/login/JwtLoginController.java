package com.example.TravelProject.controller.login;

import com.example.TravelProject.dto.JwtLoginRequest;
import com.example.TravelProject.dto.JwtResponse;
import com.example.TravelProject.dto.SignupRequest;
import com.example.TravelProject.entity.useraccount.User;
import com.example.TravelProject.jwt.JwtProvider;
import com.example.TravelProject.repository.UserAccount.UserRepository;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;


//@CrossOrigin(origins = "*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/app")
public class JwtLoginController {
    private final JwtProvider jwtUProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody JwtLoginRequest loginRequest, HttpServletResponse response) throws IOException {
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElse(null);

        if (user == null || !passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(401).body("아이디 또는 비밀번호가 올바르지 않습니다.");
        }
        String role = user.getUserRole();
        String accessToken = jwtUProvider.createJwt(user.getUsername(), role, 1000 * 60 * 60L); // 1시간 유효
        String refreshToken = jwtUProvider.createJwt(user.getUsername(), role, 1000 * 60 * 60L); // 1시간 유효

        String username = user.getUsername();
        String email = user.getEmail(); // email 필드가 없으면 제외하거나 수정

        // Set-Cookie 헤더 설정
//        response.addHeader("Set-Cookie", String.format("jwtToken=%s; Path=/; Max-Age=%d; HttpOnly; Secure; SameSite=Strict", accessToken, 60 * 60));
//        response.addHeader("Set-Cookie", String.format("refreshToken=%s; Path=/; Max-Age=%d; HttpOnly; Secure; SameSite=Strict", refreshToken, 60 * 60));
        response.addHeader("Set-Cookie", String.format("jwtToken=%s; Path=/; Max-Age=%d; SameSite=Strict", accessToken, 60 * 60));
        response.addHeader("Set-Cookie", String.format("refreshToken=%s; Path=/; Max-Age=%d; SameSite=Strict", refreshToken, 60 * 60));
        response.addHeader("Set-Cookie", String.format("username=%s; Path=/; Max-Age=%d; SameSite=Strict", username, 60 * 60));
        response.addHeader("Set-Cookie", String.format("email=%s; Path=/; Max-Age=%d; SameSite=Strict", email, 60 * 60));

        Map<String, Object> body = new HashMap<>();
        body.put("message", "로그인 성공");
        body.put("username", username);
        body.put("email", email);
        return ResponseEntity.ok(body);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest request) {

        System.out.println("request : " + request.getEmail());
        System.out.println("request : " + request.getPhoneNumber());
        System.out.println("request : " + request.getNickname());

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("이미 존재하는 아이디입니다.");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("이미 존재하는 이메일입니다.");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .nickname(request.getNickname())
                .registrationDate(LocalDateTime.now())
                .userRole("USER") // 기본 역할 설정
                .build();

        userRepository.save(user);
        return ResponseEntity.ok("회원가입 완료");
    }

}
