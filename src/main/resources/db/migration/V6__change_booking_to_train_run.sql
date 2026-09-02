ALTER TABLE bookings
    ADD COLUMN train_run_id BIGINT NOT NULL;

ALTER TABLE bookings
    ADD CONSTRAINT fk_booking_train_run
        FOREIGN KEY (train_run_id)
        REFERENCES train_runs(train_run_id);

ALTER TABLE bookings
    DROP FOREIGN KEY fk_booking_train;

ALTER TABLE bookings
    DROP COLUMN train_id;