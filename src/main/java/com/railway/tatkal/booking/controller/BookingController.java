package com.railway.tatkal.booking.controller;

import com.railway.tatkal.booking.dto.BookingResponse;
import com.railway.tatkal.booking.dto.CreateBookingRequest;
import com.railway.tatkal.booking.service.BookingService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @RequestBody CreateBookingRequest request
    ) {
        BookingResponse response =
                bookingService.createBooking(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/{bookingReference}")
    public ResponseEntity<BookingResponse> getBooking(
            @PathVariable String bookingReference
    ) {
        BookingResponse response =
                bookingService.getBooking(bookingReference);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingResponse>> getMyBookings() {

        List<BookingResponse> bookings =
                bookingService.getMyBookings();

        return ResponseEntity.ok(bookings);
    }

    @PostMapping("/{bookingReference}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(
            @PathVariable String bookingReference
    ) {
        BookingResponse response =
                bookingService.cancelBooking(bookingReference);

        return ResponseEntity.ok(response);
    }
}