import { apiClient } from "@/api/client";
import type { SeatInventoryResponse } from "@/types/api";

export async function getSeatInventory(trainRunId: number): Promise<SeatInventoryResponse[]> {
  const { data } = await apiClient.get<SeatInventoryResponse[]>(
    `/train-runs/${trainRunId}/seats`,
  );
  return data;
}

export async function holdSeat(
  trainRunId: number,
  seatId: number,
): Promise<SeatInventoryResponse> {
  const { data } = await apiClient.post<SeatInventoryResponse>(
    `/train-runs/${trainRunId}/seats/${seatId}/hold`,
  );
  return data;
}
