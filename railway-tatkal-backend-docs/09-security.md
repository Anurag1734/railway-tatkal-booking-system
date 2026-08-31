# Security Requirements

This is a portfolio project, but security-sensitive engineering
decisions should still be explicit.

## Authentication

-   Store password hashes, never plaintext passwords.
-   Never log passwords or authentication tokens.
-   Validate credentials server-side.
-   Use short-lived access credentials where applicable.

## Authorization

Every booking/ticket operation must verify ownership or explicit
authorization.

Example:

``` text
GET /bookings/501
```

must not reveal booking 501 merely because the requester knows its ID.

## Input Validation

Validate:

-   required fields
-   string lengths
-   dates
-   station codes
-   passenger age
-   seat identifiers
-   enum values

## Database Security

-   Use parameterized queries/JPA mechanisms.
-   Do not concatenate user input into SQL.
-   Keep credentials outside source control.
-   Use environment variables/configuration management for secrets.

## API Security

-   Return generic authentication failures.
-   Avoid leaking stack traces.
-   Apply rate limiting to abuse-sensitive endpoints.
-   Consider stricter limits on login and booking endpoints.

## Logging

Never log:

-   passwords
-   access tokens
-   payment secrets
-   unnecessary personally identifying information

Log identifiers needed for troubleshooting, subject to minimizing
sensitive data.

## Threats to Discuss

-   credential attacks
-   broken object-level authorization
-   duplicate request abuse
-   booking floods
-   SQL injection
-   sensitive-data leakage
-   replay of payment completion
-   denial of service through unbounded requests
