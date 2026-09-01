package com.railway.tatkal.inventory.dto;

import com.railway.tatkal.inventory.entity.SeatStatus;

public record SeatInventoryResponse(
        Long inventoryId,
        Long seatId,
        String coachCode,
        String seatNumber,
        String berthType,
        String classType,
        SeatStatus status
) {
}