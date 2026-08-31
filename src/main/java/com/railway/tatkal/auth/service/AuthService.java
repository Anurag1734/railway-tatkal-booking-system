package com.railway.tatkal.auth.service;

import com.railway.tatkal.auth.dto.RegisterRequest;
import com.railway.tatkal.auth.security.JwtService;
import com.railway.tatkal.user.entity.User;
import com.railway.tatkal.user.repository.UserRepository;
import com.railway.tatkal.common.exception.DuplicateResourceException;
import com.railway.tatkal.auth.dto.LoginRequest;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@Service
public class AuthService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final AuthenticationManager authenticationManager;
        private final JwtService jwtService;

        public AuthService(
                UserRepository userRepository,
                PasswordEncoder passwordEncoder,
                AuthenticationManager authenticationManager,
                JwtService jwtService
        ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        }

        public User register(RegisterRequest request) {

                if (userRepository.existsByEmail(request.email())) {
                throw new DuplicateResourceException("Email already registered");
                }

                if (userRepository.existsByPhone(request.phone())) {
                throw new DuplicateResourceException("Phone already registered");
                }

                String passwordHash =
                        passwordEncoder.encode(request.password());

                User user = new User(
                        request.name(),
                        request.email(),
                        request.phone(),
                        passwordHash
                );

                return userRepository.save(user);
        }   // <-- register() ends here

        public LoginResult login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found")
                );

        String accessToken = jwtService.generateToken(user.getEmail());

        return new LoginResult(
                user.getId(),
                accessToken
        );
}

        public record LoginResult(
                Long userId,
                String accessToken
        ) {
        }
}