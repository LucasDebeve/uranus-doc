import React, {type ReactNode} from 'react';
import {PreferencesProvider} from '@site/src/components/A11y/PreferencesProvider';
import {useTrackLastVisitedDoc} from '@site/src/components/Home/lastVisited';

// Polices auto-hébergées (aucune requête vers un service tiers).
import '@fontsource-variable/space-grotesk';
import '@fontsource/atkinson-hyperlegible/400.css';
import '@fontsource/atkinson-hyperlegible/400-italic.css';
import '@fontsource/atkinson-hyperlegible/700.css';
import '@fontsource/opendyslexic/400.css';
import '@fontsource/opendyslexic/700.css';

function LastVisitTracker() {
  useTrackLastVisitedDoc();
  return null;
}

/** Enveloppe toute l'application (au-dessus de chaque page). */
export default function Root({children}: {children: ReactNode}): ReactNode {
  return (
    <PreferencesProvider>
      <LastVisitTracker />
      {children}
    </PreferencesProvider>
  );
}
