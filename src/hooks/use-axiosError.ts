// src/hooks/useAxiosError.ts
import {AxiosError} from 'axios';
import {useState, useEffect} from 'react';

export interface FormattedError {
  message: string;
  statusCode: number | null;
}

export function useAxiosError(error: AxiosError | null): FormattedError | null {
  const [formattedError, setFormattedError] = useState<FormattedError | null>(
    null
  );

  useEffect(() => {
    if (!error) {
      setFormattedError(null);
      return;
    }

    if (error.response) {
      const statusCode = error.response.status;
      let message = `HTTP Error! Status: ${statusCode}`;

      // Contoh penanganan error spesifik
      if (statusCode === 400) {
        message = 'Bad Request. Please check your input.';
      } else if (statusCode === 401) {
        message = 'Unauthorized. Please log in again.';
      } else if (statusCode === 404) {
        message = 'The requested resource was not found.';
      } else if (statusCode === 500) {
        message = 'Internal Server Error. Please try again later.';
      }

      setFormattedError({message, statusCode});
    } else if (error.request) {
      setFormattedError({
        message: 'No response from server. Check your network connection.',
        statusCode: null
      });
    } else {
      setFormattedError({
        message: error.message,
        statusCode: null
      });
    }
  }, [error]);

  return formattedError;
}
