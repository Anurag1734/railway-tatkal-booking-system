package com.railway.tatkal.train.entity;

import jakarta.persistence.*;

@Entity
@Table(
        name = "coaches",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_train_coach",
                        columnNames = {"train_id", "coach_code"}
                )
        }
)
public class Coach {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "coach_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "train_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_coach_train")
    )
    private Train train;

    @Column(name = "coach_code", nullable = false, length = 20)
    private String coachCode;

    @Column(name = "coach_type", nullable = false, length = 30)
    private String coachType;

    @Column(name = "capacity", nullable = false)
    private int capacity;

    protected Coach() {
        // Required by JPA
    }

    public Coach(
            Train train,
            String coachCode,
            String coachType,
            int capacity
    ) {
        this.train = train;
        this.coachCode = coachCode;
        this.coachType = coachType;
        this.capacity = capacity;
    }

    public Long getId() {
        return id;
    }

    public Train getTrain() {
        return train;
    }

    public String getCoachCode() {
        return coachCode;
    }

    public String getCoachType() {
        return coachType;
    }

    public int getCapacity() {
        return capacity;
    }
}