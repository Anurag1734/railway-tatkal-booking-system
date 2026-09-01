CREATE TABLE seat_inventory (
    inventory_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    train_run_id BIGINT NOT NULL,
    seat_id BIGINT NOT NULL,

    status VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE',

    held_until TIMESTAMP NULL,

    version BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT fk_inventory_train_run
        FOREIGN KEY (train_run_id)
        REFERENCES train_runs(train_run_id),

    CONSTRAINT fk_inventory_seat
        FOREIGN KEY (seat_id)
        REFERENCES seats(seat_id),

    CONSTRAINT uk_inventory_run_seat
        UNIQUE (train_run_id, seat_id),

    INDEX idx_inventory_run_status
        (train_run_id, status)
);