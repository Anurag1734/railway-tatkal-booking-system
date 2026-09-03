import { apiClient } from "@/api/client";
import type { BookingResponse, CreateBookingRequest } from "@/types/api";

export async function createBooking(request: CreateBookingRequest): Promise<BookingResponse> {
  const { data } = await apiClient.post<BookingResponse>("/bookings", request);
  return data;
}

export async function getMyBookings(): Promise<BookingResponse[]> {
  const { data } = await apiClient.get<BookingResponse[]>("/bookings/my");
  return data;
}

export async function getBooking(bookingReference: string): Promise<BookingResponse> {
  const { data } = await apiClient.get<BookingResponse>(`/bookings/${bookingReference}`);
  return data;
}

export async function cancelBooking(bookingReference: string): Promise<BookingResponse> {
  const { data } = await apiClient.post<BookingResponse>(
    `/bookings/${bookingReference}/cancel`,
  );
  return data;
}
