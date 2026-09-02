package com.railway.tatkal.inventory.entity;

import com.railway.tatkal.user.entity.User;
import com.railway.tatkal.train.entity.Seat;
import com.railway.tatkal.train.entity.TrainRun;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "seat_inventory",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_inventory_run_seat",
                        columnNames = {"train_run_id", "seat_id"}
                )
        }
)
public class SeatInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inventory_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "train_run_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_inventory_train_run")
    )
    private TrainRun trainRun;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "seat_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_inventory_seat")
    )
    private Seat seat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "held_by_user_id",
            foreignKey = @ForeignKey(name = "fk_inventory_hold_user")
    )
    private User heldByUser;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private SeatStatus status;

    @Column(name = "held_until")
    private LocalDateTime heldUntil;

    @Version
    @Column(name = "version", nullable = false)
    private Long version;

    protected SeatInventory() {
        // Required by JPA
    }

    public SeatInventory(
            TrainRun trainRun,
            Seat seat
    ) {
        this.trainRun = trainRun;
        this.seat = seat;
        this.status = SeatStatus.AVAILABLE;
    }

    public Long getId() {
        return id;
    }

    public TrainRun getTrainRun() {
        return trainRun;
    }

    public Seat getSeat() {
        return seat;
    }

    public SeatStatus getStatus() {
        return status;
    }

    public LocalDateTime getHeldUntil() {
        return heldUntil;
    }

    public Long getVersion() {
        return version;
    }

    public User getHeldByUser() {
        return heldByUser;
    }

    public void hold(User user, LocalDateTime holdUntil) {
        if (status != SeatStatus.AVAILABLE) {
            throw new IllegalStateException("Seat is not available");
        }

        this.status = SeatStatus.HELD;
        this.heldUntil = holdUntil;
        this.heldByUser = user;
    }

    public void confirmBooking(User user, LocalDateTime now) {
        if (status != SeatStatus.HELD) {
            throw new IllegalStateException("Seat is not held");
        }

        if (heldUntil == null || !heldUntil.isAfter(now)) {
            throw new IllegalStateException("Seat hold has expired");
        }

        if (heldByUser == null || !heldByUser.getId().equals(user.getId())) {
            throw new IllegalStateException("Seat is held by another user");
        }

        this.status = SeatStatus.BOOKED;
        this.heldUntil = null;
        this.heldByUser = null;
    }

    public void release() {
        if (status != SeatStatus.HELD) {
            throw new IllegalStateException("Only held seats can be released");
        }

        this.status = SeatStatus.AVAILABLE;
        this.heldUntil = null;
        this.heldByUser = null;
    }

    public void releaseFromBooking() {

        if (status != SeatStatus.BOOKED) {
            throw new IllegalStateException(
                    "Only booked seats can be released"
            );
        }

        this.status = SeatStatus.AVAILABLE;
    }
}