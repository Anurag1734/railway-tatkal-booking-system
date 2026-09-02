ALTER TABLE seat_inventory
ADD COLUMN held_by_user_id BIGINT NULL;

ALTER TABLE seat_inventory
ADD CONSTRAINT fk_inventory_hold_user
FOREIGN KEY (held_by_user_id)
REFERENCES users(user_id);