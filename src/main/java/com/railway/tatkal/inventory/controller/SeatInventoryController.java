package com.railway.tatkal.inventory.controller;

import com.railway.tatkal.inventory.dto.SeatInventoryResponse;
import com.railway.tatkal.inventory.service.SeatInventoryService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/train-runs")
public class SeatInventoryController {

    private final SeatInventoryService seatInventoryService;

    public SeatInventoryController(
            SeatInventoryService seatInventoryService
    ) {
        this.seatInventoryService = seatInventoryService;
    }

    @GetMapping("/{trainRunId}/seats")
    public List<SeatInventoryResponse> getSeats(
            @PathVariable Long trainRunId
    ) {
        return seatInventoryService.getAvailability(trainRunId);
    }

    @PostMapping("/{trainRunId}/seats/{seatId}/hold")
    public SeatInventoryResponse holdSeat(
            @PathVariable Long trainRunId,
            @PathVariable Long seatId
    ) {
        return seatInventoryService.holdSeat(
                trainRunId,
                seatId
        );
    }
}