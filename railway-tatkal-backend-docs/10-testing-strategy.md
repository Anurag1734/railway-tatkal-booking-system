# Testing Strategy

## Testing Pyramid

``` text
             E2E
            /   \
       Integration
          /       \
       Unit Tests
```

## Unit Tests

Cover pure business rules:

-   booking state transitions
-   payment state transitions
-   Tatkal eligibility
-   cancellation rules
-   fare/validation logic
-   idempotency decisions

## Repository Tests

Verify:

-   persistence mappings
-   uniqueness constraints
-   query correctness
-   indexing assumptions where practical

## Integration Tests

Use a real relational database environment to verify:

-   transactions
-   locking
-   rollback behavior
-   booking + inventory consistency
-   payment + booking state transitions

## Concurrency Tests

Highest-value test:

``` text
N concurrent requests
        ↓
same train
same date
same seat
        ↓
assert exactly one success
```

Also test:

-   same idempotency key concurrently
-   different idempotency keys competing for same seat
-   cancellation vs booking race
-   payment completion retries

## API Tests

Verify:

-   status codes
-   request validation
-   authentication
-   authorization
-   response schema
-   error contracts

## End-to-End Test

Minimum happy path:

``` text
register
→ login
→ search
→ select train
→ book
→ initiate payment
→ complete mock payment
→ retrieve ticket
```

## Performance Tests

Later stages should benchmark:

-   train search throughput
-   booking throughput
-   hot-seat contention
-   rate-limit behavior
-   Redis cache hit/miss behavior
-   Kafka consumer lag

Do not claim scalability numbers without measurements.
