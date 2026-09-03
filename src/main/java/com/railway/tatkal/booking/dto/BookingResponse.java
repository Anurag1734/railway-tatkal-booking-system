package com.railway.tatkal.booking.dto;

import com.railway.tatkal.booking.entity.BookingStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record BookingResponse(
        Long bookingId,
        String bookingReference,
        Long trainRunId,
        LocalDate journeyDate,
        Long sourceStationId,
        Long destinationStationId,
        BookingStatus status,
        BigDecimal totalAmount,
        List<Long> seatIds,
        String trainNumber,
        String trainName,
        String trainType,
        String sourceStationCode,
        String sourceStationName,
        String destinationStationCode,
        String destinationStationName,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        List<BookingPassengerResponse> passengers,
        List<SeatAllocationResponse> seatAllocations
) {
    public record BookingPassengerResponse(
            String name,
            Integer age,
            String gender,
            String berthPreference,
            String concessionType
    ) {
    }

    public record SeatAllocationResponse(
            Long seatId,
            String coachCode,
            String seatNumber,
            String berthType,
            String status
    ) {
    }
}
