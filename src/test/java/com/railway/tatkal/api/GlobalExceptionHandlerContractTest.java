package com.railway.tatkal.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.railway.tatkal.common.exception.DuplicateResourceException;
import com.railway.tatkal.common.exception.ForbiddenOperationException;
import com.railway.tatkal.common.exception.GlobalExceptionHandler;
import com.railway.tatkal.common.exception.ResourceNotFoundException;
import com.railway.tatkal.common.exception.SeatNotAvailableException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class GlobalExceptionHandlerContractTest {

    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void shouldReturnValidationErrorPayload() throws Exception {
        MockMvc mockMvc = buildMockMvc();

        mockMvc.perform(post("/validate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": ""
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.message").value("Request validation failed"))
                .andExpect(jsonPath("$.fieldErrors.name").exists());
    }

    @Test
    void shouldReturnBadRequestPayload() throws Exception {
        buildMockMvc().perform(get("/bad-request"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("BAD_REQUEST"))
                .andExpect(jsonPath("$.message").value("Invalid booking payload"));
    }

    @Test
    void shouldReturnNotFoundPayload() throws Exception {
        buildMockMvc().perform(get("/not-found"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("RESOURCE_NOT_FOUND"))
                .andExpect(jsonPath("$.message").value("Booking not found"));
    }

    @Test
    void shouldReturnConflictPayload() throws Exception {
        buildMockMvc().perform(get("/conflict"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("RESOURCE_CONFLICT"))
                .andExpect(jsonPath("$.message").value("Seat is currently being processed"));
    }

    @Test
    void shouldReturnDuplicateResourceConflictPayload() throws Exception {
        buildMockMvc().perform(get("/duplicate"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("RESOURCE_ALREADY_EXISTS"))
                .andExpect(jsonPath("$.message").value("Email already registered"));
    }

    @Test
    void shouldReturnForbiddenPayload() throws Exception {
        buildMockMvc().perform(get("/forbidden"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value("FORBIDDEN"))
                .andExpect(jsonPath("$.message").value("You are not authorized to access this booking"));
    }

    @Test
    void shouldReturnSanitizedInternalServerErrorPayload() throws Exception {
        buildMockMvc().perform(get("/unexpected"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.code").value("INTERNAL_SERVER_ERROR"))
                .andExpect(jsonPath("$.message").value("An unexpected error occurred"));
    }

    private MockMvc buildMockMvc() {
        LocalValidatorFactoryBean validator = new LocalValidatorFactoryBean();
        validator.afterPropertiesSet();

        return MockMvcBuilders
                .standaloneSetup(new ExceptionThrowingController())
                .setControllerAdvice(new GlobalExceptionHandler())
                .setMessageConverters(new MappingJackson2HttpMessageConverter(objectMapper))
                .setValidator(validator)
                .build();
    }

    @RestController
    private static class ExceptionThrowingController {

        @PostMapping("/validate")
        void validate(@Valid @RequestBody ValidationPayload payload) {
        }

        @GetMapping("/bad-request")
        void badRequest() {
            throw new IllegalArgumentException("Invalid booking payload");
        }

        @GetMapping("/not-found")
        void notFound() {
            throw new ResourceNotFoundException("Booking not found");
        }

        @GetMapping("/conflict")
        void conflict() {
            throw new SeatNotAvailableException("Seat is currently being processed");
        }

        @GetMapping("/duplicate")
        void duplicate() {
            throw new DuplicateResourceException("Email already registered");
        }

        @GetMapping("/forbidden")
        void forbidden() {
            throw new ForbiddenOperationException(
                    "You are not authorized to access this booking"
            );
        }

        @GetMapping("/unexpected")
        void unexpected() {
            throw new RuntimeException("sensitive stack message");
        }
    }

    private record ValidationPayload(
            @NotBlank String name
    ) {
    }
}
