package com.railway.tatkal.booking.service;

import com.railway.tatkal.booking.dto.BookingPassengerRequest;
import com.railway.tatkal.booking.dto.BookingResponse;
import com.railway.tatkal.booking.dto.CreateBookingRequest;
import com.railway.tatkal.booking.entity.Booking;
import com.railway.tatkal.booking.entity.BookingPassenger;
import com.railway.tatkal.booking.entity.SeatAllocation;
import com.railway.tatkal.common.exception.ForbiddenOperationException;
import com.railway.tatkal.common.exception.ResourceNotFoundException;
import com.railway.tatkal.station.entity.Station;
import com.railway.tatkal.inventory.entity.SeatInventory;
import com.railway.tatkal.inventory.entity.SeatStatus;
import com.railway.tatkal.train.entity.TrainRun;
import com.railway.tatkal.booking.repository.BookingPassengerRepository;
import com.railway.tatkal.booking.repository.BookingRepository;
import com.railway.tatkal.booking.repository.SeatAllocationRepository;
import com.railway.tatkal.common.exception.SeatNotAvailableException;
import com.railway.tatkal.inventory.repository.SeatInventoryRepository;
import com.railway.tatkal.station.repository.StationRepository;
import com.railway.tatkal.train.repository.TrainRunRepository;
import com.railway.tatkal.user.entity.User;
import com.railway.tatkal.user.repository.UserRepository;
import com.railway.tatkal.train.entity.TrainStop;
import com.railway.tatkal.train.repository.TrainStopRepository;
import com.railway.tatkal.lock.DistributedLockService;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.time.Duration;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingPassengerRepository bookingPassengerRepository;
    private final SeatAllocationRepository seatAllocationRepository;
    private final SeatInventoryRepository seatInventoryRepository;
    private final UserRepository userRepository;
    private final TrainRunRepository trainRunRepository;
    private final StationRepository stationRepository;
    private final TrainStopRepository trainStopRepository;
    private final DistributedLockService distributedLockService;

    public BookingService(
            BookingRepository bookingRepository,
            BookingPassengerRepository bookingPassengerRepository,
            SeatAllocationRepository seatAllocationRepository,
            SeatInventoryRepository seatInventoryRepository,
            UserRepository userRepository,
            TrainRunRepository trainRunRepository,
            StationRepository stationRepository,
            TrainStopRepository trainStopRepository,
            DistributedLockService distributedLockService
    ) {
        this.bookingRepository = bookingRepository;
        this.bookingPassengerRepository = bookingPassengerRepository;
        this.seatAllocationRepository = seatAllocationRepository;
        this.seatInventoryRepository = seatInventoryRepository;
        this.userRepository = userRepository;
        this.trainRunRepository = trainRunRepository;
        this.stationRepository = stationRepository;
        this.trainStopRepository = trainStopRepository;
        this.distributedLockService = distributedLockService;
    }

    @Transactional
    public BookingResponse createBooking(CreateBookingRequest request) {

        // 1. Get authenticated user
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        // 2. Validate request
        validateRequest(request);

        // 3. Find train run
        TrainRun trainRun = trainRunRepository.findById(request.trainRunId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Train run not found"));

        // 4. Find stations
        Station sourceStation = stationRepository.findById(request.sourceStationId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Source station not found"));

        Station destinationStation = stationRepository.findById(request.destinationStationId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Destination station not found"));

    TrainStop sourceStop =
            trainStopRepository
                    .findByTrainIdAndStationId(
                            trainRun.getTrain().getId(),
                            sourceStation.getId()
                    )
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Source station is not a stop on this train"
                            )
                    );

    TrainStop destinationStop =
            trainStopRepository
                    .findByTrainIdAndStationId(
                            trainRun.getTrain().getId(),
                            destinationStation.getId()
                    )
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Destination station is not a stop on this train"
                            )
                    );

    if (sourceStop.getStopOrder() >= destinationStop.getStopOrder()) {
        throw new IllegalArgumentException(
                "Source station must come before destination station"
        );
    }

        // 5. Make sure source and destination are different
        if (sourceStation.getId().equals(destinationStation.getId())) {
            throw new IllegalArgumentException(
                    "Source and destination stations must be different"
            );
        }

        // 6. Get the requested seat inventories
        List<SeatInventory> inventories = new ArrayList<>();

        for (Long seatId : request.seatIds()) {

            SeatInventory inventory =
                    seatInventoryRepository
                            .findByTrainRunIdAndSeatId(
                                    request.trainRunId(),
                                    seatId
                            )
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Seat inventory not found for seat: " + seatId
                                    )
                            );

            inventories.add(inventory);
        }

        // 7. Verify that every seat is actively held by this user
        LocalDateTime now = LocalDateTime.now();

        inventories.sort(
                (a, b) -> Long.compare(
                        a.getSeat().getId(),
                        b.getSeat().getId()
                )
        );
        
        for (SeatInventory inventory : inventories) {

            if (inventory.getStatus() != SeatStatus.HELD) {
                throw new IllegalStateException(
                        "Seat " + inventory.getSeat().getSeatNumber()
                                + " is not held"
                );
            }

            if (inventory.getHeldUntil() == null
                    || !inventory.getHeldUntil().isAfter(now)) {

                throw new IllegalStateException(
                        "Hold has expired for seat "
                                + inventory.getSeat().getSeatNumber()
                );
            }

            if (inventory.getHeldByUser() == null
                    || !inventory.getHeldByUser().getId().equals(user.getId())) {

                throw new IllegalStateException(
                        "Seat " + inventory.getSeat().getSeatNumber()
                                + " is held by another user"
                );
            }
        }

        // 8. Generate booking reference
        String bookingReference =
                "TB-" + UUID.randomUUID()
                        .toString()
                        .replace("-", "")
                        .substring(0, 12)
                        .toUpperCase();

        // 9. Create booking
        // Pricing will be implemented separately.
        // For now the database requires a non-null amount.
        BigDecimal totalAmount = BigDecimal.ZERO;

        Booking booking = new Booking(
                user,
                trainRun,
                bookingReference,
                trainRun.getRunDate(),
                sourceStation,
                destinationStation,
                totalAmount
        );

        Booking savedBooking = bookingRepository.save(booking);

        // 10. Create passengers
        for (BookingPassengerRequest passengerRequest : request.passengers()) {

            BookingPassenger passenger = new BookingPassenger(
                    savedBooking,
                    passengerRequest.name(),
                    passengerRequest.age(),
                    passengerRequest.gender(),
                    passengerRequest.berthPreference(),
                    passengerRequest.concessionType()
            );

            bookingPassengerRepository.save(passenger);
        }

        // 11. Create seat allocations and confirm inventory
        List<String> lockKeys = new ArrayList<>();
        List<String> lockTokens = new ArrayList<>();

        try {

            // Acquire locks for all seats first
            for (SeatInventory inventory : inventories) {

                Long seatId = inventory.getSeat().getId();

                String lockKey =
                        "seat-lock:"
                                + request.trainRunId()
                                + ":"
                                + seatId;

                String lockToken =
                        distributedLockService.tryLock(
                                lockKey,
                                Duration.ofSeconds(10)
                        );

                if (lockToken == null) {
                    throw new SeatNotAvailableException(
                            "Seat is currently being processed"
                    );
                }

                lockKeys.add(lockKey);
                lockTokens.add(lockToken);
            }

            // All locks acquired — now modify the seats
            List<Long> allocatedSeatIds = new ArrayList<>();

            for (SeatInventory inventory : inventories) {

                var seat = inventory.getSeat();

                // Re-check state after acquiring the lock
                if (inventory.getStatus() != SeatStatus.HELD) {
                    throw new SeatNotAvailableException(
                            "Seat is no longer held"
                    );
                }

                if (inventory.getHeldUntil() == null
                        || !inventory.getHeldUntil().isAfter(now)) {

                    throw new IllegalStateException(
                            "Seat hold has expired"
                    );
                }

                if (inventory.getHeldByUser() == null
                        || !inventory.getHeldByUser().getId().equals(user.getId())) {

                    throw new IllegalStateException(
                            "Seat is held by another user"
                    );
                }

                SeatAllocation allocation = new SeatAllocation(
                        savedBooking,
                        seat,
                        seat.getSeatNumber(),
                        seat.getCoach().getId(),
                        seat.getBerthType(),
                        "CONFIRMED"
                );

                seatAllocationRepository.save(allocation);

                inventory.confirmBooking(user, now);

                allocatedSeatIds.add(seat.getId());
            }

            // Confirm booking
            savedBooking.confirm();

            bookingRepository.save(savedBooking);

            /*
            * Release Redis locks only after the database transaction
            * has completed.
            */
            TransactionSynchronizationManager.registerSynchronization(
                    new TransactionSynchronization() {

                        @Override
                        public void afterCompletion(int status) {

                            for (int i = lockKeys.size() - 1; i >= 0; i--) {

                                distributedLockService.unlock(
                                        lockKeys.get(i),
                                        lockTokens.get(i)
                                );
                            }
                        }
                    }
            );

            return toBookingResponse(
                    savedBooking,
                    allocatedSeatIds
            );

        } catch (RuntimeException e) {

            /*
            * If lock acquisition or processing fails before the
            * transaction completes, release every lock acquired so far.
            */
            for (int i = lockKeys.size() - 1; i >= 0; i--) {

                distributedLockService.unlock(
                        lockKeys.get(i),
                        lockTokens.get(i)
                );
            }

            throw e;
        }
    }

    @Transactional(readOnly = true)
    public BookingResponse getBooking(String bookingReference) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Booking booking = bookingRepository
                .findByBookingReference(bookingReference)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Booking not found"));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new ForbiddenOperationException(
                    "You are not authorized to access this booking"
            );
        }

        List<SeatAllocation> allocations =
                seatAllocationRepository.findByBookingId(
                        booking.getId()
                );

        List<Long> seatIds = allocations.stream()
                .map(allocation -> allocation.getSeat().getId())
                .toList();

        return toBookingResponse(
                booking,
                seatIds
        );
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        List<Booking> bookings =
                bookingRepository.findByUserIdOrderByCreatedAtDesc(
                        user.getId()
                );

        return bookings.stream()
                .map(booking -> {

                    List<Long> seatIds =
                            seatAllocationRepository
                                    .findByBookingId(booking.getId())
                                    .stream()
                                    .map(allocation ->
                                            allocation.getSeat().getId()
                                    )
                                    .toList();

                    return toBookingResponse(
                            booking,
                            seatIds
                    );
                })
                .toList();
    }

    @Transactional
    public BookingResponse cancelBooking(String bookingReference) {

        // 1. Get authenticated user
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        // 2. Find booking
        Booking booking =
                bookingRepository.findByBookingReference(bookingReference)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Booking not found"));

        // 3. Verify ownership
        if (!booking.getUser().getId().equals(user.getId())) {
            throw new ForbiddenOperationException(
                    "You are not authorized to cancel this booking"
            );
        }

        // 4. Booking must be confirmed
        if (booking.getStatus() != com.railway.tatkal.booking.entity.BookingStatus.CONFIRMED) {
            throw new IllegalStateException(
                    "Only confirmed bookings can be cancelled"
            );
        }

        // 5. Find seat allocations
        List<SeatAllocation> allocations =
                seatAllocationRepository.findByBookingId(
                        booking.getId()
                );

        // 6. Release every booked seat
        List<Long> seatIds = new ArrayList<>();

        for (SeatAllocation allocation : allocations) {

            SeatInventory inventory =
                    seatInventoryRepository
                            .findByTrainRunIdAndSeatId(
                                    booking.getTrainRun().getId(),
                                    allocation.getSeat().getId()
                            )
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Seat inventory not found"
                                    )
                            );

            if (inventory.getStatus() != SeatStatus.BOOKED) {
                throw new IllegalStateException(
                        "Seat is not currently booked"
                );
            }

            // BOOKED → AVAILABLE
            inventory.releaseFromBooking();

            // Allocation → CANCELLED
            allocation.cancel();

            seatIds.add(allocation.getSeat().getId());
        }

        // 7. Cancel booking
        booking.cancel();

        // 8. Save changes
        bookingRepository.save(booking);
        seatAllocationRepository.saveAll(allocations);

        return toBookingResponse(
                booking,
                seatIds
        );
    }

    private void validateRequest(CreateBookingRequest request) {

        if (request.trainRunId() == null) {
            throw new IllegalArgumentException("Train run is required");
        }

        if (request.sourceStationId() == null) {
            throw new IllegalArgumentException("Source station is required");
        }

        if (request.destinationStationId() == null) {
            throw new IllegalArgumentException(
                    "Destination station is required"
            );
        }

        if (request.seatIds() == null || request.seatIds().isEmpty()) {
            throw new IllegalArgumentException(
                    "At least one seat is required"
            );
        }

        if (request.passengers() == null || request.passengers().isEmpty()) {
            throw new IllegalArgumentException(
                    "At least one passenger is required"
            );
        }

        if (request.seatIds().size() != request.passengers().size()) {
            throw new IllegalArgumentException(
                    "Number of seats must match number of passengers"
            );
        }

        Set<Long> uniqueSeatIds = new HashSet<>(request.seatIds());

        if (uniqueSeatIds.size() != request.seatIds().size()) {
            throw new IllegalArgumentException(
                    "Duplicate seat IDs are not allowed"
            );
        }
    }

    private BookingResponse toBookingResponse(
            Booking booking,
            List<Long> seatIds
    ) {
        List<BookingResponse.BookingPassengerResponse> passengers =
                bookingPassengerRepository.findByBookingId(booking.getId())
                        .stream()
                        .map(passenger -> new BookingResponse.BookingPassengerResponse(
                                passenger.getName(),
                                passenger.getAge(),
                                passenger.getGender(),
                                passenger.getBerthPreference(),
                                passenger.getConcessionType()
                        ))
                        .toList();

        List<BookingResponse.SeatAllocationResponse> seatAllocations =
                seatAllocationRepository.findByBookingId(booking.getId())
                        .stream()
                        .map(allocation -> new BookingResponse.SeatAllocationResponse(
                                allocation.getSeat().getId(),
                                allocation.getSeat().getCoach().getCoachCode(),
                                allocation.getSeatNumber(),
                                allocation.getBerthType(),
                                allocation.getStatus()
                        ))
                        .toList();

        return new BookingResponse(
                booking.getId(),
                booking.getBookingReference(),
                booking.getTrainRun().getId(),
                booking.getJourneyDate(),
                booking.getSourceStation().getId(),
                booking.getDestinationStation().getId(),
                booking.getStatus(),
                booking.getTotalAmount(),
                seatIds,
                booking.getTrainRun().getTrain().getTrainNumber(),
                booking.getTrainRun().getTrain().getTrainName(),
                booking.getTrainRun().getTrain().getTrainType(),
                booking.getSourceStation().getCode(),
                booking.getSourceStation().getName(),
                booking.getDestinationStation().getCode(),
                booking.getDestinationStation().getName(),
                booking.getCreatedAt(),
                booking.getUpdatedAt(),
                passengers,
                seatAllocations
        );
    }
}
