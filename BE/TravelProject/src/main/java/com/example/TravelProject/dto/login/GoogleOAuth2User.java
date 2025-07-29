package com.example.TravelProject.dto.login;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;

@RequiredArgsConstructor
public class GoogleOAuth2User implements OAuth2User {

    private final OAuth2User oAuth2User;

    @Override
    public Map<String, Object> getAttributes() {
        return oAuth2User.getAttributes();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return oAuth2User.getAuthorities();
    }

    @Override
    public String getName() {
        return oAuth2User.getName(); // 일반적으로 sub 또는 id 반환
    }

    public String getEmail() {
        return (String) oAuth2User.getAttributes().get("email");
    }

    public String getUsername() {
        return (String) oAuth2User.getAttributes().get("name");
    }

    public String getProviderId() {
        return (String) oAuth2User.getAttributes().get("id");
    }

    public String getProvider() {
        return (String) oAuth2User.getAttributes().get("Provider");
    }
}

