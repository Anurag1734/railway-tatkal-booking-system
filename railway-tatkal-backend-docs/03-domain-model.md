# Domain Model

## 1. Core Entities

``` text
User
 └──< Booking
       ├──< Passenger
       ├── Payment
       └── Ticket

Train
 ├──< Route/TrainStop
 └──< Coach
        └──< Seat

Booking
 └── Seat allocation / inventory reservation
```

## 2. Entity Responsibilities

### User

Represents an authenticated passenger account.

Key fields:

-   id
-   name
-   email/username
-   password_hash
-   created_at
-   updated_at

### Train

Represents a scheduled train service.

Key fields:

-   id
-   train_number
-   train_name
-   active

### Station

Represents a station in the network.

Key fields:

-   id
-   station_code
-   station_name

### Route / TrainStop

Associates a train with ordered stations and timing.

Key fields:

-   id
-   train_id
-   station_id
-   sequence_number
-   arrival_time
-   departure_time

### Coach

Represents a coach attached to a train/service.

Key fields:

-   id
-   train_id
-   coach_number
-   coach_type

### Seat

Represents a physical seat within a coach.

Key fields:

-   id
-   coach_id
-   seat_number
-   seat_type

### Booking

Represents the lifecycle of a user's attempt to reserve inventory.

Key fields:

-   id
-   booking_reference
-   user_id
-   train_id
-   journey_date
-   source_station_id
-   destination_station_id
-   status
-   idempotency_key
-   created_at
-   updated_at

### Passenger

Represents a traveler attached to a booking.

### Payment

Represents the mock payment state associated with a booking.

### Ticket

Represents the confirmed travel artifact.

Key fields:

-   id
-   pnr
-   booking_id
-   status
-   issued_at

## 3. Important Modeling Decision

Do not model `Seat` as globally occupied forever.

A seat is reusable across different journeys/dates. The system therefore
needs a journey-specific inventory/allocation concept.

A later schema should introduce a concept equivalent to:

``` text
SeatInventory
    seat_id
    train_id
    journey_date
    status
```

or a booking/allocation table whose uniqueness rules encode the same
invariant.

## 4. Booking State Machine

``` text
                ┌──────────────┐
                │    PENDING   │
                └──────┬───────┘
                       │
                 payment initiated
                       ↓
              ┌──────────────────┐
              │ PAYMENT_PENDING   │
              └───────┬──────────┘
                      / \
             success /   \ failure
                    ↓     ↓
             ┌─────────┐ ┌────────┐
             │CONFIRMED│ │ FAILED │
             └────┬────┘ └────────┘
                  │
               cancel
                  ↓
             ┌───────────┐
             │ CANCELLED │
             └───────────┘
```

State transitions must be explicit and validated rather than allowing
arbitrary enum updates.

## 5. Payment State Machine

``` text
INITIATED
   ├──→ SUCCESS
   └──→ FAILED
```

A payment should not move from `SUCCESS` back to `INITIATED`.

## 6. Invariants

1.  PNR is unique.
2.  Booking reference is unique.
3.  User cannot access another user's private booking data.
4.  A successfully allocated seat cannot be successfully allocated twice
    for the same journey.
5.  A confirmed ticket must reference a valid confirmed booking.
6.  A successful mock payment must reference a valid booking.
7.  Repeated completion of the same payment is idempotent.
