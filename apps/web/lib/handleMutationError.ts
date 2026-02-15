import { notify } from "./notify";
import { ApiError } from "./api/error";

export function handleMutationError(error: Error): void {
  if (error instanceof ApiError) {
    if (error.isNetworkError) {
      notify.error("Network error. Please check your connection.");
      return;
    }

    switch (error.statusCode) {
      case 403:
        notify.error("You don't have permission to perform this action.");
        break;
      case 404:
        notify.error(error.message);
        break;
      case 409:
        notify.error(error.message);
        break;
      case 400:
        notify.error(error.message);
        break;
      default:
        notify.error(error.message);
    }
  } else {
    notify.error(error.message || "An unexpected error occurred.");
  }
}
