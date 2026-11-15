import React, {type ReactNode} from 'react';
import CodeBlock from '@theme/CodeBlock';
import Entraineur, {AnswerField, Choices, Num, trainerStyles as s} from './core/Entraineur';
import {pick, randInt} from './core/utils';

type Mode = 'ecriture' | 'fini' | 'python';

type Props = {
  modes?: Mode[];
  title?: string;
};

/** Fraction exacte (évite les erreurs d'arrondi... dans un exercice sur les erreurs d'arrondi). */
type Frac = {num: number; den: number; label: string};

type Q =
  | {mode: 'ecriture'; value: Frac}
  | {mode: 'fini'; value: Frac}
  | {mode: 'python'; expr: string; result: boolean; shown?: string};

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
const isPowerOfTwo = (n: number) => n > 0 && (n & (n - 1)) === 0;

/** Écriture binaire d'une fraction, avec au plus `max` bits après la virgule. */
function fracToBinary(f: Frac, max = 12): {text: string; finite: boolean} {
  const int = Math.floor(f.num / f.den);
  let rest = f.num % f.den;
  let bits = '';
  for (let i = 0; i < max && rest !== 0; i++) {
    rest *= 2;
    bits += rest >= f.den ? '1' : '0';
    rest %= f.den;
  }
  const finite = rest === 0;
  return {text: `${int.toString(2)}${bits ? `,${bits}` : ''}`, finite};
}

/** Lignes du tableau « on multiplie la partie décimale par 2 ». */
function multiplications(f: Frac, max: number) {
  const rows: {before: string; after: string; bit: string}[] = [];
  let rest = f.num % f.den;
  // Écriture décimale quand elle est finie (dénominateur de la forme 2^a × 5^b), sinon fraction.
  let d = f.den;
  while (d % 2 === 0) d /= 2;
  while (d % 5 === 0) d /= 5;
  const show = (n: number) => (d === 1 ? String(n / f.den).replace('.', ',') : `${n}/${f.den}`);
  for (let i = 0; i < max && rest !== 0; i++) {
    const doubled = rest * 2;
    rows.push({before: show(rest), after: show(doubled), bit: doubled >= f.den ? '1' : '0'});
    rest = doubled % f.den;
  }
  return rows;
}

function MultiplicationTable({f, max}: {f: Frac; max: number}) {
  const rows = multiplications(f, max);
  return (
    <table className={s.table}>
      <thead>
        <tr>
          <th scope="col">Partie après la virgule</th>
          <th scope="col">× 2</th>
          <th scope="col">Bit</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            <td>{r.before}</td>
            <td>{r.after}</td>
            <td>
              <strong>{r.bit}</strong>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Nombres dont l'écriture binaire est finie (dénominateur puissance de 2). */
const DYADIQUES: [number, number][] = [
  [1, 2], [1, 4], [3, 4], [1, 8], [3, 8], [5, 8], [7, 8], [3, 16], [5, 16], [11, 16], [13, 16],
];

const decimalLabel = (num: number, den: number) => String(num / den).replace('.', ',');

const FINI_POOL: Frac[] = [
  {num: 1, den: 10, label: '0,1'},
  {num: 1, den: 5, label: '0,2'},
  {num: 3, den: 10, label: '0,3'},
  {num: 1, den: 4, label: '0,25'},
  {num: 1, den: 2, label: '0,5'},
  {num: 3, den: 4, label: '0,75'},
  {num: 1, den: 8, label: '0,125'},
  {num: 3, den: 8, label: '0,375'},
  {num: 1, den: 3, label: '1/3'},
  {num: 2, den: 3, label: '2/3'},
  {num: 3, den: 5, label: '0,6'},
  {num: 7, den: 10, label: '0,7'},
];

const PYTHON_POOL: {expr: string; result: boolean; shown?: string}[] = [
  {expr: '0.1 + 0.2 == 0.3', result: false, shown: String(0.1 + 0.2)},
  {expr: '0.1 + 0.1 + 0.1 == 0.3', result: false, shown: String(0.1 + 0.1 + 0.1)},
  {expr: '0.1 * 3 == 0.3', result: false, shown: String(0.1 * 3)},
  {expr: '0.5 + 0.25 == 0.75', result: true},
  {expr: '0.25 + 0.25 == 0.5', result: true},
  {expr: '0.125 * 4 == 0.5', result: true},
  {expr: '0.3 - 0.1 == 0.2', result: false, shown: String(0.3 - 0.1)},
  {expr: 'abs((0.1 + 0.2) - 0.3) < 1e-9', result: true},
];

function generate(modes: Mode[]): Q {
  const mode = pick(modes);
  if (mode === 'ecriture') {
    const [num, den] = pick(DYADIQUES);
    const int = pick([0, 0, randInt(1, 12)]);
    const total = int * den + num;
    return {mode, value: {num: total, den, label: decimalLabel(total, den)}};
  }
  if (mode === 'fini') return {mode, value: pick(FINI_POOL)};
  return {mode, ...pick(PYTHON_POOL)};
}

/** « 0101,1100 » → « 101,11 » : espaces, zéros inutiles et point/virgule ignorés. */
function normalize(a: string): string {
  const [rawInt, rawFrac = ''] = a.trim().replace(/\s/g, '').replace('.', ',').split(',');
  const int = rawInt.replace(/^0+(?=\d)/, '') || '0';
  const frac = rawFrac.replace(/0+$/, '');
  return frac ? `${int},${frac}` : int;
}

function EcritureCorrection({f}: {f: Frac}) {
  const int = Math.floor(f.num / f.den);
  return (
    <>
      <p>
        Partie entière : <Num value={int} base={10} /> = <Num value={int.toString(2)} base={2} />. Partie après la virgule :
        on la multiplie par 2 ; la partie entière du résultat donne le bit suivant, on recommence avec ce qui reste après la
        virgule, jusqu’à obtenir 0.
      </p>
      <MultiplicationTable f={f} max={12} />
    </>
  );
}

function FiniCorrection({f}: {f: Frac}) {
  const g = gcd(f.num, f.den);
  const den = f.den / g;
  const {text, finite} = fracToBinary(f, 12);
  return (
    <>
      <p>
        {f.label} = {f.num / g}/{den} (fraction irréductible). Son écriture binaire est finie seulement si le dénominateur est
        une puissance de 2 : {den} {isPowerOfTwo(den) ? 'en est une' : 'n’en est pas une'}.
      </p>
      <MultiplicationTable f={f} max={finite ? 12 : 8} />
      <p>
        {finite ? (
          <>
            Écriture binaire : <Num value={text} base={2} />
          </>
        ) : (
          <>
            Les mêmes étapes reviennent indéfiniment : <Num value={`${text}…`} base={2} />. L’ordinateur doit couper cette
            écriture : il ne stocke qu’une <strong>valeur approchée</strong> de {f.label}.
          </>
        )}
      </p>
    </>
  );
}

export default function Flottants({modes = ['ecriture', 'fini', 'python'], title = 'Nombres flottants'}: Props): ReactNode {
  return (
    <Entraineur<Q, string>
      title={title}
      generate={() => generate(modes)}
      emptyAnswer=""
      check={(q, a) => {
        if (q.mode === 'ecriture') {
          const {text} = fracToBinary(q.value);
          return {
            ok: normalize(a) === normalize(text),
            expected: <Num value={text} base={2} />,
            correction: <EcritureCorrection f={q.value} />,
          };
        }
        if (q.mode === 'fini') {
          const finite = fracToBinary(q.value, 30).finite;
          return {
            ok: a === (finite ? 'finie' : 'infinie'),
            expected: finite ? 'finie' : 'infinie',
            correction: <FiniCorrection f={q.value} />,
          };
        }
        const expected = q.result ? 'True' : 'False';
        return {
          ok: a === expected,
          expected: <code>{expected}</code>,
          correction: (
            <p>
              {q.shown !== undefined ? (
                <>
                  Le calcul donne en réalité <code>{q.shown}</code> : les nombres utilisés n’ont pas d’écriture binaire finie,
                  ils sont arrondis et les erreurs s’accumulent.{' '}
                </>
              ) : q.expr.startsWith('abs') ? (
                <>
                  C’est la bonne façon de comparer deux flottants : on vérifie que leur écart est très petit, au lieu de tester
                  l’égalité.{' '}
                </>
              ) : (
                <>Ces nombres s’écrivent exactement en binaire (dénominateurs puissances de 2) : le calcul est exact. </>
              )}
              <strong>À retenir :</strong> on évite de tester l’égalité de deux flottants avec <code>==</code>.
            </p>
          ),
        };
      }}
      render={(q, {answer, setAnswer, submit, locked, verdict, inputId}) => {
        if (q.mode === 'ecriture') {
          return (
            <>
              <p className={s.prompt}>
                Écris le nombre <Num value={q.value.label} base={10} /> en binaire.
              </p>
              <AnswerField
                id={inputId}
                label="Écriture binaire"
                value={answer}
                onChange={(v) => setAnswer(v.replace(/[^01,.\s]/g, ''))}
                locked={locked}
                verdict={verdict}
                suffix={<sub>2</sub>}
                placeholder="101,01"
                inputMode="decimal"
              />
            </>
          );
        }
        if (q.mode === 'fini') {
          return (
            <>
              <p className={s.prompt}>
                L’écriture binaire du nombre <Num value={q.value.label} base={10} /> est-elle finie ?
              </p>
              <Choices
                options={[
                  {value: 'finie', label: 'Finie'},
                  {value: 'infinie', label: 'Infinie'},
                ]}
                answer={answer as 'finie' | 'infinie' | ''}
                locked={locked}
                verdict={verdict}
                correct={fracToBinary(q.value, 30).finite ? 'finie' : 'infinie'}
                onPick={(v) => submit(v)}
              />
            </>
          );
        }
        return (
          <>
            <p className={s.prompt}>Que renvoie Python pour l’expression suivante ?</p>
            <CodeBlock language="python" children={q.expr} />
            <Choices
              mono
              options={[
                {value: 'True', label: 'True'},
                {value: 'False', label: 'False'},
              ]}
              answer={answer as 'True' | 'False' | ''}
              locked={locked}
              verdict={verdict}
              correct={q.result ? 'True' : 'False'}
              onPick={(v) => submit(v)}
            />
          </>
        );
      }}
      hideCheckButton={(q) => q.mode !== 'ecriture'}
    />
  );
}
