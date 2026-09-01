package com.railway.tatkal.train.entity;

import com.railway.tatkal.station.entity.Station;
import jakarta.persistence.*;

import java.time.LocalTime;

@Entity
@Table(
        name = "train_stops",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_train_stop_order",
                        columnNames = {"train_id", "stop_order"}
                )
        }
)
public class TrainStop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stop_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "train_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_stop_train")
    )
    private Train train;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "station_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_stop_station")
    )
    private Station station;

    @Column(name = "stop_order", nullable = false)
    private int stopOrder;

    @Column(name = "arrival_time")
    private LocalTime arrivalTime;

    @Column(name = "departure_time")
    private LocalTime departureTime;

    @Column(name = "distance_from_source")
    private Integer distanceFromSource;

    protected TrainStop() {
        // Required by JPA
    }

    public TrainStop(
            Train train,
            Station station,
            int stopOrder,
            LocalTime arrivalTime,
            LocalTime departureTime,
            Integer distanceFromSource
    ) {
        this.train = train;
        this.station = station;
        this.stopOrder = stopOrder;
        this.arrivalTime = arrivalTime;
        this.departureTime = departureTime;
        this.distanceFromSource = distanceFromSource;
    }

    public Long getId() {
        return id;
    }

    public Train getTrain() {
        return train;
    }

    public Station getStation() {
        return station;
    }

    public int getStopOrder() {
        return stopOrder;
    }

    public LocalTime getArrivalTime() {
        return arrivalTime;
    }

    public LocalTime getDepartureTime() {
        return departureTime;
    }

    public Integer getDistanceFromSource() {
        return distanceFromSource;
    }
}