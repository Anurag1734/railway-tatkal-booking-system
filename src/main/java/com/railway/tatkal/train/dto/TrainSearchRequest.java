package com.railway.tatkal.train.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record TrainSearchRequest(

        @NotBlank
        String from,

        @NotBlank
        String to,

        @NotNull
        LocalDate date
) {
}