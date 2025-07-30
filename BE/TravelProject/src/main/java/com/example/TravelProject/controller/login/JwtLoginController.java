package com.example.TravelProject.controller.login;

import com.example.TravelProject.dto.login.JwtLoginRequest;
import com.example.TravelProject.dto.login.SignupRequest;
import com.example.TravelProject.entity.useraccount.User;
import com.example.TravelProject.jwt.JwtProvider;
import com.example.TravelProject.repository.UserAccount.UserRepository;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
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
    
    @Operation(
    	    summary = "일반 로그인 (JWT 발급)",
    	    description = """
    	        사용자 아이디와 비밀번호를 검증한 후 accessToken 및 refreshToken을 발급합니다.
    	        또한 사용자 정보(nickname, username, email 등)를 쿠키로 저장합니다.
    	        성공 시 200 OK와 함께 사용자 정보를 JSON 형태로 반환합니다.
    	        """
    	)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody JwtLoginRequest loginRequest, HttpServletResponse response) throws IOException {
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElse(null);

        if (user == null || !passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(401).body("아이디 또는 비밀번호가 올바르지 않습니다.");
        }
        String role = user.getUserRole();
        String accessToken = jwtUProvider.createJwt(user.getUsername(), role, 1000 * 60 * 60L); // 1시간 유효
        String refreshToken = jwtUProvider.createJwt(user.getUsername(), role, 1000 * 60 * 60L  ); // 1시간 유효
        String nickname = user.getNickname();
        String username = user.getUsername();
        String email = user.getEmail(); // email 필드가 없으면 제외하거나 수정
        Integer userid = user.getUserId();
        int oauthSelect = 0;
        // Set-Cookie 헤더 설정
//        response.addHeader("Set-Cookie", String.format("jwtToken=%s; Path=/; Max-Age=%d; HttpOnly; Secure; SameSite=Strict", accessToken, 60 * 60));
//        response.addHeader("Set-Cookie", String.format("refreshToken=%s; Path=/; Max-Age=%d; HttpOnly; Secure; SameSite=Strict", refreshToken, 60 * 60));
        String encodedAccessToken = URLEncoder.encode(accessToken, StandardCharsets.UTF_8);
        String encodedNickname = URLEncoder.encode(nickname, StandardCharsets.UTF_8);
        String encodedRefreshToken = URLEncoder.encode(refreshToken, StandardCharsets.UTF_8);
        String encodedEmail = URLEncoder.encode(email, StandardCharsets.UTF_8);
        String encodedUsername = URLEncoder.encode(username, StandardCharsets.UTF_8);

        String accessTokenCookie = String.format("jwtToken=%s; Path=/; Max-Age=%d; SameSite=Strict",
                encodedAccessToken, 60 * 22);

        String refreshTokenCookie = String.format("refreshToken=%s; Path=/; Max-Age=%d; SameSite=Strict",
                encodedRefreshToken, 60 * 20);

        String emailCookie = String.format("email=%s; Path=/; Max-Age=%d; SameSite=Strict",
                encodedEmail, 60 * 20);

        String usernameCookie = String.format("username=%s; Path=/; Max-Age=%d; SameSite=Strict",
                encodedUsername, 60 * 20);
        String nicknameCookie = String.format("nickname=%s; Path=/; Max-Age=%d; SameSite=Strict",
                encodedNickname, 60 * 20);
        String userIdCookie = String.format("userId=%d; Path=/; Max-Age=%d; SameSite=Strict", userid, 60 * 20);
        String oauthSelectCookie = String.format("oauthSelect=%d; Path=/; Max-Age=%d; SameSite=Strict", oauthSelect, 60 * 20);
        response.addHeader("Set-Cookie", userIdCookie);
        response.addHeader("Set-Cookie", nicknameCookie);
        response.addHeader("Set-Cookie", refreshTokenCookie);
        response.addHeader("Set-Cookie", usernameCookie);
        response.addHeader("Set-Cookie", emailCookie);
        response.addHeader("Set-Cookie", oauthSelectCookie);
        response.addHeader("Set-Cookie", accessTokenCookie);
        Map<String, Object> body = new HashMap<>();
        body.put("message", "로그인 성공");
        body.put("username", username);
        body.put("email", email);
        body.put("userId", userid);
        return ResponseEntity.ok(body);
    }


    @Operation(
        summary = "회원가입",
        description = """
        사용자 정보를 입력받아 회원가입을 처리합니다.
        - 중복된 아이디 또는 이메일은 에러 반환
        - 비밀번호는 BCrypt로 암호화 저장
        - 기본 USER 권한 부여
        """
    )
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
