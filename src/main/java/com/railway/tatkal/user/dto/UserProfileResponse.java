package com.railway.tatkal.user.dto;

import java.time.LocalDateTime;

public record UserProfileResponse(
        Long userId,
        String name,
        String email,
        String phone,
        String role,
        String status,
        LocalDateTime createdAt
) {
}
