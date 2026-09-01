package com.railway.tatkal.train.controller;

import com.railway.tatkal.train.dto.TrainSearchRequest;
import com.railway.tatkal.train.dto.TrainSearchResponse;
import com.railway.tatkal.train.service.TrainSearchService;

import jakarta.validation.Valid;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/trains")
public class TrainController {

    private final TrainSearchService trainSearchService;

    public TrainController(TrainSearchService trainSearchService) {
        this.trainSearchService = trainSearchService;
    }

    @GetMapping("/search")
    public List<TrainSearchResponse> searchTrains(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date
    ) {

        TrainSearchRequest request =
                new TrainSearchRequest(from, to, date);

        return trainSearchService.search(request);
    }
}