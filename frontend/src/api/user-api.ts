import { apiClient } from "@/api/client";
import type { UserProfileResponse } from "@/types/api";

export async function getCurrentUser(): Promise<UserProfileResponse> {
  const { data } = await apiClient.get<UserProfileResponse>("/users/me");
  return data;
}
