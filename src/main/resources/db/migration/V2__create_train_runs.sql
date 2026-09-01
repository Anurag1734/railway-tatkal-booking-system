CREATE TABLE train_runs (
    train_run_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    train_id BIGINT NOT NULL,
    run_date DATE NOT NULL,

    CONSTRAINT fk_train_run_train
        FOREIGN KEY (train_id)
        REFERENCES trains(train_id),

    CONSTRAINT uk_train_run_date
        UNIQUE (train_id, run_date)
);