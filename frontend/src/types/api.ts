export interface ApiErrorResponse {
  code?: string;
  message?: string;
  fieldErrors?: Record<string, string> | null;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface RegisterResponse {
  userId: number;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: number;
  accessToken: string;
  tokenType: string;
}

export interface TrainSearchRequest {
  from: string;
  to: string;
  date: string;
}

export interface TrainSearchResponse {
  trainRunId: number;
  trainId: number;
  trainNumber: string;
  trainName: string;
  trainType: string;
  sourceStationId: number;
  sourceStation: string;
  sourceStationName: string;
  sourceCity: string;
  destinationStationId: number;
  destinationStation: string;
  destinationStationName: string;
  destinationCity: string;
  runDate: string;
  departureTime: string;
  arrivalTime: string;
}

export type SeatStatus = "AVAILABLE" | "HELD" | "BOOKED";

export interface SeatInventoryResponse {
  inventoryId: number;
  seatId: number;
  coachCode: string;
  seatNumber: string;
  berthType: string;
  classType: string;
  status: SeatStatus;
  heldUntil: string | null;
}

export interface BookingPassengerRequest {
  name: string;
  age: number;
  gender: string;
  berthPreference: string | null;
  concessionType: string | null;
}

export interface CreateBookingRequest {
  trainRunId: number;
  sourceStationId: number;
  destinationStationId: number;
  seatIds: number[];
  passengers: BookingPassengerRequest[];
}

export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "EXPIRED";

export interface BookingPassengerResponse {
  name: string;
  age: number;
  gender: string;
  berthPreference: string | null;
  concessionType: string | null;
}

export interface SeatAllocationResponse {
  seatId: number;
  coachCode: string;
  seatNumber: string;
  berthType: string;
  status: string;
}

export interface BookingResponse {
  bookingId: number;
  bookingReference: string;
  trainRunId: number;
  journeyDate: string;
  sourceStationId: number;
  destinationStationId: number;
  status: BookingStatus;
  totalAmount: number;
  seatIds: number[];
  trainNumber: string | null;
  trainName: string | null;
  trainType: string | null;
  sourceStationCode: string | null;
  sourceStationName: string | null;
  destinationStationCode: string | null;
  destinationStationName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  passengers: BookingPassengerResponse[] | null;
  seatAllocations: SeatAllocationResponse[] | null;
}

export interface UserProfileResponse {
  userId: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
}
