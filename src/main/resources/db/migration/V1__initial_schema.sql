CREATE TABLE users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'USER',
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uk_users_email UNIQUE (email),
    CONSTRAINT uk_users_phone UNIQUE (phone)
);

CREATE TABLE stations (
    station_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    station_code VARCHAR(10) NOT NULL,
    station_name VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    zone VARCHAR(50),

    CONSTRAINT uk_stations_code UNIQUE (station_code)
);

CREATE TABLE trains (
    train_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    train_number VARCHAR(20) NOT NULL,
    train_name VARCHAR(100) NOT NULL,
    train_type VARCHAR(50),
    source_station_id BIGINT NOT NULL,
    destination_station_id BIGINT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT uk_trains_number UNIQUE (train_number),

    CONSTRAINT fk_train_source
        FOREIGN KEY (source_station_id)
        REFERENCES stations(station_id),

    CONSTRAINT fk_train_destination
        FOREIGN KEY (destination_station_id)
        REFERENCES stations(station_id)
);

CREATE TABLE train_stops (
    stop_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    train_id BIGINT NOT NULL,
    station_id BIGINT NOT NULL,
    stop_order INT NOT NULL,
    arrival_time TIME,
    departure_time TIME,
    distance_from_source INT,

    CONSTRAINT fk_stop_train
        FOREIGN KEY (train_id)
        REFERENCES trains(train_id),

    CONSTRAINT fk_stop_station
        FOREIGN KEY (station_id)
        REFERENCES stations(station_id),

    CONSTRAINT uk_train_stop_order
        UNIQUE (train_id, stop_order),

    INDEX idx_train_stops_station
        (station_id)
);

CREATE TABLE coaches (
    coach_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    train_id BIGINT NOT NULL,
    coach_code VARCHAR(20) NOT NULL,
    coach_type VARCHAR(30) NOT NULL,
    capacity INT NOT NULL,

    CONSTRAINT fk_coach_train
        FOREIGN KEY (train_id)
        REFERENCES trains(train_id),

    CONSTRAINT uk_train_coach
        UNIQUE (train_id, coach_code)
);

CREATE TABLE seats (
    seat_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    coach_id BIGINT NOT NULL,
    seat_number VARCHAR(20) NOT NULL,
    berth_type VARCHAR(30),
    class_type VARCHAR(30),

    CONSTRAINT fk_seat_coach
        FOREIGN KEY (coach_id)
        REFERENCES coaches(coach_id),

    CONSTRAINT uk_coach_seat
        UNIQUE (coach_id, seat_number)
);

CREATE TABLE bookings (
    booking_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    train_id BIGINT NOT NULL,

    booking_reference VARCHAR(30) NOT NULL,
    journey_date DATE NOT NULL,

    source_station_id BIGINT NOT NULL,
    destination_station_id BIGINT NOT NULL,

    booking_status VARCHAR(30) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    total_amount DECIMAL(10,2) NOT NULL,

    CONSTRAINT uk_booking_reference
        UNIQUE (booking_reference),

    CONSTRAINT fk_booking_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id),

    CONSTRAINT fk_booking_train
        FOREIGN KEY (train_id)
        REFERENCES trains(train_id),

    CONSTRAINT fk_booking_source
        FOREIGN KEY (source_station_id)
        REFERENCES stations(station_id),

    CONSTRAINT fk_booking_destination
        FOREIGN KEY (destination_station_id)
        REFERENCES stations(station_id),

    INDEX idx_bookings_user_created
        (user_id, created_at)
);

CREATE TABLE booking_passengers (
    bp_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,

    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    berth_preference VARCHAR(30),
    concession_type VARCHAR(30),

    CONSTRAINT fk_passenger_booking
        FOREIGN KEY (booking_id)
        REFERENCES bookings(booking_id)
        ON DELETE CASCADE
);

CREATE TABLE seat_allocations (
    allocation_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    seat_id BIGINT NOT NULL,

    seat_number VARCHAR(20),
    coach_id BIGINT,
    berth_type VARCHAR(30),
    status VARCHAR(30) NOT NULL,

    CONSTRAINT fk_allocation_booking
        FOREIGN KEY (booking_id)
        REFERENCES bookings(booking_id),

    CONSTRAINT fk_allocation_seat
        FOREIGN KEY (seat_id)
        REFERENCES seats(seat_id)
);

CREATE TABLE payments (
    payment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,

    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    payment_status VARCHAR(30) NOT NULL,

    transaction_ref VARCHAR(100) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uk_payment_transaction
        UNIQUE (transaction_ref),

    CONSTRAINT fk_payment_booking
        FOREIGN KEY (booking_id)
        REFERENCES bookings(booking_id)
);

CREATE TABLE tickets (
    ticket_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,

    pnr VARCHAR(30) NOT NULL,
    journey_from VARCHAR(20) NOT NULL,
    journey_to VARCHAR(20) NOT NULL,
    journey_date DATE NOT NULL,

    qr_code_data TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uk_ticket_pnr
        UNIQUE (pnr),

    CONSTRAINT uk_ticket_booking
        UNIQUE (booking_id),

    CONSTRAINT fk_ticket_booking
        FOREIGN KEY (booking_id)
        REFERENCES bookings(booking_id)
);