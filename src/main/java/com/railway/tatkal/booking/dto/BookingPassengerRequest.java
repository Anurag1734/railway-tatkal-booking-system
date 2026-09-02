package com.railway.tatkal.booking.dto;

public record BookingPassengerRequest(
        String name,
        Integer age,
        String gender,
        String berthPreference,
        String concessionType
) {
}