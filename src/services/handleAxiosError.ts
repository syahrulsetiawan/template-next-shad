// src/utils/handleAxiosError.ts
import {AxiosError} from 'axios';
import {toast} from 'sonner';
import {useLocale, useTranslations} from 'next-intl';
/**
 * Handles and logs Axios errors in a standardized way.
 * @param error - The error caught from a try-catch block.
 * @param actionName - A string to describe the action being performed (e.g., "Login", "Registration").
 */
export const handleAxiosError = (error: unknown, actionName: string): void => {
  const t = useTranslations('errorResponse');
  console.log(error);
  if (error instanceof AxiosError) {
    toast.error(t(error.response?.data?.reason + '.title'));
  }
};
