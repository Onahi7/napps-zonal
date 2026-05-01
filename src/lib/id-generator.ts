import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a unique school ID in format: NC-XXXXXXXX
 * Where X is alphanumeric (uppercase)
 */
export function generateSchoolId(): string {
  // Create a UUID and take first 8 chars, convert to uppercase
  const uuid = uuidv4().replace(/-/g, '');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'NC-';
  
  // Use UUID as seed to pick characters
  for (let i = 0; i < 8; i++) {
    const index = parseInt(uuid.charAt(i), 16) % chars.length;
    result += chars.charAt(index);
  }
  
  return result;
}

/**
 * Validate school ID format
 */
export function isValidSchoolId(id: string): boolean {
  return /^NC-[A-Z0-9]{8}$/.test(id);
}

/**
 * Generate a unique receipt number
 */
export function generateReceiptNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RCP-${timestamp}-${random}`;
}

/**
 * Generate a unique payment reference
 */
export function generatePaymentReference(): string {
  const prefix = 'NAPPS';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}
