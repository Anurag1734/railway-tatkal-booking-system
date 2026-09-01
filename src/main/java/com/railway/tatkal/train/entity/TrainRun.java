package com.railway.tatkal.train.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(
        name = "train_runs",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_train_run_date",
                        columnNames = {"train_id", "run_date"}
                )
        }
)
public class TrainRun {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "train_run_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "train_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_train_run_train")
    )
    private Train train;

    @Column(name = "run_date", nullable = false)
    private LocalDate runDate;

    protected TrainRun() {
        // Required by JPA
    }

    public TrainRun(Train train, LocalDate runDate) {
        this.train = train;
        this.runDate = runDate;
    }

    public Long getId() {
        return id;
    }

    public Train getTrain() {
        return train;
    }

    public LocalDate getRunDate() {
        return runDate;
    }
}