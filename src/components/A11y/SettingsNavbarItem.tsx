import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {usePreferences} from './PreferencesProvider';
import styles from './styles.module.css';

/** Icône « accessibilité » (silhouette bras ouverts). */
export function A11yIcon({size = 20}: {size?: number}) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <circle cx="12" cy="4.2" r="2.2" fill="currentColor" />
      <path
        d="M4 8.2c2.6.8 5.3 1.2 8 1.2s5.4-.4 8-1.2M12 9.4v5.2m0 0-3.2 6.4M12 14.6l3.2 6.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Props = {mobile?: boolean; className?: string};

/** Élément de barre de navigation (type `custom-a11ySettings` dans docusaurus.config.ts). */
export default function SettingsNavbarItem({mobile, className}: Props): ReactNode {
  const {openSettings, settingsOpen} = usePreferences();

  if (mobile) {
    return (
      <li className="menu__list-item">
        <button
          type="button"
          className={clsx('menu__link', styles.mobileTrigger, className)}
          aria-haspopup="dialog"
          aria-expanded={settingsOpen}
          onClick={openSettings}>
          <A11yIcon /> Réglages d’affichage
        </button>
      </li>
    );
  }

  return (
    <button
      type="button"
      className={clsx(styles.trigger, className)}
      aria-haspopup="dialog"
      aria-expanded={settingsOpen}
      onClick={openSettings}
      title="Réglages d’affichage et d’accessibilité">
      <A11yIcon />
      <span className={styles.triggerLabel}>Réglages</span>
    </button>
  );
}
