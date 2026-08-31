# API Contract

**Base path:** `/api/v1`

The exact authentication mechanism may evolve during implementation; the
API should remain resource-oriented.

## Authentication

### POST `/auth/register`

Create an account.

Request:

``` json
{
  "name": "Aarav",
  "email": "aarav@example.com",
  "password": "example-password"
}
```

Response: `201 Created`

``` json
{
  "userId": 101,
  "message": "Registration successful"
}
```

### POST `/auth/login`

Request:

``` json
{
  "email": "aarav@example.com",
  "password": "example-password"
}
```

Response:

``` json
{
  "accessToken": "<token>",
  "userId": 101
}
```

## Train Search

### GET `/trains/search?from=NDLS&to=CSMT&date=2026-09-10`

Response:

``` json
{
  "trains": [
    {
      "trainId": 42,
      "trainNumber": "12952",
      "trainName": "Example Express",
      "departure": "20:00",
      "arrival": "14:00",
      "availableSeats": 17
    }
  ]
}
```

## Train Details

### GET `/trains/{trainId}`

Returns train metadata, route information and relevant availability.

## Booking

### POST `/bookings`

Header:

``` text
Idempotency-Key: <client-generated-key>
```

Request:

``` json
{
  "trainId": 42,
  "journeyDate": "2026-09-10",
  "sourceStation": "NDLS",
  "destinationStation": "CSMT",
  "passengers": [
    {
      "name": "Aarav",
      "age": 22,
      "gender": "MALE"
    }
  ],
  "seatId": 9001
}
```

Response:

``` json
{
  "bookingId": 501,
  "status": "PAYMENT_PENDING",
  "amount": 1250.00,
  "paymentId": 7001
}
```

Expected errors:

-   `400` invalid request
-   `401` unauthenticated
-   `404` train/seat not found
-   `409` inventory conflict / duplicate semantic request
-   `429` rate limited
-   `500` unexpected server failure

## Booking Retrieval

### GET `/bookings/{bookingId}`

Returns booking details subject to authorization.

### GET `/users/me/bookings`

Returns the authenticated user's booking history.

## Payment

### POST `/payments`

Creates a mock payment for a booking.

### POST `/payments/{paymentId}/complete`

Completes the mock payment.

Optional request:

``` json
{
  "result": "SUCCESS"
}
```

The implementation may expose a deliberately simple UI that displays a
QR before this call and then allows the user to trigger success.

## Ticket

### GET `/tickets/{pnr}`

Returns:

``` json
{
  "pnr": "PNR123456",
  "bookingId": 501,
  "trainNumber": "12952",
  "journeyDate": "2026-09-10",
  "source": "NDLS",
  "destination": "CSMT",
  "passengers": [],
  "seat": "A1-42",
  "status": "CONFIRMED"
}
```

## Cancellation

### POST `/bookings/{bookingId}/cancel`

Cancels an eligible booking and releases inventory according to the
defined business rules.

## API Design Rules

-   Use nouns for resources.
-   Use HTTP status codes consistently.
-   Never expose database implementation details unnecessarily.
-   Validate all input at the API boundary.
-   Return stable error codes/messages.
-   Keep controller logic thin.
