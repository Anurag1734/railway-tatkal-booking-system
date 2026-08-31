# Architecture and Evolution

## Stage 1 --- Modular Monolith

``` text
Users
  ↓
Spring Boot REST API
  ↓
Service Layer
  ↓
Repository Layer
  ↓
MySQL
```

Modules:

``` text
auth
train
booking
payment
ticket
user
```

The application is one deployable unit, but code is separated by domain
responsibility.

## Stage 2 --- Domain and Transaction Boundaries

Introduce explicit booking lifecycle and transactional use cases.

``` text
Controller
    ↓
BookingService
    ↓
@Transactional
    ├── Inventory
    ├── Booking
    └── Payment initialization
```

## Stage 3 --- Concurrency Protection

The booking path becomes:

``` text
Request
  ↓
Validate
  ↓
Idempotency check
  ↓
Inventory reservation
  ↓
Transactional booking state
  ↓
Commit
```

The exact locking strategy is an implementation decision to be
benchmarked and documented.

## Stage 4 --- Tatkal Load

``` text
Users
  ↓
Rate Limiter
  ↓
Booking API
  ↓
Concurrency-safe inventory
```

The objective is not to make every request succeed. The objective is to
protect the system while preserving correctness.

## Stage 5 --- Redis

Candidate uses:

-   train/search cache
-   rate-limit counters
-   short-lived idempotency records
-   temporary booking/session state where justified

Redis is not the source of truth for confirmed ticket inventory.

## Stage 6 --- Kafka

``` text
Booking API
    ↓
MySQL
    ↓
Event publication
    ↓
Kafka
 ┌──┼──────────────┐
 ↓  ↓              ↓
Ticket/   Notification   Analytics
Audit       Worker        Worker
```

The final implementation should address the reliability gap between a
database commit and event publication, potentially with an outbox
pattern.

## Stage 7 --- Horizontal Scaling

``` text
                         Users
                           ↓
                     Load Balancer
                           ↓
          ┌────────────────┼────────────────┐
          ↓                ↓                ↓
      Backend 1        Backend 2        Backend 3
          │                │                │
          └────────────────┼────────────────┘
                           ↓
                     Redis / Cache
                           ↓
                       MySQL Primary
                           ↓
                    Read Replicas
```

Application instances should not keep correctness-critical state only in
local memory.

## Architecture Principles

1.  Start simple.
2.  Keep the database authoritative for durable booking state.
3.  Scale the stateless application tier horizontally.
4.  Use caching for read performance, not correctness.
5.  Use messaging for asynchronous work, not as an excuse to make the
    critical path complicated.
6.  Document trade-offs and failure modes.
