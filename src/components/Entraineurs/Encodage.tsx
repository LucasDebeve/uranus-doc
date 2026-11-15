import React, {type ReactNode} from 'react';
import Entraineur, {AnswerField, Choices, trainerStyles as s} from './core/Entraineur';
import {pick, randInt, shuffle} from './core/utils';
import {
  ENCODINGS,
  chars,
  decodeLatin1,
  decodeUtf8,
  encodeChar,
  encodeText,
  hex,
  unicodeLabel,
  type EncodingId,
} from './core/encodage';

type Mode = 'ascii' | 'taille' | 'octets' | 'mojibake';

type Props = {
  modes?: Mode[];
  title?: string;
};

const WORDS = ['NSI', 'Python', 'été', 'café', 'Noël', 'élève', 'ça va', 'naïve', 'œuf', '10 €', 'très', 'Ω', 'π = 3,14', 'août', 'olé 😀'];

type Q =
  | {mode: 'ascii'; c: string; direction: 'versCode' | 'versCaractere'}
  | {mode: 'taille'; word: string; enc: EncodingId; options: {value: string; label: string}[]; correct: string}
  | {mode: 'octets'; word: string}
  | {
      mode: 'mojibake';
      word: string;
      saved: 'utf8' | 'latin1';
      shown: string;
      options: {value: string; label: string}[];
    };

const encLabel = (id: EncodingId) => ENCODINGS.find((e) => e.id === id)!.short;

/** Tableau caractère par caractère : point de code Unicode et octets dans chaque encodage. */
function CharTable({word, encodings = ['ascii', 'latin1', 'utf8']}: {word: string; encodings?: EncodingId[]}) {
  return (
    <table className={s.table}>
      <thead>
        <tr>
          <th scope="col">Caractère</th>
          <th scope="col">Unicode</th>
          {encodings.map((e) => (
            <th key={e} scope="col">
              {encLabel(e)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {chars(word).map((c, i) => (
          <tr key={i}>
            <td>{c === ' ' ? '(espace)' : c}</td>
            <td>{unicodeLabel(c)}</td>
            {encodings.map((e) => {
              const b = encodeChar(c, e);
              return <td key={e}>{b ? hex(b) : '—'}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function asciiQuestion(): Q {
  const c = pick([
    String.fromCharCode(randInt(65, 90)),
    String.fromCharCode(randInt(97, 122)),
    String.fromCharCode(randInt(48, 57)),
  ]);
  return {mode: 'ascii', c, direction: pick(['versCode', 'versCaractere'] as const)};
}

function tailleQuestion(): Q {
  const word = pick(WORDS);
  const enc = pick<EncodingId>(['ascii', 'latin1', 'utf8', 'utf8']);
  const bytes = encodeText(word, enc);
  const correct = bytes ? String(bytes.length) : 'impossible';
  const n = chars(word).length;
  const utf8 = encodeText(word, 'utf8')!.length;
  const candidates = [...new Set([correct, String(n), String(utf8), String(n * 2), 'impossible'])].slice(0, 4);
  if (!candidates.includes(correct)) candidates[0] = correct;
  const options = shuffle(candidates).map((v) => ({
    value: v,
    label: v === 'impossible' ? 'Impossible' : `${v} octet${v === '1' ? '' : 's'}`,
  }));
  return {mode: 'taille', word, enc, options, correct};
}

function mojibakeQuestion(): Q {
  const word = pick(['café', 'été', 'élève', 'Noël', 'très', 'août', 'naïve']);
  const saved = pick(['utf8', 'latin1'] as const);
  const shown = saved === 'utf8' ? decodeLatin1(encodeText(word, 'utf8')!) : decodeUtf8(encodeText(word, 'latin1')!);
  const wrongs = [
    word,
    decodeLatin1(encodeText(word, 'utf8')!) === shown ? decodeUtf8(encodeText(word, 'latin1')!) : decodeLatin1(encodeText(word, 'utf8')!),
    word.normalize('NFD').replace(/[̀-ͯ]/g, ''),
  ];
  const options = shuffle([...new Set([shown, ...wrongs])]).map((v) => ({value: v, label: v}));
  return {mode: 'mojibake', word, saved, shown, options};
}

function generate(modes: Mode[]): Q {
  const mode = pick(modes);
  if (mode === 'ascii') return asciiQuestion();
  if (mode === 'taille') return tailleQuestion();
  if (mode === 'octets') return {mode, word: pick(['Aé', 'été', 'ça', 'Noël', '€', 'Oui', 'à 2', 'Ω'])};
  return mojibakeQuestion();
}

const normalizeHex = (a: string) =>
  a
    .toUpperCase()
    .replace(/0X/g, '')
    .replace(/[^0-9A-F]/g, '')
    .replace(/(..)(?=.)/g, '$1 ');

export default function Encodage({modes = ['ascii', 'taille', 'octets', 'mojibake'], title = 'Encodage du texte'}: Props): ReactNode {
  return (
    <Entraineur<Q, string>
      title={title}
      generate={() => generate(modes)}
      emptyAnswer=""
      hideCheckButton={(q) => q.mode === 'taille' || q.mode === 'mojibake'}
      check={(q, a) => {
        if (q.mode === 'ascii') {
          const code = q.c.charCodeAt(0);
          const ok = q.direction === 'versCode' ? Number.parseInt(a.trim(), 10) === code : a.trim() === q.c;
          return {
            ok,
            expected: q.direction === 'versCode' ? String(code) : `« ${q.c} »`,
            correction: (
              <p>
                En ASCII, les caractères d’une même famille se suivent : « A » = 65 … « Z » = 90, « a » = 97 … « z » = 122,
                « 0 » = 48 … « 9 » = 57. Ici « {q.c} » = {code} (en hexadécimal {code.toString(16).toUpperCase()}, en binaire{' '}
                {code.toString(2).padStart(7, '0')} : 7 bits suffisent).
              </p>
            ),
          };
        }
        if (q.mode === 'taille') {
          const missing = chars(q.word).filter((c) => encodeChar(c, q.enc) === null);
          return {
            ok: a === q.correct,
            expected: q.correct === 'impossible' ? 'impossible' : `${q.correct} octets`,
            correction: (
              <>
                <CharTable word={q.word} />
                <p>
                  {missing.length > 0
                    ? `« ${[...new Set(missing)].join(' ')} » n’existe pas en ${encLabel(q.enc)} : ce texte ne peut pas y être encodé.`
                    : q.enc === 'utf8'
                      ? 'En UTF-8, les caractères ASCII prennent 1 octet, les lettres accentuées 2, des symboles comme € 3, et les emojis 4.'
                      : `En ${encLabel(q.enc)}, chaque caractère occupe exactement 1 octet.`}
                </p>
              </>
            ),
          };
        }
        if (q.mode === 'octets') {
          const expected = hex(encodeText(q.word, 'utf8')!);
          return {
            ok: normalizeHex(a) === expected,
            expected: <code>{expected}</code>,
            correction: (
              <>
                <CharTable word={q.word} encodings={['utf8']} />
                <p className={s.hint}>
                  Les caractères ASCII gardent leur code sur 1 octet ; les autres sont codés sur 2 à 4 octets, le premier commençant
                  par 110, 1110 ou 11110 en binaire.
                </p>
              </>
            ),
          };
        }
        return {
          ok: a === q.shown,
          expected: <code>{q.shown}</code>,
          correction: (
            <>
              <p>
                {q.saved === 'utf8'
                  ? 'En UTF-8, chaque lettre accentuée occupe 2 octets. Lus en ISO-8859-1, ces 2 octets deviennent 2 caractères distincts (souvent « Ã » suivi d’un autre symbole).'
                  : 'En ISO-8859-1, la lettre accentuée tient sur 1 octet. Cet octet seul n’est pas une suite UTF-8 valide : le logiciel affiche le caractère de remplacement « � ».'}
              </p>
              <CharTable word={q.word} encodings={['latin1', 'utf8']} />
            </>
          ),
        };
      }}
      render={(q, {answer, setAnswer, submit, locked, verdict, inputId}) => {
        if (q.mode === 'ascii') {
          return (
            <>
              <p className={s.prompt}>
                {q.direction === 'versCode' ? (
                  <>Quel est le code ASCII (en décimal) du caractère « {q.c} » ?</>
                ) : (
                  <>Quel caractère a pour code ASCII {q.c.charCodeAt(0)} ?</>
                )}
              </p>
              <p className={s.hint}>Repères : « A » = 65, « a » = 97, « 0 » = 48.</p>
              <AnswerField
                id={inputId}
                label={q.direction === 'versCode' ? 'Code' : 'Caractère'}
                value={answer}
                onChange={setAnswer}
                locked={locked}
                verdict={verdict}
                inputMode={q.direction === 'versCode' ? 'numeric' : 'text'}
                width="6ch"
              />
            </>
          );
        }
        if (q.mode === 'taille') {
          return (
            <>
              <p className={s.prompt}>
                Combien d’octets occupe le texte « {q.word} » encodé en <strong>{encLabel(q.enc)}</strong> ?
              </p>
              <Choices options={q.options} answer={answer} locked={locked} verdict={verdict} correct={q.correct} onPick={(v) => submit(v)} />
            </>
          );
        }
        if (q.mode === 'octets') {
          return (
            <>
              <p className={s.prompt}>
                Écris en hexadécimal les octets du texte « {q.word} » encodé en <strong>UTF-8</strong>.
              </p>
              <p className={s.hint}>Aide : « é » est le caractère U+00E9 ; en UTF-8 il s’écrit C3 A9.</p>
              <AnswerField
                id={inputId}
                label="Octets"
                value={answer}
                onChange={setAnswer}
                locked={locked}
                verdict={verdict}
                placeholder="41 C3 A9"
                width="18ch"
              />
            </>
          );
        }
        return (
          <>
            <p className={s.prompt}>
              Un fichier contenant le mot « {q.word} » a été enregistré en <strong>{q.saved === 'utf8' ? 'UTF-8' : 'ISO-8859-1'}</strong>,
              puis ouvert par un logiciel qui le lit comme du <strong>{q.saved === 'utf8' ? 'ISO-8859-1' : 'UTF-8'}</strong>. Que
              s’affiche-t-il ?
            </p>
            <Choices mono options={q.options} answer={answer} locked={locked} verdict={verdict} correct={q.shown} onPick={(v) => submit(v)} />
          </>
        );
      }}
    />
  );
}
