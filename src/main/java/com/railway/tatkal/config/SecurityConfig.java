package com.railway.tatkal.config;

import com.railway.tatkal.auth.security.JwtAuthenticationFilter;
import com.railway.tatkal.auth.service.CustomUserDetailsService;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(
            CustomUserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder
    ) {
        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(userDetailsService);

        provider.setPasswordEncoder(passwordEncoder);

        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {
        return configuration.getAuthenticationManager();
    }

        @Bean
        public SecurityFilterChain securityFilterChain(
                HttpSecurity http,
                AuthenticationProvider authenticationProvider,
                JwtAuthenticationFilter jwtAuthenticationFilter
        ) throws Exception {

                http
                        .csrf(csrf -> csrf.disable())
                        .authenticationProvider(authenticationProvider)
                        .authorizeHttpRequests(auth -> auth
                                .requestMatchers(
                                        "/api/v1/auth/register",
                                        "/api/v1/auth/login"
                                ).permitAll()
                                .anyRequest().authenticated()
                        )
                        .exceptionHandling(exception -> exception
                                .authenticationEntryPoint(
                                        (request, response, authException) ->
                                                response.sendError(
                                                        HttpServletResponse.SC_UNAUTHORIZED,
                                                        "Authentication required"
                                                )
                                )
                        )
                        .addFilterBefore(
                                jwtAuthenticationFilter,
                                UsernamePasswordAuthenticationFilter.class
                        );
                return http.build();
        }

        @Bean
        public AuthenticationEntryPoint authenticationEntryPoint() {
        return (request, response, exception) ->
                response.sendError(
                        HttpServletResponse.SC_UNAUTHORIZED,
                        "Authentication required"
                );
        }
}