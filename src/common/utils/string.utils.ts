/**
 * Normalizes a string by removing diacritics (accents)
 * Example: "Việt Nam" -> "Viet Nam"
 */
export function normalizeString(str: string): string {
  return str ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '';
}
