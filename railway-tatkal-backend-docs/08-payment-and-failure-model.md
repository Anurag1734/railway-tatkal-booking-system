# Mock Payment and Failure Model

## 1. Scope

The payment system is deliberately simulated.

No real gateway, banking API, card network or money transfer is
implemented.

## 2. Payment Flow

``` text
Booking created
      ↓
Payment INITIATED
      ↓
Display mock QR
      ↓
User clicks Pay
      ↓
POST /payments/{id}/complete
      ↓
SUCCESS / FAILED
```

## 3. QR

The QR contains non-sensitive mock data such as:

``` text
payment_id
booking_id
mock_payment_reference
```

It has no monetary value.

## 4. Failure Cases

The implementation should explicitly test:

-   payment fails
-   payment completion is retried
-   booking request is retried
-   client disconnects after booking creation
-   payment succeeds but response is lost
-   invalid payment ID
-   payment for another user's booking
-   booking cancellation during payment pending state

## 5. Consistency Rule

The system must define what happens when payment and booking states
disagree.

A recommended state model is:

``` text
BOOKING PAYMENT_PENDING
        ↓
payment SUCCESS
        ↓
BOOKING CONFIRMED
        ↓
TICKET ISSUED
```

Transitions should be transactional where they touch the same database.

If asynchronous processing is later used, eventual consistency and
recovery behavior must be explicitly documented.

## 6. Idempotent Payment Completion

Calling payment completion twice must not produce two tickets, two
charges, or two confirmation events.

Example:

``` text
first completion  → SUCCESS + ticket
second completion → same successful result
```
