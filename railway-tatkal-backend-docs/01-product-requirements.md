# Railway Tatkal Booking System --- Product Requirements Document

**Status:** Draft v1.0\
**Project type:** Backend-heavy SDE portfolio project\
**Primary objective:** Demonstrate production-oriented backend
engineering through a railway ticket booking system with a deliberately
evolved architecture.

## 1. Product Vision

Build a realistic railway/Tatkal booking backend that starts as a
modular monolith and evolves through clearly justified engineering
stages into a horizontally scalable, concurrency-safe system.

The project is intentionally focused on backend engineering. The UI
exists to exercise the APIs and demonstrate the complete user journey;
it is not the primary engineering artifact.

## 2. Problem Statement

Railway ticket booking combines several difficult backend concerns:

-   finite seat inventory
-   concurrent users competing for the same inventory
-   transactional consistency
-   high request bursts during Tatkal opening
-   duplicate requests and retries
-   caching
-   asynchronous processing
-   payment state management
-   horizontal scaling
-   failure recovery

The system should model these concerns without depending on real
railway/IRCTC or payment-provider integrations.

## 3. Goals

### Functional goals

1.  User registration and login.
2.  Search trains by source, destination and journey date.
3.  View train, route, coach and seat information.
4.  Enter passenger details.
5.  Select/reserve a seat.
6.  Create a booking.
7.  Initiate and complete a mock payment.
8.  Generate a ticket/PNR after successful booking/payment.
9.  View booking history.
10. Retrieve a ticket using its PNR.
11. Cancel an eligible booking.
12. Simulate a Tatkal opening window.

### Engineering goals

1.  Use Spring Boot as the primary backend framework.
2.  Use MySQL as the system of record.
3.  Make transactional boundaries explicit.
4.  Guarantee that a seat cannot be successfully sold twice.
5.  Make retry-sensitive operations idempotent.
6.  Introduce Redis only where caching/short-lived state provides a
    clear benefit.
7.  Introduce Kafka only for genuinely asynchronous workflows.
8.  Demonstrate horizontal scaling and load balancing conceptually and
    locally where practical.
9.  Add automated testing for correctness and concurrency.
10. Containerize the final system with Docker Compose.

## 4. Non-goals

Explicitly excluded:

-   real payment gateway integration
-   real railway/IRCTC integration
-   real money movement
-   production railway compliance
-   elaborate frontend
-   microservices from day one
-   Kubernetes
-   service mesh
-   OAuth ecosystem
-   recommendation systems
-   real-time chat
-   large admin platform
-   production-grade multi-region deployment

## 5. Target Users

### Passenger

Can register, authenticate, search trains, book tickets, pay through the
mock payment flow, view tickets and cancel eligible bookings.

### Developer/Reviewer

Can inspect the code, architecture, database design, tests and
documented trade-offs to understand the engineering decisions.

## 6. Core User Journey

``` text
Register
   ↓
Login
   ↓
Search train
   ↓
View availability
   ↓
Select passenger + seat
   ↓
Create booking
   ↓
Initiate mock payment
   ↓
Complete mock payment
   ↓
Confirm booking
   ↓
Generate PNR/ticket
   ↓
View ticket
```

## 7. Success Criteria

The MVP is successful when a user can complete:

> login → search → book → mock payment → ticket

The concurrency milestone is successful when a test demonstrates that
concurrent attempts cannot both successfully book the same seat.

The Tatkal milestone is successful when a burst of requests is
controlled by rate limiting and duplicate booking attempts are safely
handled through idempotency and transactional inventory protection.

## 8. Product Principles

-   Correctness before performance.
-   Database is the source of truth for durable booking state.
-   Do not introduce infrastructure without a concrete problem.
-   Prefer simple designs that are easy to reason about.
-   Keep the critical booking path synchronous until asynchronous
    processing has a clear justification.
-   Document every major architectural evolution.
