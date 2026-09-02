package com.railway.tatkal.inventory.service;

import com.railway.tatkal.inventory.dto.SeatInventoryResponse;
import com.railway.tatkal.inventory.entity.SeatInventory;
import com.railway.tatkal.inventory.entity.SeatStatus;
import com.railway.tatkal.inventory.repository.SeatInventoryRepository;
import com.railway.tatkal.train.entity.Seat;
import com.railway.tatkal.train.entity.TrainRun;
import com.railway.tatkal.train.repository.SeatRepository;
import com.railway.tatkal.train.repository.TrainRunRepository;
import com.railway.tatkal.common.exception.SeatNotAvailableException;
import com.railway.tatkal.user.entity.User;
import com.railway.tatkal.user.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SeatInventoryService {

        private final SeatInventoryRepository seatInventoryRepository;
        private final SeatRepository seatRepository;
        private final TrainRunRepository trainRunRepository;
        private final UserRepository userRepository;

        public SeatInventoryService(
                SeatInventoryRepository seatInventoryRepository,
                SeatRepository seatRepository,
                TrainRunRepository trainRunRepository,
                UserRepository userRepository
        ) {
        this.seatInventoryRepository = seatInventoryRepository;
        this.seatRepository = seatRepository;
        this.trainRunRepository = trainRunRepository;
        this.userRepository = userRepository;
        }

    @Transactional
    public void initializeInventory(
            Long trainId,
            LocalDate runDate
    ) {

        TrainRun trainRun =
                trainRunRepository
                        .findByTrainIdAndRunDate(trainId, runDate)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Train run not found"
                                )
                        );

        List<Seat> seats =
                seatRepository.findByCoachTrainId(trainId);

        List<SeatInventory> existingInventory =
                seatInventoryRepository
                        .findByTrainRunId(trainRun.getId());

        java.util.Set<Long> existingSeatIds =
                existingInventory.stream()
                        .map(inventory ->
                                inventory.getSeat().getId()
                        )
                        .collect(java.util.stream.Collectors.toSet());

        List<SeatInventory> newInventory =
                seats.stream()
                        .filter(seat ->
                                !existingSeatIds.contains(seat.getId())
                        )
                        .map(seat ->
                                new SeatInventory(trainRun, seat)
                        )
                        .toList();

        seatInventoryRepository.saveAll(newInventory);
    }

    @Transactional(readOnly = true)
    public List<SeatInventoryResponse> getAvailability(Long trainRunId) {

        return seatInventoryRepository
                .findByTrainRunId(trainRunId)
                .stream()
                .map(this::toResponse)
                .toList();

            }
        private SeatInventoryResponse toResponse(
                SeatInventory inventory
        ) {
            return new SeatInventoryResponse(
                    inventory.getId(),
                    inventory.getSeat().getId(),
                    inventory.getSeat().getCoach().getCoachCode(),
                    inventory.getSeat().getSeatNumber(),
                    inventory.getSeat().getBerthType(),
                    inventory.getSeat().getClassType(),
                    inventory.getStatus()
            );
        }

        @Transactional
        public SeatInventoryResponse holdSeat(Long trainRunId, Long seatId) {

                Authentication authentication =
                        SecurityContextHolder.getContext().getAuthentication();

                String email = authentication.getName();

                User user = userRepository.findByEmail(email)
                        .orElseThrow(() -> new IllegalArgumentException("User not found"));

                SeatInventory inventory =
                        seatInventoryRepository
                                .findByTrainRunIdAndSeatId(
                                        trainRunId,
                                        seatId
                                )
                                .orElseThrow(() ->
                                        new IllegalArgumentException(
                                                "Seat inventory not found"
                                        )
                                );

                if (inventory.getStatus() != SeatStatus.AVAILABLE) {
                throw new SeatNotAvailableException(
                        "Seat is not available"
                );
                }

                inventory.hold(user, LocalDateTime.now().plusMinutes(5));

                SeatInventory saved =
                        seatInventoryRepository.save(inventory);

                return toResponse(saved);
        }

    @Transactional
    public int releaseExpiredHolds() {

        List<SeatInventory> expiredInventory =
                seatInventoryRepository
                        .findByStatusAndHeldUntilBefore(
                                SeatStatus.HELD,
                                LocalDateTime.now()
                        );

        for (SeatInventory inventory : expiredInventory) {
            inventory.release();
        }

        return expiredInventory.size();
    }
}