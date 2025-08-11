package com.example.TravelProject.config;

import com.example.TravelProject.oauth.OAuth2SuccessHandler;
import com.example.TravelProject.service.PrincipalOauth2UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Collections;

@Configuration
@EnableWebSecurity
public class JwtSecuritConfig implements WebMvcConfigurer {

    private final PrincipalOauth2UserService principalOauth2UserService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    public JwtSecuritConfig(PrincipalOauth2UserService principalOauth2UserService,
                            OAuth2SuccessHandler oAuth2SuccessHandler) {
        this.principalOauth2UserService = principalOauth2UserService;
        this.oAuth2SuccessHandler = oAuth2SuccessHandler;
    }


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(corsConfigurer -> corsConfigurer.configurationSource(corsConfigurationSource()))

                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/app/signup","/app/login", "/app/login/oauth2/**", "/app/**","/error", 
                        		"/swagger-ui/**", "/v3/api-docs/**","/swagger-resources/**","/webjars/**").permitAll()
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )

                .oauth2Login(oauth2 -> oauth2
                        .loginPage("/app/login")
                        .redirectionEndpoint(redir -> redir
                                .baseUri("/app/login/oauth2/code/*")
                        )
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(principalOauth2UserService)
                        )
                        .successHandler(oAuth2SuccessHandler)
                )



;



        return http.build();
    }

    //  CORS 설정
    CorsConfigurationSource corsConfigurationSource() {
        return request -> {
            CorsConfiguration config = new CorsConfiguration();
            config.setAllowedHeaders(Collections.singletonList("*"));
            config.setAllowedMethods(Collections.singletonList("*"));
            config.setAllowedOriginPatterns(Collections.singletonList("http://localhost:3000")); // ⭐️ 허용할 origin
            config.setAllowCredentials(true);
            return config;
        };
    }
}
