# Railway Tatkal Booking System

A backend-heavy railway ticket booking system built with Java and Spring
Boot, designed to evolve from a transactional modular monolith into a
concurrency-safe, cache-enabled and event-driven architecture.

## Why this project?

Railway/Tatkal booking is a useful systems problem because it combines:

-   finite inventory
-   transactions
-   concurrent requests
-   idempotency
-   rate limiting
-   caching
-   asynchronous processing
-   failure handling
-   horizontal scaling

The project intentionally implements these concerns incrementally rather
than adding distributed infrastructure from day one.

## Technology Stack

### Initial

-   Java
-   Spring Boot
-   Spring MVC
-   Spring Data JPA
-   MySQL

### Later stages

-   Redis
-   Apache Kafka
-   Docker / Docker Compose

## Core Flow

``` text
Login
  ↓
Search train
  ↓
Select journey/seat
  ↓
Create booking
  ↓
Mock payment
  ↓
Confirm
  ↓
Generate PNR/ticket
```

## Architecture Evolution

``` text
Modular Monolith
      ↓
Transactions + Domain Model
      ↓
Concurrency + Locking
      ↓
Tatkal + Rate Limiting + Idempotency
      ↓
Redis
      ↓
Kafka
      ↓
Horizontal Scaling
      ↓
Dockerized System
```

## Scope

This is a simulation.

It does not integrate with:

-   IRCTC/real railway systems
-   real payment gateways
-   banking infrastructure

## Engineering Focus

The frontend is deliberately simple. The backend is the primary
artifact.

The most important correctness guarantee is:

> A seat cannot be successfully booked twice for the same journey.

## Documentation

See the `docs/` directory for:

-   product requirements
-   software requirements
-   domain model
-   API contract
-   database design
-   architecture evolution
-   concurrency/Tatkal design
-   payment/failure model
-   security
-   testing
-   observability
-   architecture decisions
-   roadmap
