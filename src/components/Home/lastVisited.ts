import {useEffect, useState} from 'react';
import {useLocation} from '@docusaurus/router';

const KEY = 'uranus-last-doc';

export type LastVisitedDoc = {path: string; title: string; section?: string};

/** Mémorise (dans ce navigateur uniquement) le dernier chapitre de cours consulté. */
export function useTrackLastVisitedDoc(): void {
  const {pathname} = useLocation();
  useEffect(() => {
    // Seulement les chapitres SNT / NSI (pas les pages d'index de niveau).
    if (!/^\/docs\/[^/]+\/(snt\/.+|nsi\/(premiere|terminale)\/.+)/.test(pathname)) return;
    const timer = window.setTimeout(() => {
      const heading = document.querySelector('article h1, article header h1');
      const title = heading?.textContent?.trim() || document.title.split('|')[0].trim();
      const section = pathname.includes('/snt/')
        ? 'SNT'
        : pathname.includes('/nsi/premiere/')
          ? 'NSI Première'
          : pathname.includes('/nsi/terminale/')
            ? 'NSI Terminale'
            : undefined;
      try {
        window.localStorage.setItem(KEY, JSON.stringify({path: pathname, title, section}));
      } catch {
        // stockage indisponible : tant pis
      }
    }, 400);
    return () => window.clearTimeout(timer);
  }, [pathname]);
}

export function useLastVisitedDoc(): LastVisitedDoc | null {
  const [doc, setDoc] = useState<LastVisitedDoc | null>(null);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setDoc(JSON.parse(raw));
    } catch {
      setDoc(null);
    }
  }, []);
  return doc;
}
