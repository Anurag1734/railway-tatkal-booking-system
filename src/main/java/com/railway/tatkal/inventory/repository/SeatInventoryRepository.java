package com.railway.tatkal.inventory.repository;

import com.railway.tatkal.inventory.entity.SeatInventory;
import com.railway.tatkal.inventory.entity.SeatStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SeatInventoryRepository
        extends JpaRepository<SeatInventory, Long> {

    List<SeatInventory> findByTrainRunId(Long trainRunId);

    List<SeatInventory> findByTrainRunIdAndStatus(
            Long trainRunId,
            SeatStatus status
    );

    Optional<SeatInventory> findByTrainRunIdAndSeatId(
            Long trainRunId,
            Long seatId
    );

        List<SeatInventory> findByStatusAndHeldUntilBefore(
                SeatStatus status,
                LocalDateTime time
        );
}