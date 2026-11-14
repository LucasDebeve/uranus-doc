import React, {type ReactNode} from 'react';
import {usePreferences} from './PreferencesProvider';
import {A11yIcon} from './SettingsNavbarItem';

/** Bouton utilisable dans une page MDX pour ouvrir le panneau de réglages. */
export default function OpenSettingsButton({children = 'Ouvrir les réglages'}: {children?: ReactNode}): ReactNode {
  const {openSettings} = usePreferences();
  return (
    <button
      type="button"
      className="button button--primary button--lg"
      style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem'}}
      onClick={openSettings}>
      <A11yIcon /> {children}
    </button>
  );
}
