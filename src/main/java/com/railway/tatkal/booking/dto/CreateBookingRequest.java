package com.railway.tatkal.booking.dto;

import java.util.List;

public record CreateBookingRequest(
        Long trainRunId,
        Long sourceStationId,
        Long destinationStationId,
        List<Long> seatIds,
        List<BookingPassengerRequest> passengers
) {
}