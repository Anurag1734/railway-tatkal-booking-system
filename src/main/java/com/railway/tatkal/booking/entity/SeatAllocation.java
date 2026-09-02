package com.railway.tatkal.booking.entity;

import com.railway.tatkal.inventory.entity.SeatInventory;
import com.railway.tatkal.train.entity.Seat;
import jakarta.persistence.*;

@Entity
@Table(name = "seat_allocations")
public class SeatAllocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "allocation_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "booking_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_allocation_booking")
    )
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "seat_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_allocation_seat")
    )
    private Seat seat;

    @Column(name = "seat_number", length = 20)
    private String seatNumber;

    @Column(name = "coach_id")
    private Long coachId;

    @Column(name = "berth_type", length = 30)
    private String berthType;

    @Column(name = "status", nullable = false, length = 30)
    private String status;

    protected SeatAllocation() {
    }

    public SeatAllocation(
            Booking booking,
            Seat seat,
            String seatNumber,
            Long coachId,
            String berthType,
            String status
    ) {
        this.booking = booking;
        this.seat = seat;
        this.seatNumber = seatNumber;
        this.coachId = coachId;
        this.berthType = berthType;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public Booking getBooking() {
        return booking;
    }

    public Seat getSeat() {
        return seat;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public Long getCoachId() {
        return coachId;
    }

    public String getBerthType() {
        return berthType;
    }

    public String getStatus() {
        return status;
    }

    public void cancel() {
        this.status = "CANCELLED";
    }
}