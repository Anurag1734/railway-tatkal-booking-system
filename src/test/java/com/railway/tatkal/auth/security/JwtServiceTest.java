package com.railway.tatkal.auth.security;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTest {

    private static final String SECRET = "7f3c9a2e81d64b5f93a17c8e42d0ab6f5c91e7d34a8b26f019d5e63c74a92b18";

    @Test
    void shouldGenerateAndValidateTokenWithSameSecret() {
        JwtService jwtService = new JwtService(SECRET, 86_400_000L);

        String token = jwtService.generateToken("user@example.com");

        assertThat(jwtService.isTokenValid(token)).isTrue();
        assertThat(jwtService.extractEmail(token)).isEqualTo("user@example.com");
    }

    @Test
    void shouldRejectTokenSignedWithDifferentSecret() {
        JwtService jwtService = new JwtService(SECRET, 86_400_000L);
        JwtService anotherService = new JwtService("a6f7e91bd21ff4c8e3cf3d902c6b78125a904b4ff4c93fd5ca68a1d0232f1ba", 86_400_000L);

        String token = anotherService.generateToken("user@example.com");

        assertThat(jwtService.isTokenValid(token)).isFalse();
    }
}
