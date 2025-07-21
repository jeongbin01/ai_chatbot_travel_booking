package com.example.TravelProject.securityadmin;

import com.example.TravelProject.entity.administer.AdminUser;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@RequiredArgsConstructor
public class AdminUserDetails implements UserDetails {

    private final AdminUser adminUser;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + adminUser.getRole())
        );
    }

    @Override
    public String getPassword() {
        return adminUser.getPasswordHash();
    }

    @Override
    public String getUsername() {
        return adminUser.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // 필요한 로직으로 수정 가능
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // 계정 잠금 여부 로직
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // 비밀번호 만료 여부
    }

    @Override
    public boolean isEnabled() {
        return true; // 계정 활성 여부
    }
}