package com.railway.tatkal.train.repository;

import java.time.LocalDate;
import java.time.LocalTime;

public interface TrainSearchProjection {

    Long getTrainId();

    String getTrainNumber();

    String getTrainName();

    String getTrainType();

    String getSourceStation();

    String getDestinationStation();

    LocalDate getRunDate();

    LocalTime getDepartureTime();

    LocalTime getArrivalTime();
}