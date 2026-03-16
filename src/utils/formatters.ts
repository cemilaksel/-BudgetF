/**
 * Currency parsing and formatting utilities.
 * Adheres to SRP by isolating string manipulation logic.
 */

/**
 * Parses a currency string into a number.
 * Handles Turkish locale conventions (dot as thousands separator, comma as decimal).
 * Also handles standard numeric strings.
 */
export const parseCurrency = (value: string): number => {
  if (!value) return 0;

  // If the string contains both dot and comma
  // Example: 30.000,50 -> 30000.50
  if (value.includes('.') && value.includes(',')) {
    const cleanValue = value.replace(/\./g, '').replace(',', '.');
    return parseFloat(cleanValue) || 0;
  }

  // If it contains only a comma, treat it as a decimal separator
  // Example: 30,50 -> 30.50
  if (value.includes(',') && !value.includes('.')) {
    return parseFloat(value.replace(',', '.')) || 0;
  }

  // If it contains only a dot, we need to guess if it's a thousands separator or decimal.
  // In a financial context, if there are 3 digits after the dot, it's likely a thousands separator.
  // Example: 30.000 -> 30000
  // Example: 30.5 -> 30.5
  if (value.includes('.') && !value.includes(',')) {
    const parts = value.split('.');
    if (parts[parts.length - 1].length === 3) {
      return parseFloat(value.replace(/\./g, '')) || 0;
    }
    return parseFloat(value) || 0;
  }

  return parseFloat(value) || 0;
};

/**
 * Formats a number to Turkish Lira currency format.
 */
export const formatCurrency = (value: number): string => {
  return value.toLocaleString('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
