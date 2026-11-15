/** Encodages de texte, calculés à la main pour rester lisibles (et indépendants du navigateur). */

export type EncodingId = 'ascii' | 'latin1' | 'utf8' | 'utf16';

export const ENCODINGS: {id: EncodingId; label: string; short: string}[] = [
  {id: 'ascii', label: 'ASCII', short: 'ASCII'},
  {id: 'latin1', label: 'ISO-8859-1 (Latin-1)', short: 'ISO-8859-1'},
  {id: 'utf8', label: 'UTF-8', short: 'UTF-8'},
  {id: 'utf16', label: 'UTF-16 (big-endian)', short: 'UTF-16'},
];

/** Caractères du texte (un emoji compte pour un seul caractère). */
export const chars = (text: string): string[] => Array.from(text);

export const codePoint = (c: string): number => c.codePointAt(0) ?? 0;

export const unicodeLabel = (c: string): string => `U+${codePoint(c).toString(16).toUpperCase().padStart(4, '0')}`;

/** Octets d'un caractère dans un encodage, ou null s'il n'y est pas représentable. */
export function encodeChar(c: string, enc: EncodingId): number[] | null {
  const cp = codePoint(c);
  switch (enc) {
    case 'ascii':
      return cp < 128 ? [cp] : null;
    case 'latin1':
      return cp < 256 ? [cp] : null;
    case 'utf8':
      return Array.from(new TextEncoder().encode(c));
    case 'utf16': {
      const out: number[] = [];
      for (let i = 0; i < c.length; i++) {
        const u = c.charCodeAt(i);
        out.push(u >> 8, u & 0xff);
      }
      return out;
    }
  }
}

/** Octets du texte entier, ou null si un caractère n'est pas représentable. */
export function encodeText(text: string, enc: EncodingId): number[] | null {
  const out: number[] = [];
  for (const c of chars(text)) {
    const b = encodeChar(c, enc);
    if (!b) return null;
    out.push(...b);
  }
  return out;
}

/** Caractères impossibles à encoder. */
export const unencodable = (text: string, enc: EncodingId): string[] =>
  [...new Set(chars(text).filter((c) => encodeChar(c, enc) === null))];

/** Décodage strict Latin-1 : chaque octet est un caractère (U+0000 à U+00FF). */
export const decodeLatin1 = (bytes: number[]): string => String.fromCharCode(...bytes);

/** Décodage UTF-8 : les suites d'octets invalides deviennent « � ». */
export const decodeUtf8 = (bytes: number[]): string => new TextDecoder('utf-8').decode(new Uint8Array(bytes));

export const hex = (bytes: number[]): string => bytes.map((b) => b.toString(16).toUpperCase().padStart(2, '0')).join(' ');
