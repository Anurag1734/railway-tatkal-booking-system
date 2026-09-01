package com.railway.tatkal.train.entity;

import jakarta.persistence.*;

@Entity
@Table(
        name = "seats",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_coach_seat",
                        columnNames = {"coach_id", "seat_number"}
                )
        }
)
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "seat_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "coach_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_seat_coach")
    )
    private Coach coach;

    @Column(name = "seat_number", nullable = false, length = 20)
    private String seatNumber;

    @Column(name = "berth_type", length = 30)
    private String berthType;

    @Column(name = "class_type", length = 30)
    private String classType;

    protected Seat() {
        // Required by JPA
    }

    public Seat(
            Coach coach,
            String seatNumber,
            String berthType,
            String classType
    ) {
        this.coach = coach;
        this.seatNumber = seatNumber;
        this.berthType = berthType;
        this.classType = classType;
    }

    public Long getId() {
        return id;
    }

    public Coach getCoach() {
        return coach;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public String getBerthType() {
        return berthType;
    }

    public String getClassType() {
        return classType;
    }
}