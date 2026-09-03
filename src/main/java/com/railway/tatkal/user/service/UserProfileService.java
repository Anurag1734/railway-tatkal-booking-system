package com.railway.tatkal.user.service;

import com.railway.tatkal.auth.service.CurrentUserService;
import com.railway.tatkal.common.exception.ResourceNotFoundException;
import com.railway.tatkal.user.dto.UserProfileResponse;
import com.railway.tatkal.user.entity.User;
import com.railway.tatkal.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserProfileService {

    private final CurrentUserService currentUserService;
    private final UserRepository userRepository;

    public UserProfileService(
            CurrentUserService currentUserService,
            UserRepository userRepository
    ) {
        this.currentUserService = currentUserService;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUserProfile() {
        String email = currentUserService.getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        return new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().name(),
                user.getStatus().name(),
                user.getCreatedAt()
        );
    }
}
