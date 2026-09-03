package com.railway.tatkal.train;

import com.railway.tatkal.train.dto.TrainSearchRequest;
import com.railway.tatkal.train.dto.TrainSearchResponse;
import com.railway.tatkal.train.service.TrainSearchService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class TrainSearchServiceIntegrationTest {

    @Autowired
    private TrainSearchService trainSearchService;

    @Test
    void shouldReturnTrainRunAndStationDisplayInformation() {
        List<TrainSearchResponse> results = trainSearchService.search(
                new TrainSearchRequest(
                        "CSMT",
                        "NDLS",
                        LocalDate.of(2026, 9, 15)
                )
        );

        assertThat(results).hasSize(1);

        TrainSearchResponse response = results.getFirst();

        assertThat(response.trainRunId()).isNotNull();
        assertThat(response.trainId()).isEqualTo(1L);
        assertThat(response.trainNumber()).isEqualTo("12951");
        assertThat(response.sourceStationId()).isNotNull();
        assertThat(response.sourceStation()).isEqualTo("CSMT");
        assertThat(response.sourceStationName())
                .isEqualTo("Chhatrapati Shivaji Maharaj Terminus");
        assertThat(response.sourceCity()).isEqualTo("Mumbai");
        assertThat(response.destinationStationId()).isNotNull();
        assertThat(response.destinationStation()).isEqualTo("NDLS");
        assertThat(response.destinationStationName()).isEqualTo("New Delhi");
        assertThat(response.destinationCity()).isEqualTo("Delhi");
    }
}
