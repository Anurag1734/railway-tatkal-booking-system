# Architecture Decision Records

## ADR-001 --- Start as a Modular Monolith

**Status:** Accepted

### Context

The project needs to demonstrate scalable backend concepts without
spending the initial development budget on distributed-system overhead.

### Decision

Start with one Spring Boot deployment organized into domain modules.

### Consequences

Positive:

-   simpler local development
-   easy transactions
-   simpler debugging
-   faster MVP delivery

Negative:

-   less physical isolation
-   eventual extraction requires explicit boundaries

------------------------------------------------------------------------

## ADR-002 --- MySQL Is the Source of Truth

**Status:** Accepted

Durable booking, payment and ticket state is stored in MySQL.

Caches and queues must not become the authoritative source for confirmed
inventory.

------------------------------------------------------------------------

## ADR-003 --- Introduce Redis Only After a Demonstrated Need

**Status:** Accepted

Redis is introduced for cache/short-lived state/rate limiting only after
the relational MVP is correct.

This prevents infrastructure-first design.

------------------------------------------------------------------------

## ADR-004 --- Introduce Kafka for Asynchronous Work

**Status:** Accepted

Kafka is not placed between the user and the critical booking
transaction by default.

It is introduced for downstream work such as notifications, analytics
and audit processing.

------------------------------------------------------------------------

## ADR-005 --- Mock Payment Instead of Real Gateway

**Status:** Accepted

A mock payment flow provides the necessary state-machine, idempotency
and failure-handling learning without external credentials, real money
or gateway dependencies.

------------------------------------------------------------------------

## ADR-006 --- Database-Enforced Inventory Invariant

**Status:** Accepted

Application-level checks are insufficient under concurrency. The final
design must include a database-level invariant that prevents duplicate
active allocation.

------------------------------------------------------------------------

## ADR-007 --- Outbox Pattern for Reliable Event Publication

**Status:** Proposed for Stage 6

If the system commits booking state to MySQL and publishes Kafka events
separately, a crash can produce:

``` text
DB commit succeeded
Kafka publish failed
```

The outbox pattern can make event publication recoverable and
observable.

The final decision should follow implementation/testing.
