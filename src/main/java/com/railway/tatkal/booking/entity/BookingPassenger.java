package com.railway.tatkal.booking.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "booking_passengers")
public class BookingPassenger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bp_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "booking_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_passenger_booking")
    )
    private Booking booking;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "age", nullable = false)
    private Integer age;

    @Column(name = "gender", nullable = false, length = 20)
    private String gender;

    @Column(name = "berth_preference", length = 30)
    private String berthPreference;

    @Column(name = "concession_type", length = 30)
    private String concessionType;

    protected BookingPassenger() {
        // Required by JPA
    }

    public BookingPassenger(
            Booking booking,
            String name,
            Integer age,
            String gender,
            String berthPreference,
            String concessionType
    ) {
        this.booking = booking;
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.berthPreference = berthPreference;
        this.concessionType = concessionType;
    }

    public Long getId() {
        return id;
    }

    public Booking getBooking() {
        return booking;
    }

    public String getName() {
        return name;
    }

    public Integer getAge() {
        return age;
    }

    public String getGender() {
        return gender;
    }

    public String getBerthPreference() {
        return berthPreference;
    }

    public String getConcessionType() {
        return concessionType;
    }
}