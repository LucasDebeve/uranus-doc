import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Entraineur, {AnswerField, Choices, Num, trainerStyles as s} from './core/Entraineur';
import Tex from './core/Tex';
import {pick, randInt, shuffle} from './core/utils';

type Mode = 'coder' | 'decoder' | 'plage';

type Props = {
  /** Taille des mots pour coder / décoder. */
  bits?: number;
  modes?: Mode[];
  title?: string;
};

type Q =
  | {mode: 'coder'; x: number; n: number}
  | {mode: 'decoder'; word: string; n: number}
  | {mode: 'plage'; n: number; options: {value: string; label: string}[]; correct: string};

const fr = (v: bigint) => v.toLocaleString('fr-FR');

/** Mot de n bits codant x en complément à 2. */
export function encodeC2(x: number, n: number): string {
  const v = x < 0 ? 2 ** n + x : x;
  return v.toString(2).padStart(n, '0');
}

export function decodeC2(word: string): number {
  const n = word.length;
  const v = parseInt(word, 2);
  return word[0] === '1' ? v - 2 ** n : v;
}

const invert = (w: string) => w.replace(/[01]/g, (b) => (b === '0' ? '1' : '0'));

function Bits({word, signed = true}: {word: string; signed?: boolean}) {
  return (
    <span className={s.bits}>
      {word.split('').map((b, i) => (
        <span key={i} className={clsx(s.bit, signed && i === 0 && s.bitSign)}>
          {b}
        </span>
      ))}
    </span>
  );
}

function CodeCorrection({x, n}: {x: number; n: number}) {
  const abs = Math.abs(x).toString(2).padStart(n, '0');
  if (x >= 0) {
    return (
      <p>
        {x} est positif : on l’écrit simplement en binaire sur {n} bits, le bit de poids fort vaut 0 : <Bits word={abs} />
      </p>
    );
  }
  const inv = invert(abs);
  return (
    <ol className={s.steps}>
      <li>
        On code la valeur absolue {Math.abs(x)} sur {n} bits : <Bits word={abs} signed={false} />
      </li>
      <li>
        On inverse tous les bits : <Bits word={inv} signed={false} />
      </li>
      <li>
        On ajoute 1 : <Bits word={encodeC2(x, n)} /> (le bit de poids fort vaut 1 : le nombre est négatif).
      </li>
    </ol>
  );
}

function DecodeCorrection({word}: {word: string}) {
  const n = word.length;
  const x = decodeC2(word);
  const terms = word
    .split('')
    .map((b, i) => (b === '1' ? (i === 0 ? `-2^{${n - 1}}` : `2^{${n - 1 - i}}`) : null))
    .filter(Boolean);
  const values = word
    .split('')
    .map((b, i) => (b === '1' ? (i === 0 ? -(2 ** (n - 1)) : 2 ** (n - 1 - i)) : null))
    .filter((v) => v !== null);
  return (
    <>
      <p>
        En complément à 2, le bit de poids fort « pèse » −2<sup>{n - 1}</sup> au lieu de +2<sup>{n - 1}</sup> :
      </p>
      <Tex block tex={`${terms.join(' + ') || '0'} = ${values.join(' + ').replace(/\+ -/g, '- ') || '0'} = ${x}`} />
      {x < 0 && (
        <p className={s.hint}>
          Autre méthode : inverser les bits ({invert(word)}) puis ajouter 1 donne {Math.abs(x)}, donc le nombre vaut {x}.
        </p>
      )}
    </>
  );
}

function plageQuestion(): Q {
  const n = pick([8, 16, 32, 64]);
  const half = 2n ** BigInt(n - 1);
  const full = 2n ** BigInt(n);
  const range = (a: bigint, b: bigint) => `de ${fr(a)} à ${fr(b)}`;
  const correct = range(-half, half - 1n);
  const options = shuffle([
    correct,
    range(-half + 1n, half - 1n),
    range(0n, full - 1n),
    range(-half, half),
  ]).map((label) => ({value: label, label}));
  return {mode: 'plage', n, options, correct};
}

export default function ComplementDeux({bits = 8, modes = ['coder', 'decoder', 'plage'], title = 'Entiers relatifs : complément à 2'}: Props): ReactNode {
  const generate = (): Q => {
    const mode = pick(modes);
    const half = 2 ** (bits - 1);
    if (mode === 'coder') {
      // Surtout des négatifs, parfois un positif ou une valeur limite.
      const x = pick([randInt(-half, -1), randInt(-half, -1), randInt(0, half - 1), -half, -1]);
      return {mode, x, n: bits};
    }
    if (mode === 'decoder') {
      const x = pick([randInt(-half, -1), randInt(-half, -1), randInt(0, half - 1)]);
      return {mode, word: encodeC2(x, bits), n: bits};
    }
    return plageQuestion();
  };

  return (
    <Entraineur<Q, string>
      title={title}
      generate={generate}
      emptyAnswer=""
      hideCheckButton={(q) => q.mode === 'plage'}
      canSubmit={(a) => a.trim() !== ''}
      check={(q, a) => {
        if (q.mode === 'coder') {
          const expected = encodeC2(q.x, q.n);
          const given = a.replace(/\s/g, '');
          return {
            ok: given === expected,
            expected: <Bits word={expected} />,
            correction: (
              <>
                {given.length > 0 && given.length !== q.n && (
                  <p>Attention : la réponse doit compter exactement {q.n} bits (ici {given.length}).</p>
                )}
                <CodeCorrection x={q.x} n={q.n} />
              </>
            ),
          };
        }
        if (q.mode === 'decoder') {
          const expected = decodeC2(q.word);
          return {
            ok: Number.parseInt(a.trim().replace('−', '-'), 10) === expected,
            expected: String(expected),
            correction: <DecodeCorrection word={q.word} />,
          };
        }
        return {
          ok: a === q.correct,
          expected: q.correct,
          correction: (
            <p>
              Sur {q.n} bits on dispose de 2<sup>{q.n}</sup> mots. En complément à 2, la moitié sert aux négatifs :
              de −2<sup>{q.n - 1}</sup> à 2<sup>{q.n - 1}</sup> − 1 (il y a un négatif de plus que de positifs, car 0 est
              compté avec les positifs).
              {q.n === 64 && ' En Python, les entiers n’ont pas de taille fixe : ils peuvent dépasser cette limite.'}
            </p>
          ),
        };
      }}
      render={(q, {answer, setAnswer, submit, locked, verdict, inputId}) => {
        if (q.mode === 'plage') {
          return (
            <>
              <p className={s.prompt}>
                Quelles valeurs peut-on représenter avec un entier <strong>signé</strong> sur {q.n} bits (complément à 2) ?
              </p>
              <Choices
                options={q.options}
                answer={answer}
                locked={locked}
                verdict={verdict}
                correct={q.correct}
                onPick={(v) => submit(v)}
              />
            </>
          );
        }
        if (q.mode === 'coder') {
          return (
            <>
              <p className={s.prompt}>
                Code l’entier <Num value={q.x} base={10} /> en complément à 2 sur {q.n} bits.
              </p>
              <AnswerField
                id={inputId}
                label="Mot binaire"
                value={answer}
                onChange={(v) => setAnswer(v.replace(/[^01\s]/g, ''))}
                locked={locked}
                verdict={verdict}
                placeholder={'0'.repeat(q.n)}
                inputMode="numeric"
                width={`${q.n + 4}ch`}
              />
            </>
          );
        }
        return (
          <>
            <p className={s.prompt}>
              Quel entier relatif est codé par <Bits word={q.word} /> (complément à 2 sur {q.n} bits) ?
            </p>
            <AnswerField
              id={inputId}
              label="Entier"
              value={answer}
              onChange={setAnswer}
              locked={locked}
              verdict={verdict}
              inputMode="text"
              width="10ch"
            />
          </>
        );
      }}
    />
  );
}
