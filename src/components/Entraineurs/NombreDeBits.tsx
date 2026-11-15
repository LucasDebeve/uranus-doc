import React, {type ReactNode} from 'react';
import Entraineur, {AnswerField, Num, trainerStyles as s} from './core/Entraineur';
import Tex from './core/Tex';
import {bitsNeeded, pick, randInt, toBase} from './core/utils';

type Kind = 'entier' | 'somme' | 'produit';

type Q =
  | {kind: 'entier'; n: number}
  | {kind: 'somme' | 'produit'; p: number; q: number};

type Props = {
  /** Types de questions proposés (tous par défaut). */
  kinds?: Kind[];
  title?: string;
};

function expectedOf(q: Q): number {
  if (q.kind === 'entier') return bitsNeeded(q.n);
  if (q.kind === 'somme') return Math.max(q.p, q.q) + 1;
  return q.p + q.q;
}

function generateEntier(): number {
  // Un tiers des questions tombe sur une puissance de 2 ou juste avant : les cas qui piègent.
  const k = randInt(2, 16);
  return pick([2 ** k, 2 ** k - 1, randInt(2 ** (k - 1), 2 ** k - 1), randInt(2, 2 ** k)]);
}

function Correction({q}: {q: Q}): ReactNode {
  if (q.kind === 'entier') {
    const k = bitsNeeded(q.n);
    return (
      <>
        <p>On cherche la plus petite puissance de 2 strictement supérieure à {q.n} :</p>
        <Tex block tex={`2^{${k - 1}} = ${2 ** (k - 1)} \\leqslant ${q.n} < 2^{${k}} = ${2 ** k}`} />
        <p>
          Il faut donc {k} bits. Vérification : <Num value={toBase(q.n, 2)} base={2} /> compte bien {k} chiffres.
        </p>
      </>
    );
  }
  if (q.kind === 'somme') {
    const m = Math.max(q.p, q.q);
    return (
      <>
        <p>
          Sur {q.p} bits, a ⩽ 2<sup>{q.p}</sup> − 1 ; sur {q.q} bits, b ⩽ 2<sup>{q.q}</sup> − 1. Donc :
        </p>
        <Tex block tex={`a + b \\leqslant (2^{${q.p}} - 1) + (2^{${q.q}} - 1) < 2 \\times 2^{${m}} = 2^{${m + 1}}`} />
        <p>
          Une somme demande au plus <strong>un bit de plus</strong> que le plus grand des deux nombres : {m} + 1 = {m + 1} bits
          (la dernière retenue peut créer un bit supplémentaire).
        </p>
      </>
    );
  }
  return (
    <>
      <p>
        a &lt; 2<sup>{q.p}</sup> et b &lt; 2<sup>{q.q}</sup>, donc :
      </p>
      <Tex block tex={`a \\times b < 2^{${q.p}} \\times 2^{${q.q}} = 2^{${q.p} + ${q.q}} = 2^{${q.p + q.q}}`} />
      <p>
        Un produit demande au plus <strong>la somme des nombres de bits</strong> : {q.p} + {q.q} = {q.p + q.q} bits.
      </p>
    </>
  );
}

export default function NombreDeBits({kinds = ['entier', 'somme', 'produit'], title = 'Nombre de bits nécessaires'}: Props): ReactNode {
  const generate = (): Q => {
    const kind = pick(kinds);
    if (kind === 'entier') return {kind, n: generateEntier()};
    return {kind, p: randInt(3, 16), q: randInt(3, 16)};
  };

  return (
    <Entraineur<Q, string>
      title={title}
      generate={generate}
      emptyAnswer=""
      check={(q, a) => {
        const expected = expectedOf(q);
        return {
          ok: Number.parseInt(a.trim(), 10) === expected,
          expected: `${expected} bits`,
          correction: <Correction q={q} />,
        };
      }}
      render={(q, {answer, setAnswer, locked, verdict, inputId}) => (
        <>
          <p className={s.prompt}>
            {q.kind === 'entier' && (
              <>
                Combien de bits faut-il, au minimum, pour écrire l’entier <Num value={q.n} base={10} /> en base 2 ?
              </>
            )}
            {q.kind === 'somme' && (
              <>
                Deux entiers positifs a et b s’écrivent respectivement sur {q.p} et {q.q} bits. Combien de bits faut-il,{' '}
                <strong>au maximum</strong>, pour écrire leur <strong>somme</strong> a + b ?
              </>
            )}
            {q.kind === 'produit' && (
              <>
                Deux entiers positifs a et b s’écrivent respectivement sur {q.p} et {q.q} bits. Combien de bits faut-il,{' '}
                <strong>au maximum</strong>, pour écrire leur <strong>produit</strong> a × b ?
              </>
            )}
          </p>
          <AnswerField
            id={inputId}
            label="Nombre de bits"
            value={answer}
            onChange={setAnswer}
            locked={locked}
            verdict={verdict}
            suffix="bits"
            inputMode="numeric"
            width="6ch"
          />
        </>
      )}
    />
  );
}
