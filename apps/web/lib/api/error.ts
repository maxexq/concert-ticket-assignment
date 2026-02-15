import { AxiosError } from "axios";

export interface ApiErrorResponse {
  message: string | string[];
  error?: string;
  statusCode?: number;
}

export interface ParsedError {
  message: string;
  statusCode: number;
  isNetworkError: boolean;
}

const ERROR_MESSAGES: Record<number, string> = {
  400: "Invalid request. Please check your input.",
  401: "You are not authenticated. Please log in.",
  403: "You do not have permission to perform this action.",
  404: "The requested resource was not found.",
  409: "This action conflicts with existing data.",
  422: "The provided data is invalid.",
  429: "Too many requests. Please try again later.",
  500: "An unexpected server error occurred.",
  502: "Server is temporarily unavailable.",
  503: "Service is currently unavailable.",
};

export function parseApiError(error: unknown): ParsedError {
  if (error instanceof AxiosError) {
    const response = error.response;

    if (!response) {
      return {
        message: "Network error. Please check your connection.",
        statusCode: 0,
        isNetworkError: true,
      };
    }

    const statusCode = response.status;
    const data = response.data as ApiErrorResponse | undefined;

    let message: string;

    if (data?.message) {
      message = Array.isArray(data.message)
        ? data.message.join(", ")
        : data.message;
    } else {
      message = ERROR_MESSAGES[statusCode] || "An unexpected error occurred.";
    }

    return {
      message,
      statusCode,
      isNetworkError: false,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      statusCode: 0,
      isNetworkError: false,
    };
  }

  return {
    message: "An unexpected error occurred.",
    statusCode: 0,
    isNetworkError: false,
  };
}

export class ApiError extends Error {
  statusCode: number;
  isNetworkError: boolean;

  constructor(parsed: ParsedError) {
    super(parsed.message);
    this.name = "ApiError";
    this.statusCode = parsed.statusCode;
    this.isNetworkError = parsed.isNetworkError;
  }
}
