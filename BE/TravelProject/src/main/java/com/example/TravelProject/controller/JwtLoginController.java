package com.example.TravelProject.Controller;

import com.example.TravelProject.DTO.JwtLoginRequest;
import com.example.TravelProject.DTO.JwtResponse;
import com.example.TravelProject.Jwt.JwtProvider;
import com.example.TravelProject.Repository.UserAccount.UserRepository;
import com.example.TravelProject.entity.UserAccount.User;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequiredArgsConstructor
@RequestMapping("/app")
public class JwtLoginController {
    private final JwtProvider jwtUProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody JwtLoginRequest loginRequest) {

        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElse(null);

        if (user == null || !passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(401).body("아이디 또는 비밀번호가 올바르지 않습니다.");
        }

        // 유저 역할 추출 및 JWT 발급
        String role = user.getUserRole();
        String token = jwtUProvider.createJwt(user.getUsername(), role, 1000 * 60 * 60L); // 1시간 유효

        return ResponseEntity.ok(new JwtResponse(token));
    }
}
