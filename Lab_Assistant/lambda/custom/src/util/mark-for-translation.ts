/**
 * A pass-through function which marks the string as translatable
 * for the i18n scanner.  This function does *not* perform
 * any translation, it causes the string to be included in the
 * language file.
 * @param text The text to mark for translation
 */
export const mft = (text: string): string => {
  return text;
};
