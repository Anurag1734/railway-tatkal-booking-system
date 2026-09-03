package com.railway.tatkal.api;

import com.railway.tatkal.booking.controller.BookingController;
import com.railway.tatkal.booking.dto.BookingResponse;
import com.railway.tatkal.booking.entity.BookingStatus;
import com.railway.tatkal.booking.service.BookingService;
import com.railway.tatkal.inventory.controller.SeatInventoryController;
import com.railway.tatkal.inventory.dto.SeatInventoryResponse;
import com.railway.tatkal.inventory.entity.SeatStatus;
import com.railway.tatkal.inventory.service.SeatInventoryService;
import com.railway.tatkal.train.controller.TrainController;
import com.railway.tatkal.train.dto.TrainSearchResponse;
import com.railway.tatkal.train.service.TrainSearchService;
import com.railway.tatkal.user.controller.UserController;
import com.railway.tatkal.user.dto.UserProfileResponse;
import com.railway.tatkal.user.service.UserProfileService;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ControllerContractTest {

    @Test
    void trainControllerShouldReturnExpandedSearchResponse() {
        TrainSearchService trainSearchService = mock(TrainSearchService.class);
        when(trainSearchService.search(any())).thenReturn(List.of(
                new TrainSearchResponse(
                        11L,
                        1L,
                        "12951",
                        "Railway Tatkal Express",
                        "EXPRESS",
                        5L,
                        "CSMT",
                        "Chhatrapati Shivaji Maharaj Terminus",
                        "Mumbai",
                        9L,
                        "NDLS",
                        "New Delhi",
                        "Delhi",
                        LocalDate.of(2026, 9, 15),
                        LocalTime.of(16, 0),
                        LocalTime.of(6, 30)
                )
        ));

        List<TrainSearchResponse> response = new TrainController(trainSearchService)
                .searchTrains("CSMT", "NDLS", LocalDate.of(2026, 9, 15));

        TrainSearchResponse result = response.getFirst();

        assertThat(result.trainRunId()).isEqualTo(11L);
        assertThat(result.sourceStationId()).isEqualTo(5L);
        assertThat(result.sourceStation()).isEqualTo("CSMT");
        assertThat(result.sourceStationName())
                .isEqualTo("Chhatrapati Shivaji Maharaj Terminus");
        assertThat(result.destinationStationId()).isEqualTo(9L);
        assertThat(result.destinationStation()).isEqualTo("NDLS");
        assertThat(result.destinationStationName()).isEqualTo("New Delhi");
    }

    @Test
    void seatInventoryControllerShouldReturnHeldUntil() {
        SeatInventoryService seatInventoryService = mock(SeatInventoryService.class);
        when(seatInventoryService.getAvailability(11L)).thenReturn(List.of(
                new SeatInventoryResponse(
                        100L,
                        200L,
                        "A1",
                        "1",
                        "LOWER",
                        "AC_2_TIER",
                        SeatStatus.HELD,
                        LocalDateTime.of(2026, 9, 15, 10, 5)
                )
        ));

        List<SeatInventoryResponse> response = new SeatInventoryController(seatInventoryService)
                .getSeats(11L);

        SeatInventoryResponse result = response.getFirst();

        assertThat(result.heldUntil()).isEqualTo(LocalDateTime.of(2026, 9, 15, 10, 5));
        assertThat(result.status()).isEqualTo(SeatStatus.HELD);
    }

    @Test
    void bookingControllerShouldReturnEnrichedBookingDetails() {
        BookingService bookingService = mock(BookingService.class);
        when(bookingService.getBooking("TB-ABC123DEF456")).thenReturn(
                new BookingResponse(
                        501L,
                        "TB-ABC123DEF456",
                        11L,
                        LocalDate.of(2026, 9, 15),
                        5L,
                        9L,
                        BookingStatus.CONFIRMED,
                        BigDecimal.ZERO,
                        List.of(200L),
                        "12951",
                        "Railway Tatkal Express",
                        "EXPRESS",
                        "CSMT",
                        "Chhatrapati Shivaji Maharaj Terminus",
                        "NDLS",
                        "New Delhi",
                        LocalDateTime.of(2026, 9, 3, 9, 0),
                        LocalDateTime.of(2026, 9, 3, 9, 5),
                        List.of(
                                new BookingResponse.BookingPassengerResponse(
                                        "Aarav",
                                        22,
                                        "MALE",
                                        "LOWER",
                                        null
                                )
                        ),
                        List.of(
                                new BookingResponse.SeatAllocationResponse(
                                        200L,
                                        "A1",
                                        "1",
                                        "LOWER",
                                        "CONFIRMED"
                                )
                        )
                )
        );

        ResponseEntity<BookingResponse> response = new BookingController(bookingService)
                .getBooking("TB-ABC123DEF456");

        BookingResponse body = response.getBody();

        assertThat(body).isNotNull();
        assertThat(body.bookingReference()).isEqualTo("TB-ABC123DEF456");
        assertThat(body.trainNumber()).isEqualTo("12951");
        assertThat(body.trainName()).isEqualTo("Railway Tatkal Express");
        assertThat(body.sourceStationCode()).isEqualTo("CSMT");
        assertThat(body.destinationStationCode()).isEqualTo("NDLS");
        assertThat(body.passengers()).singleElement()
                .extracting(BookingResponse.BookingPassengerResponse::name)
                .isEqualTo("Aarav");
        assertThat(body.seatAllocations()).singleElement()
                .extracting(BookingResponse.SeatAllocationResponse::coachCode)
                .isEqualTo("A1");
    }

    @Test
    void userControllerShouldReturnCurrentUserProfile() {
        UserProfileService userProfileService = mock(UserProfileService.class);
        when(userProfileService.getCurrentUserProfile()).thenReturn(
                new UserProfileResponse(
                        101L,
                        "Aarav",
                        "aarav@example.com",
                        "9999999999",
                        "USER",
                        "ACTIVE",
                        LocalDateTime.of(2026, 9, 1, 10, 0)
                )
        );

        ResponseEntity<UserProfileResponse> response = new UserController(userProfileService)
                .getCurrentUserProfile();

        UserProfileResponse body = response.getBody();

        assertThat(body).isNotNull();
        assertThat(body.userId()).isEqualTo(101L);
        assertThat(body.email()).isEqualTo("aarav@example.com");
        assertThat(body.role()).isEqualTo("USER");
        assertThat(body.status()).isEqualTo("ACTIVE");
    }
}
