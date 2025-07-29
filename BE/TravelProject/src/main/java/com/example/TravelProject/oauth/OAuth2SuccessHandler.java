package com.example.TravelProject.oauth;

import com.example.TravelProject.dto.login.GoogleOAuth2User;
import com.example.TravelProject.entity.useraccount.SocialAccount;
import com.example.TravelProject.entity.useraccount.User;
import com.example.TravelProject.jwt.JwtProvider;
import com.example.TravelProject.repository.UserAccount.SocialAccountRepository;
import com.example.TravelProject.repository.UserAccount.UserRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;
    private final SocialAccountRepository socialAccountRepository;
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

        int oauthSelect = 1;
        String encodedAccessToken = URLEncoder.encode(accessToken, StandardCharsets.UTF_8);
        String encodedRefreshToken = URLEncoder.encode(refreshToken, StandardCharsets.UTF_8);
        String encodedEmail = URLEncoder.encode(email, StandardCharsets.UTF_8);
        String encodedUsername = URLEncoder.encode(username, StandardCharsets.UTF_8);
        Integer userid = user.getUserId();
        List<SocialAccount> socialAccounts = socialAccountRepository.findByUserUserId(user.getUserId());
        Integer socialId = socialAccounts.isEmpty() ? null : socialAccounts.get(0).getSocialAccountId();

        String accessTokenCookie = String.format("jwtToken=%s; Path=/; Max-Age=%d; SameSite=Strict",
                encodedAccessToken, 60 * 22);

        String refreshTokenCookie = String.format("refreshToken=%s; Path=/; Max-Age=%d; SameSite=Strict",
                encodedRefreshToken, 60 * 20);

        String emailCookie = String.format("email=%s; Path=/; Max-Age=%d; SameSite=Strict",
                encodedEmail, 60 * 20);

        String usernameCookie = String.format("username=%s; Path=/; Max-Age=%d; SameSite=Strict",
                encodedUsername, 60 * 20);
        String userIdCookie = String.format("userId=%d; Path=/; Max-Age=%d; SameSite=Strict", userid, 60 * 20);
        String oauthSelectCookie = String.format("oauthSelect=%d; Path=/; Max-Age=%d; SameSite=Strict", oauthSelect, 60 * 20);
        response.addHeader("Set-Cookie", userIdCookie);
        response.addHeader("Set-Cookie", refreshTokenCookie);
        response.addHeader("Set-Cookie", oauthSelectCookie);
        response.addHeader("Set-Cookie", usernameCookie);
        response.addHeader("Set-Cookie", emailCookie);
        response.addHeader("Set-Cookie", accessTokenCookie);
        if (socialId != null) {
            response.addHeader("Set-Cookie", String.format("socialId=%d; Path=/; Max-Age=%d; SameSite=Strict", socialId, 60 * 20));
        }
        // 직접 홈페이지로 리다이렉트
        response.sendRedirect("http://localhost:3000/");
    }
}
