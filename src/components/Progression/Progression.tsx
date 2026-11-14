import React, {useEffect, useState, type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {useActiveVersion} from '@docusaurus/plugin-content-docs/client';
import {
  PROGRESSIONS,
  type ProgressionEntry,
  type ProgressionKind,
  type ProgressionLevel,
} from '@site/src/data/progression';
import styles from './styles.module.css';

type Status = 'past' | 'current' | 'upcoming';

const KIND_LABEL: Record<ProgressionKind, string> = {
  chapitre: 'Chapitre',
  projet: 'Projet',
  evaluation: 'Évaluation',
  vacances: 'Vacances',
};

const STATUS_LABEL: Record<Status, string> = {
  past: 'Vu',
  current: 'En cours',
  upcoming: 'À venir',
};

const parse = (iso: string) => new Date(`${iso}T00:00:00`);
const DAY = 24 * 60 * 60 * 1000;

const fmtDay = new Intl.DateTimeFormat('fr-FR', {day: 'numeric', month: 'short'});
const fmtLong = new Intl.DateTimeFormat('fr-FR', {weekday: 'long', day: 'numeric', month: 'long'});
const fmtMonth = new Intl.DateTimeFormat('fr-FR', {month: 'long', year: 'numeric'});

function statusOf(entry: ProgressionEntry, today: Date): Status {
  const from = parse(entry.from);
  const to = parse(entry.to ?? entry.from);
  if (today > to) return 'past';
  if (today >= from) return 'current';
  return 'upcoming';
}

function dateRange(entry: ProgressionEntry): string {
  if (!entry.to || entry.to === entry.from) return fmtDay.format(parse(entry.from));
  return `${fmtDay.format(parse(entry.from))} → ${fmtDay.format(parse(entry.to))}`;
}

function inDays(target: Date, today: Date): string {
  const days = Math.round((target.getTime() - today.getTime()) / DAY);
  if (days === 0) return "aujourd'hui";
  if (days === 1) return 'demain';
  return `dans ${days} jours`;
}

/** Date du jour, uniquement côté navigateur (le site est généré à l'avance : la date du build serait fausse). */
function useToday(): Date | null {
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => {
    const now = new Date();
    setToday(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
  }, []);
  return today;
}

function useDocPath() {
  const version = useActiveVersion(undefined);
  return (docId?: string) => (docId ? version?.docs.find((d) => d.id === docId)?.path : undefined);
}

function Summary({entries, today}: {entries: ProgressionEntry[]; today: Date}) {
  const current = entries.filter((e) => statusOf(e, today) === 'current');
  const holidays = current.find((e) => e.kind === 'vacances');
  const nowStudying = current.filter((e) => e.kind === 'chapitre' || e.kind === 'projet');
  const nextEval = entries
    .filter((e) => e.kind === 'evaluation' && parse(e.from) >= today)
    .sort((a, b) => a.from.localeCompare(b.from))[0];
  const nextChapter = entries
    .filter((e) => (e.kind === 'chapitre' || e.kind === 'projet') && statusOf(e, today) === 'upcoming')
    .sort((a, b) => a.from.localeCompare(b.from))[0];

  return (
    <div className={styles.summary}>
      <div className={styles.summaryItem}>
        <p className={styles.summaryLabel}>En ce moment</p>
        <p className={styles.summaryValue}>
          {holidays
            ? holidays.title
            : nowStudying.length > 0
              ? nowStudying.map((e) => e.title).join(' · ')
              : nextChapter
                ? `Prochain chapitre : ${nextChapter.title}`
                : 'Fin de l’année'}
        </p>
      </div>
      <div className={clsx(styles.summaryItem, nextEval && styles.summaryEval)}>
        <p className={styles.summaryLabel}>Prochaine évaluation</p>
        {nextEval ? (
          <p className={styles.summaryValue}>
            {nextEval.title}
            <span className={styles.summaryDate}>
              {fmtLong.format(parse(nextEval.from))} ({inDays(parse(nextEval.from), today)})
            </span>
          </p>
        ) : (
          <p className={styles.summaryValue}>Aucune évaluation prévue</p>
        )}
      </div>
    </div>
  );
}

/** Calendrier de l'année d'un niveau : à placer dans une page MDX (`<Progression level="nsiPremiere" />`). */
export default function Progression({level}: {level: ProgressionLevel}): ReactNode {
  const progression = PROGRESSIONS[level];
  const today = useToday();
  const docPath = useDocPath();

  const entries = [...progression.entries].sort(
    (a, b) => a.from.localeCompare(b.from) || (a.kind === 'evaluation' ? 1 : 0) - (b.kind === 'evaluation' ? 1 : 0),
  );

  // Regroupement par mois de début.
  const months: {key: string; label: string; items: ProgressionEntry[]}[] = [];
  for (const entry of entries) {
    const key = entry.from.slice(0, 7);
    let month = months.find((m) => m.key === key);
    if (!month) {
      month = {key, label: fmtMonth.format(parse(entry.from)), items: []};
      months.push(month);
    }
    month.items.push(entry);
  }

  return (
    <div className={styles.progression}>
      <p className={styles.year}>Année {progression.schoolYear}</p>
      {today ? <Summary entries={entries} today={today} /> : <div className={styles.summaryPlaceholder} />}

      <ul className={styles.legend} aria-label="Légende">
        {(['chapitre', 'projet', 'evaluation', 'vacances'] as ProgressionKind[]).map((kind) => (
          <li key={kind} className={styles.legendItem} data-kind={kind}>
            <span className={styles.dot} aria-hidden="true" />
            {KIND_LABEL[kind]}
          </li>
        ))}
      </ul>

      {months.map((month) => (
        <section key={month.key} className={styles.month} aria-labelledby={`mois-${month.key}`}>
          <h2 id={`mois-${month.key}`} className={styles.monthTitle}>
            {month.label}
          </h2>
          <ol className={styles.list}>
            {month.items.map((entry) => {
              const status = today ? statusOf(entry, today) : undefined;
              const path = docPath(entry.doc);
              return (
                <li
                  key={`${entry.from}-${entry.title}`}
                  className={clsx(styles.item, status && styles[status])}
                  data-kind={entry.kind}>
                  <span className={styles.dot} aria-hidden="true" />
                  <span className={styles.dates}>{dateRange(entry)}</span>
                  <span className={styles.body}>
                    <span className={styles.kind}>{KIND_LABEL[entry.kind]}</span>
                    <span className={styles.title}>
                      {path ? <Link to={path}>{entry.title}</Link> : entry.title}
                    </span>
                    {entry.note && <span className={styles.note}>{entry.note}</span>}
                  </span>
                  {status && entry.kind !== 'vacances' && (
                    <span className={clsx(styles.status, styles[`status_${status}`])}>{STATUS_LABEL[status]}</span>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
