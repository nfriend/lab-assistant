/**
 * Makes numbers (usually IDs) more speakable by pronouncing
 * IDs <= 100 normally (i.e. "eighty-eight") and any > 100
 * as separate digits (i.e. "one eight eight")
 * @param id The number to make speakable
 */
export const makeIdsSpeakable = (id: number): string => {
  return id <= 100 ? String(id) : `<say-as interpret-as="digits">${id}</say-as>`;
};
