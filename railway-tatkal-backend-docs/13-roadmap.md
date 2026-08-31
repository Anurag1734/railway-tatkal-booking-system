# Implementation Roadmap

## Stage 1 --- Basic Backend MVP

Deliver:

-   Spring Boot project
-   REST API
-   MySQL schema
-   entities/repositories/services/controllers
-   registration/login
-   train search
-   booking
-   mock payment
-   ticket/PNR

Definition of done:

``` text
login → search → book → mock payment → ticket
```

## Stage 2 --- Proper Domain + Transactions

Add:

-   booking lifecycle
-   payment lifecycle
-   cancellation
-   passenger management
-   transaction boundaries
-   validation
-   booking history

## Stage 3 --- Concurrency + Locking

Add:

-   inventory model
-   locking/versioning
-   unique constraints
-   concurrent integration tests
-   documented race-condition analysis

## Stage 4 --- Tatkal

Add:

-   configurable opening window
-   rate limiting
-   idempotency
-   burst testing
-   graceful rejection

## Stage 5 --- Redis

Add only justified uses:

-   search caching
-   rate limiting
-   short-lived idempotency state where appropriate

Measure cache behavior.

## Stage 6 --- Kafka

Add:

-   domain events
-   Kafka producer
-   notification worker
-   analytics worker
-   ticket/audit worker as appropriate
-   retry/error handling
-   outbox if required

## Stage 7 --- HLD + Horizontal Scaling

Document and, where practical, demonstrate:

-   load balancing
-   multiple backend instances
-   statelessness
-   MySQL primary/read replica architecture
-   cache placement
-   bottlenecks
-   failure modes

## Stage 8 --- Mock Payment Hardening

Add:

-   QR display
-   payment retries
-   failure simulation
-   idempotent completion
-   consistency tests

## Stage 9 --- Docker

Compose:

``` text
Spring Boot
MySQL
Redis
Kafka
```

only for components actually implemented.

## Final Portfolio Gate

Before calling the project complete:

-   clean README
-   architecture diagram
-   API documentation
-   database ERD
-   state diagrams
-   ADRs
-   unit/integration/concurrency tests
-   Docker setup
-   sample data
-   failure-mode documentation
-   measured performance results
-   limitations section
-   resume-ready project description
