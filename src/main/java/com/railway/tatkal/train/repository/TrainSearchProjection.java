package com.railway.tatkal.train.repository;

import java.time.LocalDate;
import java.time.LocalTime;

public interface TrainSearchProjection {

    Long getTrainRunId();

    Long getTrainId();

    String getTrainNumber();

    String getTrainName();

    String getTrainType();

    Long getSourceStationId();

    String getSourceStation();

    String getSourceStationName();

    String getSourceCity();

    Long getDestinationStationId();

    String getDestinationStation();

    String getDestinationStationName();

    String getDestinationCity();

    LocalDate getRunDate();

    LocalTime getDepartureTime();

    LocalTime getArrivalTime();
}
