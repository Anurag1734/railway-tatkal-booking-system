package com.railway.tatkal.train.service;

import com.railway.tatkal.train.dto.TrainSearchRequest;
import com.railway.tatkal.train.dto.TrainSearchResponse;
import com.railway.tatkal.train.repository.TrainRepository;
import com.railway.tatkal.train.repository.TrainSearchProjection;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainSearchService {

    private final TrainRepository trainRepository;

    public TrainSearchService(TrainRepository trainRepository) {
        this.trainRepository = trainRepository;
    }

    public List<TrainSearchResponse> search(TrainSearchRequest request) {

        List<TrainSearchProjection> results =
                trainRepository.searchTrains(
                        request.from().trim().toUpperCase(),
                        request.to().trim().toUpperCase(),
                        request.date()
                );

        return results.stream()
                .map(result -> new TrainSearchResponse(
                        result.getTrainRunId(),
                        result.getTrainId(),
                        result.getTrainNumber(),
                        result.getTrainName(),
                        result.getTrainType(),
                        result.getSourceStationId(),
                        result.getSourceStation(),
                        result.getSourceStationName(),
                        result.getSourceCity(),
                        result.getDestinationStationId(),
                        result.getDestinationStation(),
                        result.getDestinationStationName(),
                        result.getDestinationCity(),
                        result.getRunDate(),
                        result.getDepartureTime(),
                        result.getArrivalTime()
                ))
                .toList();
    }
}
