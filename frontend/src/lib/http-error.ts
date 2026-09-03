import axios from "axios";
import type { ApiErrorResponse } from "@/types/api";

export interface AppError {
  status?: number;
  code?: string;
  message: string;
  fieldErrors?: Record<string, string>;
}

export function toAppError(error: unknown): AppError {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const status = error.response?.status;
    const payload = error.response?.data;

    if (payload?.message) {
      return {
        status,
        code: payload.code,
        message: payload.message,
        fieldErrors: payload.fieldErrors ?? undefined,
      };
    }

    if (status === 401) {
      return {
        status,
        code: "UNAUTHORIZED",
        message: "Your session has expired. Please sign in again.",
      };
    }

    if (status === 403) {
      return {
        status,
        code: "FORBIDDEN",
        message: "You do not have permission to perform this action.",
      };
    }

    if (status === 404) {
      return {
        status,
        code: "NOT_FOUND",
        message: "The requested resource could not be found.",
      };
    }

    if (status === 409) {
      return {
        status,
        code: "CONFLICT",
        message: "This action conflicts with the latest seat state. Refresh and try again.",
      };
    }

    if (error.code === "ECONNABORTED") {
      return {
        code: "TIMEOUT",
        message: "The server took too long to respond. Please try again.",
      };
    }

    return {
      status,
      code: "REQUEST_FAILED",
      message: "We could not complete your request right now.",
    };
  }

  return {
    code: "UNKNOWN",
    message: "Something unexpected happened.",
  };
}
