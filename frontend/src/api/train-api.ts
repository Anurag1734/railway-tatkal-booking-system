import { apiClient } from "@/api/client";
import type { TrainSearchRequest, TrainSearchResponse } from "@/types/api";

export async function searchTrains(
  request: TrainSearchRequest,
): Promise<TrainSearchResponse[]> {
  const { data } = await apiClient.get<TrainSearchResponse[]>("/trains/search", {
    params: request,
  });
  return data;
}
