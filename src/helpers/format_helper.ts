/**
 * Format Helper Functions
 * Collection of utility functions for date, time, and general formatting
 */

/**
 * Format date to locale string
 * @param date - Date to format
 * @param locale - Locale code (default: 'id-ID')
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 * @example formatDate(new Date()) // "12 November 2025"
 */
export function formatDate(
  date: Date | string | number,
  locale: string = 'id-ID',
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj =
    typeof date === 'string' || typeof date === 'number'
      ? new Date(date)
      : date;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options
  };

  return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
}

/**
 * Format date to short format
 * @param date - Date to format
 * @param locale - Locale code (default: 'id-ID')
 * @returns Formatted date string
 * @example formatDateShort(new Date()) // "12/11/2025"
 */
export function formatDateShort(
  date: Date | string | number,
  locale: string = 'id-ID'
): string {
  return formatDate(date, locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Format time
 * @param date - Date to format
 * @param locale - Locale code (default: 'id-ID')
 * @param includeSeconds - Include seconds (default: false)
 * @returns Formatted time string
 * @example formatTime(new Date()) // "14:30"
 */
export function formatTime(
  date: Date | string | number,
  locale: string = 'id-ID',
  includeSeconds: boolean = false
): string {
  const dateObj =
    typeof date === 'string' || typeof date === 'number'
      ? new Date(date)
      : date;

  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...(includeSeconds && {second: '2-digit'})
  };

  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Format date and time
 * @param date - Date to format
 * @param locale - Locale code (default: 'id-ID')
 * @returns Formatted datetime string
 * @example formatDateTime(new Date()) // "12 November 2025, 14:30"
 */
export function formatDateTime(
  date: Date | string | number,
  locale: string = 'id-ID'
): string {
  const dateObj =
    typeof date === 'string' || typeof date === 'number'
      ? new Date(date)
      : date;

  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
}

/**
 * Format relative time (e.g., "2 hours ago")
 * @param date - Date to format
 * @param locale - Locale code (default: 'id-ID')
 * @returns Relative time string
 * @example formatRelativeTime(new Date(Date.now() - 3600000)) // "1 jam yang lalu"
 */
export function formatRelativeTime(
  date: Date | string | number,
  locale: string = 'id-ID'
): string {
  const dateObj =
    typeof date === 'string' || typeof date === 'number'
      ? new Date(date)
      : date;

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const intervals: {[key: string]: number} = {
    tahun: 31536000,
    bulan: 2592000,
    minggu: 604800,
    hari: 86400,
    jam: 3600,
    menit: 60,
    detik: 1
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / secondsInUnit);

    if (interval >= 1) {
      return `${interval} ${unit} yang lalu`;
    }
  }

  return 'baru saja';
}

/**
 * Format phone number (Indonesian format)
 * @param phone - Phone number to format
 * @param withCountryCode - Include country code (default: false)
 * @returns Formatted phone number
 * @example formatPhone("08123456789") // "0812-3456-789"
 * @example formatPhone("08123456789", true) // "+62 812-3456-789"
 */
export function formatPhone(
  phone: string,
  withCountryCode: boolean = false
): string {
  // Remove non-numeric characters
  const cleaned = phone.replace(/\D/g, '');

  // Handle country code
  let formatted = cleaned;
  if (withCountryCode) {
    if (cleaned.startsWith('0')) {
      formatted = '62' + cleaned.substring(1);
    } else if (!cleaned.startsWith('62')) {
      formatted = '62' + cleaned;
    }

    // Format: +62 812-3456-789
    return `+${formatted.substring(0, 2)} ${formatted.substring(2, 5)}-${formatted.substring(5, 9)}-${formatted.substring(9)}`;
  }

  // Format: 0812-3456-789
  return `${formatted.substring(0, 4)}-${formatted.substring(4, 8)}-${formatted.substring(8)}`;
}

/**
 * Format credit card number
 * @param cardNumber - Card number to format
 * @param separator - Separator character (default: ' ')
 * @returns Formatted card number
 * @example formatCardNumber("1234567890123456") // "1234 5678 9012 3456"
 */
export function formatCardNumber(
  cardNumber: string,
  separator: string = ' '
): string {
  const cleaned = cardNumber.replace(/\D/g, '');
  return cleaned.match(/.{1,4}/g)?.join(separator) || cleaned;
}

/**
 * Format NIK (Indonesian ID Number)
 * @param nik - NIK to format
 * @returns Formatted NIK
 * @example formatNIK("1234567890123456") // "1234-5678-9012-3456"
 */
export function formatNIK(nik: string): string {
  const cleaned = nik.replace(/\D/g, '');
  return `${cleaned.substring(0, 4)}-${cleaned.substring(4, 8)}-${cleaned.substring(8, 12)}-${cleaned.substring(12)}`;
}

/**
 * Format duration from seconds
 * @param seconds - Duration in seconds
 * @param format - Format type ('short' | 'long')
 * @returns Formatted duration
 * @example formatDuration(3665) // "1:01:05"
 * @example formatDuration(3665, 'long') // "1 jam 1 menit 5 detik"
 */
export function formatDuration(
  seconds: number,
  format: 'short' | 'long' = 'short'
): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (format === 'long') {
    const parts = [];
    if (hours > 0) parts.push(`${hours} jam`);
    if (minutes > 0) parts.push(`${minutes} menit`);
    if (secs > 0) parts.push(`${secs} detik`);
    return parts.join(' ') || '0 detik';
  }

  // Short format: HH:MM:SS or MM:SS
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format address (multi-line)
 * @param address - Address object
 * @returns Formatted address string
 */
export function formatAddress(address: {
  street?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
}): string {
  const parts = [
    address.street,
    address.city,
    address.province,
    address.postalCode,
    address.country
  ].filter(Boolean);

  return parts.join(', ');
}

/**
 * Format boolean to readable text
 * @param value - Boolean value
 * @param trueText - Text for true (default: 'Ya')
 * @param falseText - Text for false (default: 'Tidak')
 * @returns Formatted boolean text
 */
export function formatBoolean(
  value: boolean,
  trueText: string = 'Ya',
  falseText: string = 'Tidak'
): string {
  return value ? trueText : falseText;
}

/**
 * Format array to comma-separated string
 * @param arr - Array to format
 * @param separator - Separator (default: ', ')
 * @param lastSeparator - Last separator (default: ' dan ')
 * @returns Formatted string
 * @example formatList(['A', 'B', 'C']) // "A, B dan C"
 */
export function formatList(
  arr: string[],
  separator: string = ', ',
  lastSeparator: string = ' dan '
): string {
  if (arr.length === 0) return '';
  if (arr.length === 1) return arr[0];

  const allButLast = arr.slice(0, -1);
  const last = arr[arr.length - 1];

  return allButLast.join(separator) + lastSeparator + last;
}

/**
 * Format JSON with pretty print
 * @param obj - Object to format
 * @param indent - Indentation spaces (default: 2)
 * @returns Formatted JSON string
 */
export function formatJSON(obj: any, indent: number = 2): string {
  return JSON.stringify(obj, null, indent);
}

/**
 * Parse date string safely
 * @param dateString - Date string to parse
 * @param fallback - Fallback date if parsing fails
 * @returns Date object
 */
export function parseDate(
  dateString: string,
  fallback?: Date
): Date | undefined {
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? fallback : date;
  } catch {
    return fallback;
  }
}
