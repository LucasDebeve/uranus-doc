import React, {type ReactNode} from 'react';
import Entraineur, {AnswerField, Num, trainerStyles as s} from './core/Entraineur';
import Tex from './core/Tex';
import {DIGITS, groupBits, normalizeNumber, pick, randInt, toBase} from './core/utils';

type Base = number | 'aleatoire';

type Props = {
  /** Base de départ (2 à 16), ou 'aleatoire'. */
  from?: Base;
  /** Base d'arrivée (2 à 16), ou 'aleatoire'. */
  to?: Base;
  /** Bases tirées au sort quand `from` ou `to` vaut 'aleatoire'. */
  bases?: number[];
  /** Plus grand entier proposé. */
  max?: number;
  title?: string;
};

type Q = {n: number; from: number; to: number};

const baseName = (b: number) =>
  b === 2 ? 'binaire (base 2)' : b === 10 ? 'décimale (base 10)' : b === 16 ? 'hexadécimale (base 16)' : `base ${b}`;

const digitValue = (d: string) => DIGITS.indexOf(d.toUpperCase());

/** Divisions successives : de la base 10 vers la base b. */
function Divisions({n, b}: {n: number; b: number}) {
  const rows: {q: number; div: number; r: number}[] = [];
  let x = n;
  do {
    rows.push({q: x, div: Math.floor(x / b), r: x % b});
    x = Math.floor(x / b);
  } while (x > 0);
  return (
    <>
      <p>
        Divisions successives par {b} : on divise jusqu’à obtenir un quotient nul, puis on lit les restes{' '}
        <strong>de bas en haut</strong>.
      </p>
      <table className={s.table}>
        <thead>
          <tr>
            <th scope="col">Division</th>
            <th scope="col">Quotient</th>
            <th scope="col">Reste</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.q}>
              <td>
                {row.q} ÷ {b}
              </td>
              <td>{row.div}</td>
              <td>
                <strong>{DIGITS[row.r]}</strong>
                {row.r > 9 && ` (${row.r})`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        Restes lus de bas en haut : <Num value={toBase(n, b)} base={b} />
      </p>
    </>
  );
}

/** Développement en puissances de b : de la base b vers la base 10. */
function Development({n, b}: {n: number; b: number}) {
  const digits = toBase(n, b).split('');
  const k = digits.length - 1;
  const terms = digits.map((d, i) => `${digitValue(d)} \\times ${b}^{${k - i}}`);
  const values = digits.map((d, i) => digitValue(d) * b ** (k - i));
  const letters = digits.filter((d) => digitValue(d) > 9);
  return (
    <>
      <p>
        Chaque chiffre est multiplié par la puissance de {b} correspondant à sa position (en partant de 0 à droite)
        {letters.length > 0 && <> ; en hexadécimal, A vaut 10, B vaut 11… F vaut 15</>} :
      </p>
      <Tex block tex={`${toBase(n, b)}_{${b}} = ${terms.join(' + ')} = ${values.join(' + ')} = ${n}`} />
    </>
  );
}

/** Regroupement par paquets de 4 bits : entre bases 2 et 16. */
function Grouping({n, from}: {n: number; from: number}) {
  const bits = toBase(n, 2);
  const padded = bits.padStart(Math.ceil(bits.length / 4) * 4, '0');
  const groups = groupBits(padded).split(' ');
  return (
    <>
      <p>
        Un chiffre hexadécimal correspond exactement à 4 bits ({from === 2 ? 'on regroupe les bits par 4 en partant de la droite' : 'chaque chiffre hexadécimal donne 4 bits'}) :
      </p>
      <table className={s.table}>
        <tbody>
          <tr>
            <th scope="row">Bits</th>
            {groups.map((g, i) => (
              <td key={i}>{g}</td>
            ))}
          </tr>
          <tr>
            <th scope="row">Hexa</th>
            {groups.map((g, i) => (
              <td key={i}>
                <strong>{parseInt(g, 2).toString(16).toUpperCase()}</strong>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </>
  );
}

function Correction({q}: {q: Q}): ReactNode {
  if (q.from === 10) return <Divisions n={q.n} b={q.to} />;
  if (q.to === 10) return <Development n={q.n} b={q.from} />;
  if ((q.from === 2 && q.to === 16) || (q.from === 16 && q.to === 2)) return <Grouping n={q.n} from={q.from} />;
  return (
    <>
      <p>
        On passe par la base 10 : d’abord <Num value={toBase(q.n, q.from)} base={q.from} /> → <Num value={q.n} base={10} />, puis{' '}
        <Num value={q.n} base={10} /> → base {q.to}.
      </p>
      <Development n={q.n} b={q.from} />
      <Divisions n={q.n} b={q.to} />
    </>
  );
}

export default function ConversionBases({
  from = 'aleatoire',
  to = 'aleatoire',
  bases = [2, 10, 16],
  max = 255,
  title = 'Changer de base',
}: Props): ReactNode {
  const generate = (): Q => {
    let f = from === 'aleatoire' ? pick(bases) : from;
    let t = to === 'aleatoire' ? pick(bases) : to;
    let guard = 0;
    while (f === t && guard++ < 20) {
      if (to === 'aleatoire') t = pick(bases);
      else if (from === 'aleatoire') f = pick(bases);
      else break;
    }
    return {n: randInt(2, max), from: f, to: t};
  };

  return (
    <Entraineur<Q, string>
      title={title}
      generate={generate}
      emptyAnswer=""
      check={(q, a) => {
        const expected = toBase(q.n, q.to);
        const given = normalizeNumber(a);
        const invalid = given.split('').find((d) => digitValue(d) < 0 || digitValue(d) >= q.to);
        return {
          ok: given === expected,
          expected: <Num value={expected} base={q.to} />,
          correction: (
            <>
              {invalid && (
                <p>
                  Attention : le chiffre « {invalid} » n’existe pas en base {q.to} (chiffres autorisés : {DIGITS.slice(0, q.to).split('').join(', ')}).
                </p>
              )}
              <Correction q={q} />
            </>
          ),
        };
      }}
      render={(q, {answer, setAnswer, locked, verdict, inputId}) => (
        <>
          <p className={s.prompt}>
            Écris <Num value={toBase(q.n, q.from)} base={q.from} /> en {baseName(q.to)}.
          </p>
          <AnswerField
            id={inputId}
            label="Réponse"
            value={answer}
            onChange={setAnswer}
            locked={locked}
            verdict={verdict}
            suffix={<sub>{q.to}</sub>}
            inputMode={q.to <= 10 ? 'numeric' : 'text'}
          />
        </>
      )}
    />
  );
}
