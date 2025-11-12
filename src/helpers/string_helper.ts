/**
 * String Helper Functions
 * Collection of utility functions for string manipulation and formatting
 */

/**
 * Capitalize first letter of string
 * @param str - The string to capitalize
 * @returns Capitalized string
 * @example capitalize("hello") // "Hello"
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Capitalize first letter of each word
 * @param str - The string to capitalize
 * @returns Title cased string
 * @example titleCase("hello world") // "Hello World"
 */
export function titleCase(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
}

/**
 * Convert string to camelCase
 * @param str - The string to convert
 * @returns camelCase string
 * @example toCamelCase("hello world") // "helloWorld"
 * @example toCamelCase("hello-world") // "helloWorld"
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    )
    .replace(/\s+|-|_/g, '');
}

/**
 * Convert string to snake_case
 * @param str - The string to convert
 * @returns snake_case string
 * @example toSnakeCase("helloWorld") // "hello_world"
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '')
    .replace(/\s+/g, '_');
}

/**
 * Convert string to kebab-case
 * @param str - The string to convert
 * @returns kebab-case string
 * @example toKebabCase("helloWorld") // "hello-world"
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
    .replace(/\s+/g, '-');
}

/**
 * Truncate string with ellipsis
 * @param str - The string to truncate
 * @param length - Maximum length
 * @param suffix - Suffix to add (default: '...')
 * @returns Truncated string
 * @example truncate("Hello World", 8) // "Hello..."
 */
export function truncate(
  str: string,
  length: number,
  suffix: string = '...'
): string {
  if (!str || str.length <= length) return str;
  return str.substring(0, length - suffix.length) + suffix;
}

/**
 * Truncate string in the middle with ellipsis
 * @param str - The string to truncate
 * @param maxLength - Maximum length
 * @param separator - Separator to use (default: '...')
 * @returns Truncated string
 * @example truncateMiddle("verylongfilename.txt", 15) // "verylo...me.txt"
 */
export function truncateMiddle(
  str: string,
  maxLength: number,
  separator: string = '...'
): string {
  if (!str || str.length <= maxLength) return str;

  const sepLen = separator.length;
  const charsToShow = maxLength - sepLen;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);

  return (
    str.substring(0, frontChars) +
    separator +
    str.substring(str.length - backChars)
  );
}

/**
 * Remove all whitespace from string
 * @param str - The string to process
 * @returns String without whitespace
 * @example removeWhitespace("hello world") // "helloworld"
 */
export function removeWhitespace(str: string): string {
  return str.replace(/\s+/g, '');
}

/**
 * Slugify string (URL friendly)
 * @param str - The string to slugify
 * @returns Slugified string
 * @example slugify("Hello World!") // "hello-world"
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Extract initials from name
 * @param name - Full name
 * @param maxInitials - Maximum number of initials (default: 2)
 * @returns Initials
 * @example getInitials("John Doe") // "JD"
 * @example getInitials("John Michael Doe", 3) // "JMD"
 */
export function getInitials(name: string, maxInitials: number = 2): string {
  if (!name) return '';

  return name
    .split(' ')
    .filter((word) => word.length > 0)
    .slice(0, maxInitials)
    .map((word) => word[0].toUpperCase())
    .join('');
}

/**
 * Mask string (useful for sensitive data)
 * @param str - The string to mask
 * @param visibleStart - Number of visible characters at start (default: 4)
 * @param visibleEnd - Number of visible characters at end (default: 4)
 * @param maskChar - Character to use for masking (default: '*')
 * @returns Masked string
 * @example maskString("1234567890", 4, 4) // "1234**7890"
 */
export function maskString(
  str: string,
  visibleStart: number = 4,
  visibleEnd: number = 4,
  maskChar: string = '*'
): string {
  if (!str || str.length <= visibleStart + visibleEnd) return str;

  const start = str.substring(0, visibleStart);
  const end = str.substring(str.length - visibleEnd);
  const maskLength = str.length - visibleStart - visibleEnd;

  return start + maskChar.repeat(maskLength) + end;
}

/**
 * Escape HTML special characters
 * @param str - The string to escape
 * @returns Escaped string
 */
export function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };

  return str.replace(/[&<>"'/]/g, (char) => htmlEscapes[char]);
}

/**
 * Check if string is empty or whitespace only
 * @param str - The string to check
 * @returns Boolean indicating if string is empty
 */
export function isEmpty(str: string | null | undefined): boolean {
  return !str || str.trim().length === 0;
}

/**
 * Count words in string
 * @param str - The string to count
 * @returns Number of words
 */
export function wordCount(str: string): number {
  if (!str) return 0;
  return str.trim().split(/\s+/).length;
}

/**
 * Reverse string
 * @param str - The string to reverse
 * @returns Reversed string
 */
export function reverse(str: string): string {
  return str.split('').reverse().join('');
}

/**
 * Check if string contains only numbers
 * @param str - The string to check
 * @returns Boolean indicating if string is numeric
 */
export function isNumeric(str: string): boolean {
  return /^\d+$/.test(str);
}

/**
 * Check if string is valid email
 * @param email - The email to validate
 * @returns Boolean indicating if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate random string
 * @param length - Length of string to generate
 * @param chars - Characters to use (default: alphanumeric)
 * @returns Random string
 */
export function randomString(
  length: number,
  chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Highlight search term in text
 * @param text - The text to search in
 * @param search - The search term
 * @param highlightClass - CSS class for highlighting (default: 'highlight')
 * @returns HTML string with highlighted terms
 */
export function highlightText(
  text: string,
  search: string,
  highlightClass: string = 'highlight'
): string {
  if (!search || !text) return text;

  const regex = new RegExp(`(${search})`, 'gi');
  return text.replace(regex, `<span class="${highlightClass}">$1</span>`);
}
