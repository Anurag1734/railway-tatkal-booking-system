package com.railway.tatkal.train.repository;

import com.railway.tatkal.train.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SeatRepository extends JpaRepository<Seat, Long> {

    List<Seat> findByCoachId(Long coachId);
    List<Seat> findByCoachTrainId(Long trainId);

    Optional<Seat> findByCoachIdAndSeatNumber(
            Long coachId,
            String seatNumber
    );

    boolean existsByCoachIdAndSeatNumber(
            Long coachId,
            String seatNumber
    );
}