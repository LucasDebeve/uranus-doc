import React, {type ReactNode} from 'react';
import Entraineur, {AnswerField, Num, trainerStyles as s} from './core/Entraineur';
import {normalizeNumber, randInt} from './core/utils';
import t from './AdditionBinaire.module.css';

type Q = {a: number; b: number};

type Props = {
  /** Nombre de bits des deux termes. */
  bits?: number;
  title?: string;
};

/** Addition posée en colonnes, avec la ligne des retenues. */
function Posee({a, b}: Q) {
  const sum = (a + b).toString(2);
  const width = sum.length;
  const A = a.toString(2).padStart(width, ' ');
  const B = b.toString(2).padStart(width, ' ');
  const carries: string[] = Array(width).fill(' ');
  let carry = 0;
  for (let i = width - 1; i >= 0; i--) {
    const x = A[i] === '1' ? 1 : 0;
    const y = B[i] === '1' ? 1 : 0;
    const total = x + y + carry;
    carry = total >= 2 ? 1 : 0;
    if (carry && i > 0) carries[i - 1] = '1';
  }
  const row = (label: string, chars: string[] | string, className?: string) => (
    <tr className={className}>
      <th scope="row">{label}</th>
      {(typeof chars === 'string' ? chars.split('') : chars).map((c, i) => (
        <td key={i}>{c.trim()}</td>
      ))}
    </tr>
  );
  return (
    <table className={t.posee}>
      <tbody>
        {row('retenues', carries, t.carries)}
        {row('', A)}
        {row('+', B)}
        {row('=', sum, t.result)}
      </tbody>
    </table>
  );
}

export default function AdditionBinaire({bits = 6, title = 'Addition binaire'}: Props): ReactNode {
  const max = 2 ** bits - 1;
  return (
    <Entraineur<Q, string>
      title={title}
      generate={() => ({a: randInt(2 ** (bits - 2), max), b: randInt(2 ** (bits - 2), max)})}
      emptyAnswer=""
      check={(q, ans) => {
        const expected = (q.a + q.b).toString(2);
        return {
          ok: normalizeNumber(ans) === expected,
          expected: <Num value={expected} base={2} />,
          correction: (
            <>
              <p>
                On additionne colonne par colonne, de droite à gauche : 0 + 0 = 0, 0 + 1 = 1, 1 + 1 = 10 (on écrit 0 et on
                retient 1), 1 + 1 + 1 = 11 (on écrit 1 et on retient 1).
              </p>
              <Posee {...q} />
              <p className={s.hint}>
                Dans chaque colonne, le bit écrit vaut <code>a xor b xor retenue</code> : c’est ainsi qu’un processeur additionne
                avec des portes logiques. Vérification en base 10 : {q.a} + {q.b} = {q.a + q.b}.
              </p>
            </>
          ),
        };
      }}
      render={(q, {answer, setAnswer, locked, verdict, inputId}) => (
        <>
          <p className={s.prompt}>Calcule cette addition binaire :</p>
          <table className={t.posee}>
            <tbody>
              <tr>
                <th scope="row" />
                {q.a
                  .toString(2)
                  .padStart(bits, ' ')
                  .split('')
                  .map((c, i) => (
                    <td key={i}>{c.trim()}</td>
                  ))}
              </tr>
              <tr>
                <th scope="row">+</th>
                {q.b
                  .toString(2)
                  .padStart(bits, ' ')
                  .split('')
                  .map((c, i) => (
                    <td key={i}>{c.trim()}</td>
                  ))}
              </tr>
            </tbody>
          </table>
          <AnswerField
            id={inputId}
            label="Résultat"
            value={answer}
            onChange={(v) => setAnswer(v.replace(/[^01\s]/g, ''))}
            locked={locked}
            verdict={verdict}
            suffix={<sub>2</sub>}
            inputMode="numeric"
            width={`${bits + 5}ch`}
          />
        </>
      )}
    />
  );
}
