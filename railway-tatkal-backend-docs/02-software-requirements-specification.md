# Software Requirements Specification

**Status:** Draft v1.0

## 1. Functional Requirements

  -----------------------------------------------------------------------
  ID                      Requirement             Priority
  ----------------------- ----------------------- -----------------------
  FR-01                   User can register with  Must
                          unique credentials.     

  FR-02                   User can authenticate   Must
                          and obtain an           
                          authenticated           
                          session/token.          

  FR-03                   User can search trains  Must
                          by source, destination  
                          and date.               

  FR-04                   User can inspect a      Must
                          train's route and       
                          available inventory.    

  FR-05                   User can provide one or Must
                          more passenger records  
                          for a booking.          

  FR-06                   User can select an      Must
                          available seat.         

  FR-07                   System creates a        Must
                          booking with a unique   
                          booking identifier.     

  FR-08                   System prevents         Must
                          duplicate successful    
                          sale of the same seat   
                          for the same journey.   

  FR-09                   User can initiate a     Must
                          mock payment.           

  FR-10                   User can complete/fail  Must
                          a mock payment.         

  FR-11                   Successful payment      Must
                          results in a confirmed  
                          ticket.                 

  FR-12                   System generates a      Must
                          unique PNR for a        
                          confirmed ticket.       

  FR-13                   User can retrieve a     Must
                          ticket by PNR.          

  FR-14                   User can view booking   Must
                          history.                

  FR-15                   User can cancel an      Should
                          eligible booking.       

  FR-16                   System supports         Must
                          configurable Tatkal     
                          opening rules.          

  FR-17                   System rate-limits      Must
                          booking-sensitive       
                          endpoints.              

  FR-18                   Booking retries with    Must
                          the same idempotency    
                          key do not create       
                          duplicate bookings.     

  FR-19                   Booking events can be   Should
                          published for           
                          asynchronous consumers. 

  FR-20                   System exposes health   Should
                          and useful operational  
                          metrics/logs.           
  -----------------------------------------------------------------------

## 2. Non-functional Requirements

### NFR-01 --- Consistency

A seat must not have two successful bookings for the same
journey/inventory context.

### NFR-02 --- Atomicity

Critical booking state transitions must be transactional.

### NFR-03 --- Idempotency

Retrying a client request must not unintentionally create another
booking, payment, or ticket.

### NFR-04 --- Availability

The application should fail gracefully when non-critical dependencies
such as asynchronous consumers are unavailable.

### NFR-05 --- Performance

The application should keep the synchronous booking path short and avoid
unnecessary downstream work.

No artificial production SLA is claimed; benchmark targets will be
established after profiling.

### NFR-06 --- Scalability

Application instances should be stateless enough to support horizontal
scaling.

### NFR-07 --- Security

Passwords must never be stored in plaintext. Authorization must be
enforced server-side.

### NFR-08 --- Observability

Important booking/payment operations should be traceable through
structured logs and correlation/request identifiers.

### NFR-09 --- Maintainability

Business rules belong in services/domain logic rather than controllers
or repository classes.

### NFR-10 --- Testability

Booking correctness, state transitions and concurrency behavior must be
covered by automated tests.

## 3. Assumptions

-   One logical railway operator is simulated.
-   Train schedules and seat inventory are seeded/managed by the
    application.
-   Real railway integrations are out of scope.
-   Payment is simulated.
-   Initial deployment uses a single MySQL primary.
-   Read replicas are an architectural extension, not an MVP dependency.
-   Redis and Kafka are introduced only in later stages.

## 4. Constraints

The project is intentionally bounded to remain implementable as a
portfolio project. Complexity must be earned by a demonstrated
requirement or bottleneck.
