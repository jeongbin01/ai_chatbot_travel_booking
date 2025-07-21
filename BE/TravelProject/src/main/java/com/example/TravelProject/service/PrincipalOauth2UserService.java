package com.example.TravelProject.Service;


import com.example.TravelProject.DTO.GoogleOAuth2User;
import com.example.TravelProject.Repository.UserAccount.SocialAccountRepository;
import com.example.TravelProject.Repository.UserAccount.UserRepository;
import com.example.TravelProject.entity.UserAccount.SocialAccount;
import com.example.TravelProject.entity.UserAccount.User;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class PrincipalOauth2UserService extends DefaultOAuth2UserService {
    private final UserRepository userRepository;
    private final SocialAccountRepository socialAccountRepository;

    public PrincipalOauth2UserService(UserRepository userRepository,
                                      SocialAccountRepository socialAccountRepository) {
        this.userRepository = userRepository;
        this.socialAccountRepository = socialAccountRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String provider = userRequest.getClientRegistration().getRegistrationId();

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = User.builder()
                    .email(email)
                    .username(name)
                    .userRole("USER")
                    .passwordHash("SOCIAL_LOGIN")
                    .build();
            return userRepository.save(newUser);
        });

        Optional<SocialAccount> socialOpt = socialAccountRepository.findByUserAndProvider(user, provider);
        if (socialOpt.isEmpty()) {
            SocialAccount socialAccount = SocialAccount.builder()
                    .user(user)
                    .provider(provider)
                    .last_synced_date(LocalDateTime.now())
                    .build();
            socialAccountRepository.save(socialAccount);
        }

        return new GoogleOAuth2User(oAuth2User);
    }
}
