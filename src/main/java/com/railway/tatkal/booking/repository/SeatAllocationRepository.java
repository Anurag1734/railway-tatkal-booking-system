package com.railway.tatkal.booking.repository;

import com.railway.tatkal.booking.entity.SeatAllocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SeatAllocationRepository extends JpaRepository<SeatAllocation, Long> {

    List<SeatAllocation> findByBookingId(Long bookingId);
}