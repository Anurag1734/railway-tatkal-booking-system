# Database Design

## 1. Initial Relational Model

``` text
users
trains
stations
train_stops
coaches
seats
bookings
booking_passengers
seat_allocations
payments
tickets
```

## 2. Suggested Relationships

``` text
users 1 ──── * bookings

trains 1 ──── * train_stops
stations 1 ── * train_stops

trains 1 ──── * coaches
coaches 1 ─── * seats

bookings 1 ── * booking_passengers
bookings 1 ── 1 payments
bookings 1 ── 0..1 tickets

bookings * ─── 1 seat_allocations
seats 1 ───── * seat_allocations
```

## 3. Critical Uniqueness

The final schema must enforce correctness at the database layer as well
as in application logic.

The exact constraint depends on the chosen inventory model, but the
invariant should be equivalent to:

``` text
UNIQUE(train_id, journey_date, seat_id, active_allocation)
```

A stronger relational design is preferable to relying only on an
application-level `if available` check.

## 4. Booking Transaction

A typical synchronous booking transaction:

``` text
BEGIN
  validate request
  validate journey/train
  lock or atomically claim inventory
  create booking
  create passenger rows
  create payment
COMMIT
```

If any critical step fails, the transaction must roll back.

## 5. Indexing Strategy

Initial candidates:

``` text
stations.station_code UNIQUE

trains.train_number UNIQUE

train_stops(train_id, sequence_number)

bookings(user_id, created_at)

bookings(booking_reference) UNIQUE

tickets(pnr) UNIQUE

seat_allocations(train_id, journey_date, seat_id)
```

Add indexes based on measured query patterns rather than indexing every
column.

## 6. Read Replicas

A read-replica architecture may be documented later for search-heavy
workloads.

Important rule:

> Never casually route correctness-critical reads to a replica if
> replication lag could produce an incorrect booking decision.

Inventory reservation remains anchored to the primary/authoritative
write path.

## 7. Migration Strategy

Use versioned database migrations once schema evolution begins. Avoid
relying on ad-hoc manual SQL changes in the final repository.
