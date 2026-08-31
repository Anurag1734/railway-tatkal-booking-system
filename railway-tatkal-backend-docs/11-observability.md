# Observability

## Logging

Use structured logs for important events.

Example conceptual event:

``` text
event=BOOKING_CREATED
booking_id=501
user_id=101
train_id=42
journey_date=2026-09-10
request_id=...
```

Avoid sensitive data.

## Correlation

Every request should have a request/correlation ID that appears in
relevant logs.

## Metrics

Useful application metrics:

-   HTTP request count
-   request latency
-   error count
-   booking attempts
-   successful bookings
-   inventory conflicts
-   rate-limit rejections
-   payment successes/failures
-   Kafka publish failures
-   consumer lag

## Health

Expose health checks for:

-   application
-   MySQL
-   Redis once introduced
-   Kafka once introduced

Health checks should distinguish application liveness from dependency
readiness where appropriate.

## Alert-worthy Conditions

For a more production-like deployment, examples include:

-   sustained booking error rate
-   database connection exhaustion
-   high inventory conflict rate
-   Kafka consumer lag
-   Redis unavailable
