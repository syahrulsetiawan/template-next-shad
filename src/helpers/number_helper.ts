/**
 * Number Helper Functions
 * Collection of utility functions for number formatting and manipulation
 */

/**
 * Format number to currency (IDR by default)
 * @param value - The number to format
 * @param currency - Currency code (default: 'IDR')
 * @param locale - Locale for formatting (default: 'id-ID')
 * @returns Formatted currency string
 * @example formatCurrency(1000000) // "Rp 1.000.000"
 */
export function formatCurrency(
  value: number,
  currency: string = 'IDR',
  locale: string = 'id-ID'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * Format number with thousand separator
 * @param value - The number to format
 * @param locale - Locale for formatting (default: 'id-ID')
 * @returns Formatted number string
 * @example formatNumber(1000000) // "1.000.000"
 */
export function formatNumber(value: number, locale: string = 'id-ID'): string {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Format number to percentage
 * @param value - The number to format (0-1 or 0-100)
 * @param decimals - Number of decimal places (default: 2)
 * @param isDecimal - Whether value is in decimal format (0-1) or percentage (0-100)
 * @returns Formatted percentage string
 * @example formatPercentage(0.1567) // "15.67%"
 * @example formatPercentage(15.67, 2, false) // "15.67%"
 */
export function formatPercentage(
  value: number,
  decimals: number = 2,
  isDecimal: boolean = true
): string {
  const percentage = isDecimal ? value * 100 : value;
  return `${percentage.toFixed(decimals)}%`;
}

/**
 * Format number to compact notation (K, M, B, T)
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Compact number string
 * @example formatCompactNumber(1500) // "1.5K"
 * @example formatCompactNumber(1000000) // "1M"
 */
export function formatCompactNumber(
  value: number,
  decimals: number = 1
): string {
  const suffixes = ['', 'K', 'M', 'B', 'T'];
  const tier = (Math.log10(Math.abs(value)) / 3) | 0;

  if (tier === 0) return value.toString();

  const suffix = suffixes[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = value / scale;

  return scaled.toFixed(decimals) + suffix;
}

/**
 * Round number to specified decimal places
 * @param value - The number to round
 * @param decimals - Number of decimal places (default: 2)
 * @returns Rounded number
 * @example roundNumber(1.2345, 2) // 1.23
 */
export function roundNumber(value: number, decimals: number = 2): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Clamp number between min and max
 * @param value - The number to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped number
 * @example clamp(150, 0, 100) // 100
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Check if number is in range
 * @param value - The number to check
 * @param min - Minimum value
 * @param max - Maximum value
 * @param inclusive - Whether range is inclusive (default: true)
 * @returns Boolean indicating if number is in range
 */
export function inRange(
  value: number,
  min: number,
  max: number,
  inclusive: boolean = true
): boolean {
  if (inclusive) {
    return value >= min && value <= max;
  }
  return value > min && value < max;
}

/**
 * Generate random number between min and max
 * @param min - Minimum value
 * @param max - Maximum value
 * @param decimals - Number of decimal places (default: 0 for integer)
 * @returns Random number
 */
export function randomNumber(
  min: number,
  max: number,
  decimals: number = 0
): number {
  const random = Math.random() * (max - min) + min;
  return decimals === 0 ? Math.floor(random) : roundNumber(random, decimals);
}

/**
 * Parse formatted number string to number
 * @param value - The formatted string to parse
 * @returns Parsed number
 * @example parseFormattedNumber("1.000.000") // 1000000
 * @example parseFormattedNumber("Rp 1.500.000") // 1500000
 */
export function parseFormattedNumber(value: string): number {
  // Remove non-numeric characters except dot and comma
  const cleaned = value.replace(/[^\d.,-]/g, '');
  // Replace comma with dot for decimal
  const normalized = cleaned.replace(',', '.');
  return parseFloat(normalized) || 0;
}

/**
 * Format file size in bytes to human readable format
 * @param bytes - File size in bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted file size
 * @example formatFileSize(1024) // "1 KB"
 * @example formatFileSize(1048576) // "1 MB"
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i]
  );
}
