package com.railway.tatkal.train.repository;

import com.railway.tatkal.train.entity.TrainRun;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface TrainRunRepository extends JpaRepository<TrainRun, Long> {

    Optional<TrainRun> findByTrainIdAndRunDate(
            Long trainId,
            LocalDate runDate
    );

    boolean existsByTrainIdAndRunDate(
            Long trainId,
            LocalDate runDate
    );
}