package com.railway.tatkal.booking.repository;

import com.railway.tatkal.booking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository
        extends JpaRepository<Booking, Long> {

    Optional<Booking> findByBookingReference(
            String bookingReference
    );

    List<Booking> findByUserIdOrderByCreatedAtDesc(
            Long userId
    );
}