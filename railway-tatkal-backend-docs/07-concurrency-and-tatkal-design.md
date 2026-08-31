# Concurrency and Tatkal Design

## 1. Core Race Condition

Two users can observe the same seat as available:

``` text
A: SELECT seat → available
B: SELECT seat → available
A: INSERT booking
B: INSERT booking
```

A naive check-then-write implementation is unsafe.

## 2. Correctness Invariant

For a given:

``` text
train + journey_date + seat
```

there may be at most one active successful allocation.

## 3. Candidate Strategies

### Pessimistic locking

Lock the relevant inventory row inside a transaction.

Advantages:

-   easy to reason about
-   strong serialization for a hot inventory row

Costs:

-   lock contention
-   lower throughput under extreme contention
-   careful transaction sizing required

### Optimistic locking

Use a version column and reject stale updates.

Advantages:

-   less blocking
-   useful when conflicts are relatively rare

Costs:

-   retries become necessary
-   hot inventory can cause many conflicts

### Database uniqueness

Use a unique constraint as the final safety net.

This should complement application logic rather than replace transaction
design.

## 4. Recommended Evolution

For the learning project:

1.  First implement a naive version to expose the race.
2.  Add a database-enforced invariant.
3.  Add transactional locking/versioning.
4.  Write a concurrent integration test.
5.  Compare behavior and performance.
6.  Document the chosen strategy and why.

## 5. Idempotency

Client sends:

``` text
Idempotency-Key: abc-123
```

The server associates the key with the booking operation/result.

Repeated request:

``` text
abc-123 → return original result
```

rather than creating a second booking.

The implementation must define:

-   key scope
-   expiration
-   payload mismatch behavior
-   persistence location
-   concurrency behavior for simultaneous duplicate requests

## 6. Tatkal Traffic

Tatkal opening creates a burst:

``` text
                  ███████████████
                  ███████████████
                  ███████████████
────────────────────────────────────→ time
                       opening
```

Protection mechanisms:

-   rate limiting
-   bounded connection/thread resources
-   short critical transactions
-   idempotency
-   inventory locking
-   caching where appropriate
-   graceful `429` responses
-   asynchronous non-critical work

## 7. Backpressure

When downstream capacity is lower than incoming demand, the system must
avoid unbounded work accumulation.

Possible mechanisms:

-   rate limiting
-   bounded thread pools
-   queue partitioning
-   consumer scaling
-   controlled retries
-   dead-letter handling for failed asynchronous messages

## 8. Concurrency Test

The key test should launch many concurrent booking attempts against the
same seat and assert:

``` text
successful bookings = 1
conflicting attempts = N - 1
duplicate active allocations = 0
```

The test must use real transactional behavior against an
integration-test database rather than only mocking the repository.
