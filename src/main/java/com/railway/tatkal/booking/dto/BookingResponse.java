package com.railway.tatkal.booking.dto;

import com.railway.tatkal.booking.entity.BookingStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
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
        List<Long> seatIds
) {
}