import React, {type ReactNode} from 'react';
import CodeBlock from '@theme/CodeBlock';
import Entraineur, {Choices, trainerStyles as s} from './core/Entraineur';
import {pick} from './core/utils';

type Outcome = 'True' | 'False' | 'Erreur';

type Q = {setup: string; expr: string; outcome: Outcome; explanation: string};

/** Situations où l'ordre des opérandes de `and` / `or` change tout. */
const POOL: Q[] = [
  {
    setup: 'x = 0',
    expr: 'x != 0 and 10 / x > 2',
    outcome: 'False',
    explanation: '`x != 0` vaut False : `and` s’arrête là, sans calculer 10 / x. Aucune division par zéro.',
  },
  {
    setup: 'x = 0',
    expr: '10 / x > 2 and x != 0',
    outcome: 'Erreur',
    explanation: 'Python évalue d’abord la partie gauche : 10 / 0 provoque une ZeroDivisionError avant même de regarder x != 0.',
  },
  {
    setup: 'x = 0',
    expr: 'x == 0 or 10 / x > 2',
    outcome: 'True',
    explanation: '`x == 0` vaut True : `or` s’arrête là, le résultat est forcément True. 10 / x n’est jamais calculé.',
  },
  {
    setup: 'x = 0',
    expr: '10 / x > 2 or x == 0',
    outcome: 'Erreur',
    explanation: 'La partie gauche est évaluée en premier : 10 / 0 provoque une ZeroDivisionError.',
  },
  {
    setup: 'x = 4',
    expr: 'x != 0 and 10 / x > 2',
    outcome: 'True',
    explanation: '`x != 0` vaut True, donc `and` évalue la partie droite : 10 / 4 = 2.5 > 2, donc True.',
  },
  {
    setup: 'L = []',
    expr: 'len(L) > 0 and L[0] == 5',
    outcome: 'False',
    explanation: '`len(L) > 0` vaut False : `and` s’arrête, L[0] n’est jamais lu. Pas d’erreur.',
  },
  {
    setup: 'L = []',
    expr: 'L[0] == 5 and len(L) > 0',
    outcome: 'Erreur',
    explanation: 'L[0] est évalué en premier alors que la liste est vide : IndexError.',
  },
  {
    setup: 'L = []',
    expr: 'len(L) == 0 or L[0] == 5',
    outcome: 'True',
    explanation: '`len(L) == 0` vaut True : `or` s’arrête, le résultat est True sans lire L[0].',
  },
  {
    setup: 'L = [5, 8]',
    expr: 'len(L) > 0 and L[0] == 5',
    outcome: 'True',
    explanation: 'La liste n’est pas vide, donc `and` évalue L[0] == 5, qui vaut True.',
  },
];

const CODE = ({children}: {children: string}) => {
  // Remplace les `...` de l'explication par du code.
  const parts = children.split('`');
  return (
    <>
      {parts.map((p, i) => (i % 2 === 1 ? <code key={i}>{p}</code> : <React.Fragment key={i}>{p}</React.Fragment>))}
    </>
  );
};

export default function EvaluationSequentielle({title = 'Évaluation séquentielle de and / or'}: {title?: string}): ReactNode {
  return (
    <Entraineur<Q, string>
      title={title}
      generate={() => pick(POOL)}
      emptyAnswer=""
      hideCheckButton
      check={(q, a) => ({
        ok: a === q.outcome,
        expected: q.outcome === 'Erreur' ? 'une erreur' : <code>{q.outcome}</code>,
        correction: (
          <>
            <p>
              <CODE children={q.explanation} />
            </p>
            <p className={s.hint}>
              <code>a and b</code> : si <code>a</code> est faux, <code>b</code> n’est pas évalué. <code>a or b</code> : si{' '}
              <code>a</code> est vrai, <code>b</code> n’est pas évalué. On place donc les tests de sécurité <strong>à gauche</strong>.
            </p>
          </>
        ),
      })}
      render={(q, {answer, submit, locked, verdict}) => (
        <>
          <p className={s.prompt}>Que se passe-t-il quand Python exécute ce code ?</p>
          <CodeBlock language="python" children={`${q.setup}\nprint(${q.expr})`} />
          <Choices<Outcome>
            mono
            options={[
              {value: 'True', label: 'True'},
              {value: 'False', label: 'False'},
              {value: 'Erreur', label: 'Erreur'},
            ]}
            answer={answer as Outcome | ''}
            locked={locked}
            verdict={verdict}
            correct={q.outcome}
            onPick={(v) => submit(v)}
          />
        </>
      )}
    />
  );
}
