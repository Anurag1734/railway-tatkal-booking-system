package com.railway.tatkal.train.entity;

import com.railway.tatkal.station.entity.Station;
import jakarta.persistence.*;

@Entity
@Table(
        name = "trains",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_trains_number",
                        columnNames = "train_number"
                )
        }
)
public class Train {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "train_id")
    private Long id;

    @Column(name = "train_number", nullable = false, length = 20)
    private String trainNumber;

    @Column(name = "train_name", nullable = false, length = 100)
    private String trainName;

    @Column(name = "train_type", length = 50)
    private String trainType;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "source_station_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_train_source")
    )
    private Station sourceStation;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "destination_station_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_train_destination")
    )
    private Station destinationStation;

    @Column(name = "active", nullable = false)
    private boolean active = true;

    protected Train() {
        // Required by JPA
    }

    public Train(
            String trainNumber,
            String trainName,
            String trainType,
            Station sourceStation,
            Station destinationStation
    ) {
        this.trainNumber = trainNumber;
        this.trainName = trainName;
        this.trainType = trainType;
        this.sourceStation = sourceStation;
        this.destinationStation = destinationStation;
        this.active = true;
    }

    public Long getId() {
        return id;
    }

    public String getTrainNumber() {
        return trainNumber;
    }

    public String getTrainName() {
        return trainName;
    }

    public String getTrainType() {
        return trainType;
    }

    public Station getSourceStation() {
        return sourceStation;
    }

    public Station getDestinationStation() {
        return destinationStation;
    }

    public boolean isActive() {
        return active;
    }
}