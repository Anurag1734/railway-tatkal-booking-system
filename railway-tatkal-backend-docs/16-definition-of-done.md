# Definition of Done

A feature is not considered complete merely because the endpoint works
manually.

## Code

-   clear domain responsibility
-   thin controllers
-   service-level business logic
-   validated inputs
-   appropriate exception handling
-   no unnecessary duplication

## Database

-   correct relationships
-   appropriate constraints
-   migration included
-   indexes justified

## API

-   documented endpoint
-   request/response examples
-   validation errors
-   authentication/authorization behavior
-   idempotency behavior where relevant

## Tests

At minimum:

-   happy path
-   invalid input
-   authorization failure
-   expected conflict
-   persistence behavior

Concurrency-sensitive code also requires a real concurrent integration
test.

## Observability

Important operations produce useful logs without leaking sensitive
information.

## Documentation

Update the relevant architecture/ADR document whenever a meaningful
design decision changes.

## Review Gate

Before moving to the next stage, answer:

1.  What problem did this stage solve?
2.  What invariant must remain true?
3.  What failure modes exist?
4.  How is the behavior tested?
5.  What bottleneck or limitation remains?
6.  Why is the next technology justified?
