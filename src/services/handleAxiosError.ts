// src/utils/handleAxiosError.ts
import {AxiosError} from 'axios';

/**
 * Handles and logs Axios errors in a standardized way.
 * @param error - The error caught from a try-catch block.
 * @param actionName - A string to describe the action being performed (e.g., "Login", "Registration").
 */
export const handleAxiosError = (error: unknown, actionName: string): void => {
  if (error instanceof AxiosError) {
    console.error(`${actionName} failed:`, error.response?.data);
  } else {
    // This handles non-Axios errors, e.g., network issues, etc.
    console.error(`An unknown error occurred during ${actionName}:`, error);
  }
};
