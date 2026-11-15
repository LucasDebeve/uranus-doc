import React, {useCallback, useEffect, useId, useRef, useState, type ReactNode} from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export type Verdict = {
  ok: boolean;
  /** Réponse attendue, affichée en cas d'erreur. */
  expected?: ReactNode;
  /** Explication détaillée (étapes de calcul…), affichée après la réponse. */
  correction?: ReactNode;
};

export type RenderApi<A> = {
  answer: A;
  setAnswer: (a: A) => void;
  /** Valide immédiatement une réponse (QCM, clic sur une case…). */
  submit: (a?: A) => void;
  /** true une fois la réponse vérifiée : les champs passent en lecture seule. */
  locked: boolean;
  verdict: Verdict | null;
  /** id à donner au champ de réponse principal (relié à la consigne). */
  inputId: string;
};

type Props<Q, A> = {
  /** Nom de l'entraîneur, affiché dans l'étiquette. */
  title: string;
  /** Crée une nouvelle question (appelée uniquement dans le navigateur). */
  generate: () => Q;
  /** Valeur de départ du champ de réponse pour chaque question. */
  emptyAnswer: A | ((q: Q) => A);
  /** Affiche la consigne et les champs. */
  render: (q: Q, api: RenderApi<A>) => ReactNode;
  check: (q: Q, answer: A) => Verdict;
  /** La réponse est-elle assez remplie pour être vérifiée ? */
  canSubmit?: (answer: A) => boolean;
  /** Masque le bouton « Vérifier » (quand la réponse se donne par un clic), pour toutes les questions ou certaines. */
  hideCheckButton?: boolean | ((q: Q) => boolean);
  className?: string;
};

/**
 * Cadre commun des entraîneurs : une question tirée au hasard, une réponse, une correction,
 * et un score sur la série en cours. On peut enchaîner les questions à l'infini.
 */
export default function Entraineur<Q, A>({
  title,
  generate,
  emptyAnswer,
  render,
  check,
  canSubmit = (a) => (typeof a === 'string' ? a.trim() !== '' : true),
  hideCheckButton = false,
  className,
}: Props<Q, A>): ReactNode {
  const [question, setQuestion] = useState<Q | null>(null);
  const [answer, setAnswer] = useState<A | null>(null);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [score, setScore] = useState({ok: 0, total: 0, streak: 0});
  const bodyRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const inputId = useId();
  const titleId = useId();

  const initialAnswer = useCallback(
    (q: Q) => (typeof emptyAnswer === 'function' ? (emptyAnswer as (q: Q) => A)(q) : emptyAnswer),
    [emptyAnswer],
  );

  const newQuestion = useCallback(
    (focus: boolean) => {
      const q = generate();
      setQuestion(q);
      setAnswer(initialAnswer(q));
      setVerdict(null);
      if (focus) {
        requestAnimationFrame(() => {
          bodyRef.current?.querySelector<HTMLElement>('input:not([disabled]), select, button[data-choice]')?.focus();
        });
      }
    },
    [generate, initialAnswer],
  );

  // Tirage dans le navigateur uniquement (le site est généré à l'avance : un tirage au build serait figé).
  useEffect(() => {
    newQuestion(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = (forced?: A) => {
    if (!question || verdict) return;
    const value = forced !== undefined ? forced : (answer as A);
    if (forced !== undefined) setAnswer(forced);
    const v = check(question, value);
    setVerdict(v);
    setScore((s) => ({ok: s.ok + (v.ok ? 1 : 0), total: s.total + 1, streak: v.ok ? s.streak + 1 : 0}));
    requestAnimationFrame(() => nextRef.current?.focus());
  };

  const giveUp = () => {
    if (!question || verdict) return;
    const v = check(question, initialAnswer(question));
    setVerdict({...v, ok: false});
    setScore((s) => ({ok: s.ok, total: s.total + 1, streak: 0}));
    requestAnimationFrame(() => nextRef.current?.focus());
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter' || (e.target as HTMLElement).tagName === 'BUTTON') return;
    e.preventDefault();
    if (verdict) newQuestion(true);
    else if (answer !== null && canSubmit(answer)) submit();
  };

  const ready = question !== null && answer !== null;

  return (
    <section className={clsx(styles.trainer, className)} aria-labelledby={titleId} onKeyDown={onKeyDown}>
      <header className={styles.header}>
        <p className={styles.kicker}>Entraînement</p>
        <h3 className={styles.title} id={titleId}>
          {title}
        </h3>
        {score.total > 0 && (
          <p className={styles.score} aria-label={`Score : ${score.ok} bonnes réponses sur ${score.total}`}>
            {score.ok} / {score.total}
            {score.streak >= 3 && <span className={styles.streak}>série de {score.streak}</span>}
          </p>
        )}
      </header>

      <div className={styles.body} ref={bodyRef}>
        {ready ? (
          render(question, {
            answer,
            setAnswer: (a) => !verdict && setAnswer(a),
            submit,
            locked: verdict !== null,
            verdict,
            inputId,
          })
        ) : (
          <p className={styles.loading}>Préparation de la question…</p>
        )}
      </div>

      {/* Zone toujours présente pour que les lecteurs d'écran annoncent le résultat. */}
      <div role="status" aria-live="polite">
        {verdict && (
          <div className={clsx(styles.feedback, verdict.ok ? styles.ok : styles.ko)}>
            <p className={styles.verdict}>
              {verdict.ok ? 'Bonne réponse.' : 'Ce n’est pas ça.'}
              {!verdict.ok && verdict.expected !== undefined && (
                <>
                  {' '}
                  Réponse attendue : <strong className={styles.expected}>{verdict.expected}</strong>
                </>
              )}
            </p>
            {verdict.correction && <div className={styles.correction}>{verdict.correction}</div>}
          </div>
        )}
      </div>

      <footer className={styles.actions}>
        {verdict ? (
          <button ref={nextRef} type="button" className={styles.primary} onClick={() => newQuestion(true)}>
            Question suivante
          </button>
        ) : (
          <>
            {!(typeof hideCheckButton === 'function' ? question !== null && hideCheckButton(question) : hideCheckButton) && (
              <button
                type="button"
                className={styles.primary}
                disabled={!ready || !canSubmit(answer as A)}
                onClick={() => submit()}>
                Vérifier
              </button>
            )}
            <button type="button" className={styles.secondary} disabled={!ready} onClick={giveUp}>
              Voir la correction
            </button>
          </>
        )}
      </footer>
    </section>
  );
}

/** Champ de réponse texte, en police à chasse fixe (adapté aux nombres binaires, hexadécimaux…). */
export function AnswerField({
  id,
  label,
  value,
  onChange,
  locked,
  verdict,
  suffix,
  placeholder,
  inputMode = 'text',
  width = '14ch',
}: {
  id: string;
  label: ReactNode;
  value: string;
  onChange: (v: string) => void;
  locked: boolean;
  verdict: Verdict | null;
  suffix?: ReactNode;
  placeholder?: string;
  inputMode?: 'text' | 'numeric' | 'decimal';
  width?: string;
}) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.fieldLabel}>
        {label}
      </label>
      <span className={styles.fieldRow}>
        <input
          id={id}
          className={clsx(styles.input, verdict && (verdict.ok ? styles.inputOk : styles.inputKo))}
          style={{width}}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={locked}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          inputMode={inputMode}
          placeholder={placeholder}
        />
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </span>
    </div>
  );
}

/** Boutons de choix (QCM) : un clic valide la réponse. */
export function Choices<T extends string>({
  options,
  answer,
  locked,
  verdict,
  correct,
  onPick,
  mono,
}: {
  options: {value: T; label: ReactNode}[];
  answer: T | '';
  locked: boolean;
  verdict: Verdict | null;
  correct: T;
  onPick: (v: T) => void;
  mono?: boolean;
}) {
  return (
    <div className={styles.choices} role="group">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          data-choice
          className={clsx(
            styles.choice,
            mono && styles.mono,
            verdict && o.value === correct && styles.choiceOk,
            verdict && o.value === answer && o.value !== correct && styles.choiceKo,
          )}
          aria-pressed={answer === o.value}
          disabled={locked}
          onClick={() => onPick(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Étiquette de nombre avec sa base en indice : 1011₂. */
export function Num({value, base}: {value: string | number; base?: number}) {
  return (
    <span className={styles.num}>
      {value}
      {base !== undefined && <sub>{base}</sub>}
    </span>
  );
}

export {styles as trainerStyles};
