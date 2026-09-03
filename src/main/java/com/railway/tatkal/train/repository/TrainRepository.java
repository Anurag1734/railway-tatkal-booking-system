package com.railway.tatkal.train.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.railway.tatkal.train.entity.Train;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;


public interface TrainRepository extends JpaRepository<Train, Long> {

    Optional<Train> findByTrainNumber(String trainNumber);

    boolean existsByTrainNumber(String trainNumber);

    @Query(value = """
        SELECT
            tr.train_run_id AS trainRunId,
            t.train_id AS trainId,
            t.train_number AS trainNumber,
            t.train_name AS trainName,
            t.train_type AS trainType,

            source_station.station_id AS sourceStationId,
            source_station.station_code AS sourceStation,
            source_station.station_name AS sourceStationName,
            source_station.city AS sourceCity,

            destination_station.station_id AS destinationStationId,
            destination_station.station_code AS destinationStation,
            destination_station.station_name AS destinationStationName,
            destination_station.city AS destinationCity,

            tr.run_date AS runDate,

            source_stop.departure_time AS departureTime,
            destination_stop.arrival_time AS arrivalTime

        FROM trains t

        JOIN train_runs tr
            ON tr.train_id = t.train_id

        JOIN train_stops source_stop
            ON source_stop.train_id = t.train_id

        JOIN train_stops destination_stop
            ON destination_stop.train_id = t.train_id

        JOIN stations source_station
            ON source_station.station_id = source_stop.station_id

        JOIN stations destination_station
            ON destination_station.station_id = destination_stop.station_id

        WHERE t.active = TRUE

          AND tr.run_date = :date

          AND source_station.station_code = :fromCode

          AND destination_station.station_code = :toCode

          AND source_stop.stop_order < destination_stop.stop_order

        ORDER BY source_stop.departure_time
        """, nativeQuery = true)
List<TrainSearchProjection> searchTrains(
        @Param("fromCode") String fromCode,
        @Param("toCode") String toCode,
        @Param("date") LocalDate date
);
}
