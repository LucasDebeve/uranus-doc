import React, {useEffect, useId, useRef, type ReactNode} from 'react';
import clsx from 'clsx';
import {useColorMode} from '@docusaurus/theme-common';
import {SEASONS, getSeasonForDate} from '@site/src/seasons/seasons';
import {usePreferences, type FontChoice} from './PreferencesProvider';
import styles from './styles.module.css';

const FONT_SCALES = [
  {value: 1, label: '100 %'},
  {value: 1.15, label: '115 %'},
  {value: 1.3, label: '130 %'},
  {value: 1.5, label: '150 %'},
];

const FONTS: {value: FontChoice; label: string; hint: string}[] = [
  {value: 'default', label: 'Atkinson Hyperlegible', hint: 'Police du site, conçue pour être très lisible.'},
  {value: 'dyslexic', label: 'OpenDyslexic', hint: 'Lettres lestées pour limiter les confusions (b/d, p/q).'},
  {value: 'system', label: 'Police de l’appareil', hint: 'Celle que vous utilisez habituellement.'},
];

function RadioGroup<T extends string | number>({
  legend,
  name,
  value,
  options,
  onChange,
  columns,
}: {
  legend: string;
  name: string;
  value: T;
  options: {value: T; label: string; hint?: string}[];
  onChange: (value: T) => void;
  columns?: boolean;
}) {
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>{legend}</legend>
      <div className={clsx(styles.options, columns && styles.optionsColumns)}>
        {options.map((option) => (
          <label key={String(option.value)} className={styles.option}>
            <input
              type="radio"
              name={name}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span className={styles.optionText}>
              <span>{option.label}</span>
              {option.hint && <span className={styles.hint}>{option.hint}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Switch({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const id = useId();
  return (
    <div className={styles.switchRow}>
      <label htmlFor={id} className={styles.optionText}>
        <span>{label}</span>
        {hint && <span className={styles.hint} id={`${id}-hint`}>{hint}</span>}
      </label>
      <input
        id={id}
        type="checkbox"
        role="switch"
        className={styles.switch}
        checked={checked}
        aria-describedby={hint ? `${id}-hint` : undefined}
        onChange={(e) => onChange(e.target.checked)}
      />
    </div>
  );
}

export default function SettingsDialog(): ReactNode {
  const {preferences: p, update, reset, settingsOpen, closeSettings} = usePreferences();
  const {colorModeChoice, setColorMode} = useColorMode();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (settingsOpen && !dialog.open) dialog.showModal();
    if (!settingsOpen && dialog.open) dialog.close();
  }, [settingsOpen]);

  const autoSeason = typeof window === 'undefined' ? undefined : getSeasonForDate(new Date());

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      onClose={closeSettings}
      onClick={(e) => {
        // Clic sur le fond assombri : fermeture.
        if (e.target === dialogRef.current) closeSettings();
      }}>
      <div className={styles.panel}>
        <header className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            Réglages d’affichage
          </h2>
          <button type="button" className={styles.close} onClick={closeSettings} aria-label="Fermer les réglages">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
        </header>
        <p className={styles.intro}>
          Ces réglages s’appliquent tout de suite et sont mémorisés sur cet appareil.
        </p>

        <div className={styles.body}>
          <section className={styles.section} aria-label="Apparence">
            <RadioGroup
              legend="Thème"
              name="color-mode"
              value={colorModeChoice ?? 'system'}
              options={[
                {value: 'light', label: 'Clair'},
                {value: 'dark', label: 'Sombre'},
                {value: 'system', label: 'Comme l’appareil'},
              ]}
              onChange={(v) => setColorMode(v === 'system' ? null : (v as 'light' | 'dark'))}
            />
            <Switch
              label="Contraste renforcé"
              hint="Textes plus foncés, bordures plus marquées."
              checked={p.contrast}
              onChange={(contrast) => update({contrast})}
            />
          </section>

          <section className={styles.section} aria-label="Lecture">
            <RadioGroup
              legend="Taille du texte"
              name="font-scale"
              value={p.fontScale}
              options={FONT_SCALES}
              onChange={(fontScale) => update({fontScale})}
            />
            <RadioGroup
              legend="Police"
              name="font"
              value={p.font}
              options={FONTS}
              onChange={(font) => update({font})}
              columns
            />
            <Switch
              label="Espacer le texte"
              hint="Plus d’espace entre les lignes, les mots et les lettres."
              checked={p.spacing}
              onChange={(spacing) => update({spacing})}
            />
            <Switch
              label="Souligner tous les liens"
              checked={p.underlineLinks}
              onChange={(underlineLinks) => update({underlineLinks})}
            />
          </section>

          <section className={styles.section} aria-label="Animations">
            <Switch
              label="Réduire les animations"
              hint="Coupe les animations, les transitions et les effets saisonniers."
              checked={p.reduceMotion}
              onChange={(reduceMotion) => update({reduceMotion})}
            />
            <div className={styles.selectRow}>
              <label htmlFor="uranus-season" className={styles.optionText}>
                <span>Thèmes saisonniers</span>
                <span className={styles.hint}>Flocons en hiver, chauves-souris à Halloween…</span>
              </label>
              <select
                id="uranus-season"
                className={styles.select}
                value={p.season}
                onChange={(e) => update({season: e.target.value})}>
                <option value="auto">
                  Automatique{autoSeason ? ` (${autoSeason.label.toLowerCase()})` : ' (aucun en ce moment)'}
                </option>
                <option value="off">Désactivés</option>
                <optgroup label="Essayer un thème">
                  {SEASONS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          </section>
        </div>

        <footer className={styles.footer}>
          <button type="button" className={styles.secondaryButton} onClick={() => { reset(); setColorMode(null); }}>
            Tout réinitialiser
          </button>
          <button type="button" className={styles.primaryButton} onClick={closeSettings}>
            Terminé
          </button>
        </footer>
      </div>
    </dialog>
  );
}
