package com.railway.tatkal.booking.entity;

import com.railway.tatkal.user.entity.User;
import com.railway.tatkal.station.entity.Station;
import com.railway.tatkal.train.entity.TrainRun;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "bookings",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_booking_reference",
                        columnNames = "booking_reference"
                )
        }
)
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_booking_user")
    )
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "train_run_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_booking_train_run")
    )
    private TrainRun trainRun;

    @Column(
            name = "booking_reference",
            nullable = false,
            length = 30
    )
    private String bookingReference;

    @Column(name = "journey_date", nullable = false)
    private LocalDate journeyDate;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "source_station_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_booking_source")
    )
    private Station sourceStation;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "destination_station_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_booking_destination")
    )
    private Station destinationStation;

    @Enumerated(EnumType.STRING)
    @Column(name = "booking_status", nullable = false, length = 30)
    private BookingStatus status;

    @Column(
            name = "total_amount",
            nullable = false,
            precision = 10,
            scale = 2
    )
    private BigDecimal totalAmount;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    protected Booking() {
        // Required by JPA
    }

    public Booking(
            User user,
            TrainRun trainRun,
            String bookingReference,
            LocalDate journeyDate,
            Station sourceStation,
            Station destinationStation,
            BigDecimal totalAmount
    ) {
        this.user = user;
        this.trainRun = trainRun;
        this.bookingReference = bookingReference;
        this.journeyDate = journeyDate;
        this.sourceStation = sourceStation;
        this.destinationStation = destinationStation;
        this.status = BookingStatus.PENDING;
        this.totalAmount = totalAmount;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public TrainRun getTrainRun() {
        return trainRun;
    }

    public String getBookingReference() {
        return bookingReference;
    }

    public LocalDate getJourneyDate() {
        return journeyDate;
    }

    public Station getSourceStation() {
        return sourceStation;
    }

    public Station getDestinationStation() {
        return destinationStation;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void confirm() {
        this.status = BookingStatus.CONFIRMED;
        this.updatedAt = LocalDateTime.now();
    }

    public void cancel() {
        this.status = BookingStatus.CANCELLED;
        this.updatedAt = LocalDateTime.now();
    }

    public void expire() {
        this.status = BookingStatus.EXPIRED;
        this.updatedAt = LocalDateTime.now();
    }
}