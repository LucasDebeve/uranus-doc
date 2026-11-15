/** Outils partagés par les entraîneurs. */

export const randInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

export const pick = <T,>(list: readonly T[]): T => list[Math.floor(Math.random() * list.length)];

export function shuffle<T>(list: readonly T[]): T[] {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Chiffres utilisés jusqu'à la base 36. */
export const DIGITS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** Écriture de n (entier positif) en base b, en majuscules. */
export const toBase = (n: number, b: number): string => n.toString(b).toUpperCase();

/**
 * Normalise une réponse d'élève : sans espaces, majuscules, sans zéros inutiles en tête
 * (« 0b », « 0x » et indices tolérés).
 */
export function normalizeNumber(raw: string): string {
  let s = raw.trim().toUpperCase().replace(/[\s_]/g, '');
  s = s.replace(/^0[BX](?=[0-9A-F])/, '');
  s = s.replace(/^0+(?=.)/, '');
  return s;
}

/** Bits nécessaires pour écrire n ≥ 0 en base 2 (au moins 1). */
export const bitsNeeded = (n: number): number => (n === 0 ? 1 : Math.floor(Math.log2(n)) + 1);

/** Regroupe une chaîne de bits par paquets de 4 depuis la droite (lecture plus facile). */
export function groupBits(bits: string, size = 4): string {
  const out: string[] = [];
  for (let end = bits.length; end > 0; end -= size) {
    out.unshift(bits.slice(Math.max(0, end - size), end));
  }
  return out.join(' ');
}
