package com.railway.tatkal.station.entity;

import jakarta.persistence.*;

@Entity
@Table(
        name = "stations",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_stations_code", columnNames = "station_code")
        }
)
public class Station {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "station_id")
    private Long id;

    @Column(name = "station_code", nullable = false, length = 10)
    private String code;

    @Column(name = "station_name", nullable = false, length = 100)
    private String name;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "state", length = 100)
    private String state;

    @Column(name = "zone", length = 50)
    private String zone;

    protected Station() {
        // Required by JPA
    }

    public Station(
            String code,
            String name,
            String city,
            String state,
            String zone
    ) {
        this.code = code;
        this.name = name;
        this.city = city;
        this.state = state;
        this.zone = zone;
    }

    public Long getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public String getCity() {
        return city;
    }

    public String getState() {
        return state;
    }

    public String getZone() {
        return zone;
    }
}