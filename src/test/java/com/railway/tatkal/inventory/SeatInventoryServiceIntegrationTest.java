package com.railway.tatkal.inventory;

import com.railway.tatkal.inventory.entity.SeatInventory;
import com.railway.tatkal.inventory.entity.SeatStatus;
import com.railway.tatkal.inventory.repository.SeatInventoryRepository;
import com.railway.tatkal.inventory.service.SeatInventoryService;
import com.railway.tatkal.train.repository.SeatRepository;
import com.railway.tatkal.train.repository.TrainRunRepository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class SeatInventoryServiceIntegrationTest {

    @Autowired
    private SeatInventoryService seatInventoryService;

    @Autowired
    private SeatInventoryRepository seatInventoryRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private TrainRunRepository trainRunRepository;

    @Test
    void shouldInitializeInventoryForAllSeats() {

        Long trainId = 1L;
        LocalDate runDate = LocalDate.of(2026, 9, 15);

        seatInventoryService.initializeInventory(
                trainId,
                runDate
        );

        Long trainRunId =
                trainRunRepository
                        .findByTrainIdAndRunDate(trainId, runDate)
                        .orElseThrow()
                        .getId();

        List<SeatInventory> inventory =
                seatInventoryRepository
                        .findByTrainRunId(trainRunId);

        int seatCount =
                seatRepository
                        .findByCoachTrainId(trainId)
                        .size();

        assertThat(inventory)
                .hasSize(seatCount);

        assertThat(inventory)
                .allMatch(item ->
                        item.getStatus() == SeatStatus.AVAILABLE
                );
    }

    @Test
    void shouldNotCreateDuplicateInventory() {

        Long trainId = 1L;
        LocalDate runDate = LocalDate.of(2026, 9, 15);

        seatInventoryService.initializeInventory(
                trainId,
                runDate
        );

        Long trainRunId =
                trainRunRepository
                        .findByTrainIdAndRunDate(trainId, runDate)
                        .orElseThrow()
                        .getId();

        int firstCount =
                seatInventoryRepository
                        .findByTrainRunId(trainRunId)
                        .size();

        seatInventoryService.initializeInventory(
                trainId,
                runDate
        );

        int secondCount =
                seatInventoryRepository
                        .findByTrainRunId(trainRunId)
                        .size();

        assertThat(secondCount)
                .isEqualTo(firstCount);
    }
}