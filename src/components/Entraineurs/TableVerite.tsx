import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Entraineur, {trainerStyles as s} from './core/Entraineur';
import {pick} from './core/utils';
import t from './TableVerite.module.css';

type Env = Record<string, boolean>;
type Step = {label: string; f: (e: Env) => boolean};
type Expression = {vars: string[]; text: string; steps: Step[]};

const xor = (x: boolean, y: boolean) => x !== y;

/** Expressions proposées, avec leurs étapes intermédiaires (affichées dans la correction). */
const EXPRESSIONS: Expression[] = [
  {vars: ['a', 'b'], text: 'a and b', steps: [{label: 'a and b', f: (e) => e.a && e.b}]},
  {vars: ['a', 'b'], text: 'a or b', steps: [{label: 'a or b', f: (e) => e.a || e.b}]},
  {vars: ['a', 'b'], text: 'a xor b', steps: [{label: 'a xor b', f: (e) => xor(e.a, e.b)}]},
  {
    vars: ['a', 'b'],
    text: 'not (a and b)',
    steps: [
      {label: 'a and b', f: (e) => e.a && e.b},
      {label: 'not (a and b)', f: (e) => !(e.a && e.b)},
    ],
  },
  {
    vars: ['a', 'b'],
    text: 'not a or b',
    steps: [
      {label: 'not a', f: (e) => !e.a},
      {label: 'not a or b', f: (e) => !e.a || e.b},
    ],
  },
  {
    vars: ['a', 'b'],
    text: '(a and not b) or (not a and b)',
    steps: [
      {label: 'a and not b', f: (e) => e.a && !e.b},
      {label: 'not a and b', f: (e) => !e.a && e.b},
      {label: '… or …', f: (e) => (e.a && !e.b) || (!e.a && e.b)},
    ],
  },
  {
    vars: ['a', 'b'],
    text: 'not (a or b)',
    steps: [
      {label: 'a or b', f: (e) => e.a || e.b},
      {label: 'not (a or b)', f: (e) => !(e.a || e.b)},
    ],
  },
  {
    vars: ['a', 'b', 'c'],
    text: 'a and (b or c)',
    steps: [
      {label: 'b or c', f: (e) => e.b || e.c},
      {label: 'a and (b or c)', f: (e) => e.a && (e.b || e.c)},
    ],
  },
  {
    vars: ['a', 'b', 'c'],
    text: '(a or b) and not c',
    steps: [
      {label: 'a or b', f: (e) => e.a || e.b},
      {label: 'not c', f: (e) => !e.c},
      {label: '(a or b) and not c', f: (e) => (e.a || e.b) && !e.c},
    ],
  },
  {
    vars: ['a', 'b', 'c'],
    text: '(a xor b) and c',
    steps: [
      {label: 'a xor b', f: (e) => xor(e.a, e.b)},
      {label: '(a xor b) and c', f: (e) => xor(e.a, e.b) && e.c},
    ],
  },
  {
    vars: ['a', 'b', 'c'],
    text: 'a or (b and not c)',
    steps: [
      {label: 'not c', f: (e) => !e.c},
      {label: 'b and not c', f: (e) => e.b && !e.c},
      {label: 'a or (b and not c)', f: (e) => e.a || (e.b && !e.c)},
    ],
  },
];

type Q = {expr: Expression; rows: Env[]};
type Cell = 0 | 1 | null;

function rowsFor(vars: string[]): Env[] {
  const n = vars.length;
  return Array.from({length: 2 ** n}, (_, i) =>
    Object.fromEntries(vars.map((v, k) => [v, Boolean((i >> (n - 1 - k)) & 1)])),
  );
}

const bit = (b: boolean) => (b ? 1 : 0);
const result = (q: Q, row: Env) => q.expr.steps[q.expr.steps.length - 1].f(row);

type Props = {
  /** Limiter aux expressions à 2 variables. */
  deuxVariables?: boolean;
  title?: string;
};

export default function TableVerite({deuxVariables = false, title = 'Table de vérité'}: Props): ReactNode {
  const pool = deuxVariables ? EXPRESSIONS.filter((e) => e.vars.length === 2) : EXPRESSIONS;

  return (
    <Entraineur<Q, Cell[]>
      title={title}
      generate={() => {
        const expr = pick(pool);
        return {expr, rows: rowsFor(expr.vars)};
      }}
      emptyAnswer={(q) => q.rows.map(() => null)}
      canSubmit={(a) => a.every((c) => c !== null)}
      check={(q, a) => {
        const wrong = q.rows.filter((row, i) => a[i] !== bit(result(q, row))).length;
        return {
          ok: wrong === 0,
          correction: (
            <>
              <p>Table complète, avec les étapes intermédiaires :</p>
              <table className={s.table}>
                <thead>
                  <tr>
                    {q.expr.vars.map((v) => (
                      <th key={v} scope="col">
                        {v}
                      </th>
                    ))}
                    {q.expr.steps.map((st) => (
                      <th key={st.label} scope="col">
                        <code>{st.label}</code>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {q.rows.map((row, i) => (
                    <tr key={i}>
                      {q.expr.vars.map((v) => (
                        <td key={v}>{bit(row[v])}</td>
                      ))}
                      {q.expr.steps.map((st, k) => (
                        <td key={st.label}>{k === q.expr.steps.length - 1 ? <strong>{bit(st.f(row))}</strong> : bit(st.f(row))}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {q.expr.text.includes('xor') && (
                <p className={s.hint}>
                  « ou exclusif » (xor) : vrai quand exactement une des deux valeurs est vraie. En Python : <code>a ^ b</code>.
                </p>
              )}
            </>
          ),
        };
      }}
      render={(q, {answer, setAnswer, locked, verdict}) => (
        <>
          <p className={s.prompt}>
            Complète la dernière colonne de la table de vérité de <code className={t.expr}>{q.expr.text}</code>
          </p>
          <p className={s.hint}>Clique sur une case (ou appuie sur 0 / 1) pour choisir sa valeur.</p>
          <table className={clsx(s.table, t.table)}>
            <thead>
              <tr>
                {q.expr.vars.map((v) => (
                  <th key={v} scope="col">
                    {v}
                  </th>
                ))}
                <th scope="col">
                  <code>{q.expr.text}</code>
                </th>
              </tr>
            </thead>
            <tbody>
              {q.rows.map((row, i) => {
                const expected = bit(result(q, row));
                const state = verdict ? (answer[i] === expected ? t.cellOk : t.cellKo) : undefined;
                const label = q.expr.vars.map((v) => `${v} = ${bit(row[v])}`).join(', ');
                return (
                  <tr key={i}>
                    {q.expr.vars.map((v) => (
                      <td key={v}>{bit(row[v])}</td>
                    ))}
                    <td className={t.answerCell}>
                      <button
                        type="button"
                        data-choice
                        className={clsx(t.cell, state)}
                        disabled={locked}
                        aria-label={`Résultat pour ${label} : ${answer[i] ?? 'non rempli'}`}
                        onClick={() => {
                          const next = [...answer];
                          next[i] = answer[i] === 1 ? 0 : 1;
                          setAnswer(next);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === '0' || e.key === '1') {
                            const next = [...answer];
                            next[i] = e.key === '1' ? 1 : 0;
                            setAnswer(next);
                            const buttons = (e.currentTarget.closest('tbody') as HTMLElement).querySelectorAll('button');
                            (buttons[i + 1] as HTMLButtonElement | undefined)?.focus();
                          }
                        }}>
                        {answer[i] ?? '?'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    />
  );
}
