import React, {useCallback, useEffect, useId, useState, type ReactNode} from 'react';
import clsx from 'clsx';
import confetti from 'canvas-confetti';
import {usePreferences} from '@site/src/components/A11y/PreferencesProvider';
import {HISTOIRE, type HistoireEvent, type HistoireTheme} from '@site/src/data/histoire';
import {shuffle} from '../core/utils';
import styles from './styles.module.css';

type Level = 'facile' | 'moyen' | 'expert';

const LEVELS: Record<Level, {label: string; count: number; showYears: boolean; hint: string}> = {
  facile: {label: 'Facile', count: 4, showYears: true, hint: '4 événements, les années sont données'},
  moyen: {label: 'Moyen', count: 6, showYears: true, hint: '6 événements, les années sont données'},
  expert: {label: 'Expert', count: 6, showYears: false, hint: '6 événements, à remettre dans l’ordre sans les années'},
};

type Round = {
  events: HistoireEvent[]; // pioche, dans un ordre mélangé
  years: number[]; // années des emplacements, croissantes
};

type Props = {
  /** Limiter à certains thèmes (machines, langages, reseaux, donnees, ia). */
  themes?: HistoireTheme[];
  /** Niveau proposé au départ. */
  niveau?: Level;
  title?: string;
};

function newRound(pool: HistoireEvent[], count: number): Round {
  // Des années toutes différentes, pour qu'il n'y ait qu'une bonne réponse.
  const picked: HistoireEvent[] = [];
  for (const e of shuffle(pool)) {
    if (!picked.some((p) => p.year === e.year)) picked.push(e);
    if (picked.length === count) break;
  }
  return {events: shuffle(picked), years: picked.map((e) => e.year).sort((a, b) => a - b)};
}

function celebrate() {
  const colors = ['#7de3e1', '#ff8b5e', '#ffffff', '#0b7285'];
  const end = Date.now() + 900;
  (function frame() {
    confetti({particleCount: 3, angle: 60, spread: 60, origin: {x: 0, y: 0.7}, colors});
    confetti({particleCount: 3, angle: 120, spread: 60, origin: {x: 1, y: 0.7}, colors});
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

const ordinal = (i: number) => (i === 0 ? '1er' : `${i + 1}e`);

export default function FriseChronologique({themes, niveau = 'facile', title = 'La frise de l’informatique'}: Props): ReactNode {
  const {motionReduced} = usePreferences();
  const pool = themes ? HISTOIRE.filter((e) => themes.includes(e.theme)) : HISTOIRE;

  const [level, setLevel] = useState<Level>(niveau);
  const [round, setRound] = useState<Round | null>(null);
  /** placement[i] = index (dans round.events) de la carte posée sur l'emplacement i */
  const [placement, setPlacement] = useState<(number | null)[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [stats, setStats] = useState({rounds: 0, points: 0, max: 0, perfects: 0});
  const [announce, setAnnounce] = useState('');
  const titleId = useId();

  const start = useCallback(
    (lvl: Level) => {
      const r = newRound(pool, Math.min(LEVELS[lvl].count, pool.length));
      setRound(r);
      setPlacement(r.years.map(() => null));
      setSelected(null);
      setChecked(false);
      setAnnounce('Nouvelle manche.');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [themes?.join()],
  );

  // Tirage dans le navigateur seulement.
  useEffect(() => start(level), [level, start]);

  if (!round) {
    return (
      <section className={styles.frise} aria-labelledby={titleId}>
        <h3 id={titleId} className={styles.title}>
          {title}
        </h3>
        <p className={styles.help}>Chargement de la frise…</p>
      </section>
    );
  }

  const showYears = LEVELS[level].showYears;
  const slotOf = (eventIndex: number) => placement.indexOf(eventIndex);
  const allPlaced = placement.every((p) => p !== null);
  const isCorrect = (slot: number) => placement[slot] !== null && round.events[placement[slot]!].year === round.years[slot];
  const correctCount = round.years.filter((_, i) => isCorrect(i)).length;
  const slotName = (i: number) => (showYears ? String(round.years[i]) : `${ordinal(i)} emplacement`);

  const place = (eventIndex: number, slot: number) => {
    if (checked) return;
    setPlacement((current) => {
      const next = [...current];
      const from = next.indexOf(eventIndex);
      const occupant = next[slot];
      if (from !== -1) next[from] = occupant; // échange si la carte venait d'un autre emplacement
      else if (occupant !== null) next[slot] = null;
      next[slot] = eventIndex;
      return next;
    });
    setSelected(null);
    setAnnounce(`« ${round.events[eventIndex].title} » placé sur ${slotName(slot)}.`);
  };

  const onSlot = (slot: number) => {
    if (checked) return;
    if (selected !== null) {
      place(selected, slot);
    } else if (placement[slot] !== null) {
      // Retirer la carte de l'emplacement pour la reprendre en main.
      setSelected(placement[slot]);
      setAnnounce(`« ${round.events[placement[slot]!].title} » sélectionné. Choisis un emplacement.`);
    }
  };

  const onCard = (eventIndex: number) => {
    if (checked) return;
    setSelected((s) => (s === eventIndex ? null : eventIndex));
    setAnnounce(`« ${round.events[eventIndex].title} » sélectionné. Choisis un emplacement.`);
  };

  const unplace = (slot: number) => {
    setPlacement((current) => current.map((p, i) => (i === slot ? null : p)));
  };

  const validate = () => {
    setChecked(true);
    setSelected(null);
    const perfect = correctCount === round.years.length;
    setStats((s) => ({
      rounds: s.rounds + 1,
      points: s.points + correctCount,
      max: s.max + round.years.length,
      perfects: s.perfects + (perfect ? 1 : 0),
    }));
    setAnnounce(
      perfect
        ? `Sans faute ! ${correctCount} sur ${round.years.length}.`
        : `${correctCount} bonne${correctCount > 1 ? 's' : ''} réponse${correctCount > 1 ? 's' : ''} sur ${round.years.length}.`,
    );
    if (perfect && !motionReduced) celebrate();
  };

  const stars = checked ? (correctCount === round.years.length ? 3 : correctCount >= round.years.length / 2 ? 2 : correctCount > 0 ? 1 : 0) : 0;
  const pile = round.events.map((e, i) => ({e, i})).filter(({i}) => slotOf(i) === -1);

  return (
    <section className={styles.frise} aria-labelledby={titleId}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Jeu</p>
          <h3 id={titleId} className={styles.title}>
            {title}
          </h3>
        </div>
        <div className={styles.stats} aria-label="Score">
          <span>
            <strong>{stats.points}</strong> pt{stats.points > 1 ? 's' : ''}
          </span>
          <span>
            Manche <strong>{stats.rounds + (checked ? 0 : 1)}</strong>
          </span>
          {stats.perfects > 0 && (
            <span>
              <strong>{stats.perfects}</strong> sans-faute
            </span>
          )}
        </div>
      </header>

      <div className={styles.levels} role="radiogroup" aria-label="Niveau">
        {(Object.keys(LEVELS) as Level[]).map((l) => (
          <button
            key={l}
            type="button"
            role="radio"
            aria-checked={level === l}
            className={clsx(styles.level, level === l && styles.levelActive)}
            onClick={() => setLevel(l)}
            title={LEVELS[l].hint}>
            {LEVELS[l].label}
          </button>
        ))}
      </div>

      <p className={styles.help}>
        {showYears ? 'Place chaque événement sur son année.' : 'Remets les événements dans l’ordre chronologique, du plus ancien au plus récent.'}{' '}
        Touche une carte, puis un emplacement (ou fais-la glisser).
      </p>

      {/* Pioche */}
      {!checked && (
        <div
          className={styles.pile}
          aria-label="Cartes à placer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            const idx = Number(e.dataTransfer.getData('text/plain'));
            const slot = slotOf(idx);
            if (slot !== -1) unplace(slot);
          }}>
          {pile.length === 0 ? (
            <p className={styles.pileEmpty}>Toutes les cartes sont placées. Tu peux valider !</p>
          ) : (
            pile.map(({e, i}) => (
              <button
                key={e.title}
                type="button"
                className={clsx(styles.card, selected === i && styles.cardSelected)}
                aria-pressed={selected === i}
                draggable
                onDragStart={(ev) => ev.dataTransfer.setData('text/plain', String(i))}
                onClick={() => onCard(i)}>
                {e.title}
              </button>
            ))
          )}
        </div>
      )}

      {/* Frise */}
      <ol className={styles.timeline}>
        {round.years.map((year, slot) => {
          const idx = placement[slot];
          const ev = idx !== null ? round.events[idx] : null;
          const ok = checked && isCorrect(slot);
          const expected = round.events.find((e) => e.year === year)!;
          return (
            <li key={year} className={clsx(styles.row, checked && (ok ? styles.rowOk : styles.rowKo))}>
              <span className={styles.year}>{showYears || checked ? year : ordinal(slot)}</span>
              <span className={styles.node} aria-hidden="true" />
              <div className={styles.slotWrap}>
                <button
                  type="button"
                  className={clsx(styles.slot, ev && styles.slotFilled, selected !== null && !ev && styles.slotTarget)}
                  disabled={checked}
                  aria-label={`${slotName(slot)} : ${ev ? ev.title : 'vide'}`}
                  onClick={() => onSlot(slot)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    place(Number(e.dataTransfer.getData('text/plain')), slot);
                  }}>
                  {ev ? (
                    <span
                      className={styles.placed}
                      draggable={!checked}
                      onDragStart={(e) => idx !== null && e.dataTransfer.setData('text/plain', String(idx))}>
                      {ev.title}
                    </span>
                  ) : (
                    <span className={styles.empty}>{selected !== null ? 'Placer ici' : 'Vide'}</span>
                  )}
                </button>
                {checked && (
                  <div className={styles.reveal}>
                    <span className={styles.mark}>{ok ? 'Juste' : 'Faux'}</span>
                    {!ok && (
                      <span>
                        En {year} : <strong>{expected.title}</strong>
                        {ev && ` (« ${ev.title} » date de ${ev.year})`}.
                      </span>
                    )}
                    <span className={styles.detail}>{expected.detail}</span>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <div role="status" aria-live="polite" className={styles.live}>
        {announce}
      </div>

      <footer className={styles.footer}>
        {checked ? (
          <>
            <p className={styles.result}>
              <span className={styles.stars} aria-label={`${stars} étoile${stars > 1 ? 's' : ''} sur 3`}>
                {[0, 1, 2].map((k) => (
                  <svg key={k} viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" className={k < stars ? styles.starOn : styles.starOff}>
                    <path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" />
                  </svg>
                ))}
              </span>
              {correctCount === round.years.length ? 'Sans faute !' : `${correctCount} / ${round.years.length} bien placés`}
            </p>
            <button type="button" className={styles.primary} onClick={() => start(level)}>
              Manche suivante
            </button>
          </>
        ) : (
          <>
            <button type="button" className={styles.primary} disabled={!allPlaced} onClick={validate}>
              Valider la frise
            </button>
            <button
              type="button"
              className={styles.secondary}
              disabled={placement.every((p) => p === null)}
              onClick={() => {
                setPlacement(round.years.map(() => null));
                setSelected(null);
              }}>
              Tout retirer
            </button>
          </>
        )}
      </footer>
    </section>
  );
}
