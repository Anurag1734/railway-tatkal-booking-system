package com.railway.tatkal.inventory.scheduler;

import com.railway.tatkal.inventory.service.SeatInventoryService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class SeatHoldExpirationScheduler {

    private final SeatInventoryService seatInventoryService;

    public SeatHoldExpirationScheduler(
            SeatInventoryService seatInventoryService
    ) {
        this.seatInventoryService = seatInventoryService;
    }

    @Scheduled(fixedRate = 60_000)
    public void releaseExpiredHolds() {

        int released =
                seatInventoryService.releaseExpiredHolds();

        if (released > 0) {
            System.out.println(
                    "Released " + released +
                    " expired seat holds"
            );
        }
    }
}