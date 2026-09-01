INSERT INTO seat_inventory (
    train_run_id,
    seat_id,
    status,
    held_until,
    version
)
SELECT
    tr.train_run_id,
    s.seat_id,
    'AVAILABLE',
    NULL,
    0
FROM train_runs tr
CROSS JOIN seats s;