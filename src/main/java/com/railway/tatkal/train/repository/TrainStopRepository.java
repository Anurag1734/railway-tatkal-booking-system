package com.railway.tatkal.train.repository;

import com.railway.tatkal.train.entity.TrainStop;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TrainStopRepository extends JpaRepository<TrainStop, Long> {

    List<TrainStop> findByTrainIdOrderByStopOrder(Long trainId);

    Optional<TrainStop> findByTrainIdAndStationId(
            Long trainId,
            Long stationId
    );

    boolean existsByTrainIdAndStationId(
            Long trainId,
            Long stationId
    );
}