package com.railway.tatkal.train.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record TrainSearchResponse(
        Long trainId,
        String trainNumber,
        String trainName,
        String trainType,
        String sourceStation,
        String destinationStation,
        LocalDate runDate,
        LocalTime departureTime,
        LocalTime arrivalTime
) {
}