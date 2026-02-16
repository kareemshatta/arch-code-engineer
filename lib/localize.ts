/**
 * Localization utility for getting the correct language content from database records
 * that have both English and Arabic fields (e.g., title and titleAr)
 */

type LocaleType = 'en' | 'ar';

/**
 * Gets the localized value of a field based on the current locale
 * @param record - The database record containing the fields
 * @param field - The base field name (e.g., 'title', 'description')
 * @param locale - The current locale ('en' or 'ar')
 * @param fallback - Optional fallback value if both fields are empty
 * @returns The localized field value
 */
export function getLocalizedField<T extends Record<string, unknown>>(
  record: T | null | undefined,
  field: string,
  locale: LocaleType,
  fallback: string = ''
): string {
  if (!record) return fallback;

  const arField = `${field}Ar` as keyof T;
  const enField = field as keyof T;

  if (locale === 'ar') {
    // For Arabic, prefer Arabic field, fallback to English
    return (record[arField] as string) || (record[enField] as string) || fallback;
  }

  // For English, use English field
  return (record[enField] as string) || fallback;
}

/**
 * Creates a localized version of a record with all *Ar fields resolved
 * @param record - The database record
 * @param locale - The current locale
 * @param fields - Array of field names to localize
 * @returns A new object with localized field values
 */
export function localizeRecord<T extends Record<string, unknown>>(
  record: T | null | undefined,
  locale: LocaleType,
  fields: string[]
): Record<string, unknown> | null {
  if (!record) return null;

  const localized: Record<string, unknown> = { ...record };

  for (const field of fields) {
    localized[field] = getLocalizedField(record, field, locale);
  }

  return localized;
}

/**
 * Localizes an array of records
 * @param records - Array of database records
 * @param locale - The current locale
 * @param fields - Array of field names to localize
 * @returns Array of localized records
 */
export function localizeRecords<T extends Record<string, unknown>>(
  records: T[],
  locale: LocaleType,
  fields: string[]
): Record<string, unknown>[] {
  return records.map((record) => localizeRecord(record, locale, fields)!);
}

