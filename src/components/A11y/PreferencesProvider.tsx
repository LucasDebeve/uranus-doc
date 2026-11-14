import React, {createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode} from 'react';
import {getSeasonById, getSeasonForDate, type Season} from '@site/src/seasons/seasons';

export const STORAGE_KEY = 'uranus-preferences';

export type FontChoice = 'default' | 'dyslexic' | 'system';

export type Preferences = {
  /** Multiplicateur de la taille du texte (1 = normal). */
  fontScale: number;
  font: FontChoice;
  /** Interlignage et espacements augmentés (WCAG 1.4.12). */
  spacing: boolean;
  contrast: boolean;
  underlineLinks: boolean;
  reduceMotion: boolean;
  /** 'auto' = selon la date, 'off' = aucun, sinon identifiant d'un thème pour le forcer. */
  season: string;
};

export const DEFAULT_PREFERENCES: Preferences = {
  fontScale: 1,
  font: 'default',
  spacing: false,
  contrast: false,
  underlineLinks: false,
  reduceMotion: false,
  season: 'auto',
};

type ContextValue = {
  preferences: Preferences;
  update: (changes: Partial<Preferences>) => void;
  reset: () => void;
  /** Animations à éviter : réglage du site OU réglage du système. */
  motionReduced: boolean;
  /** Thème saisonnier en cours (après prise en compte du réglage). */
  season: Season | undefined;
  settingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
};

const PreferencesContext = createContext<ContextValue | null>(null);

function readStored(): Preferences {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? {...DEFAULT_PREFERENCES, ...JSON.parse(raw)} : DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

function applyToDocument(p: Preferences, season: Season | undefined) {
  const root = document.documentElement;
  const setAttr = (name: string, value: string | false) =>
    value ? root.setAttribute(name, value) : root.removeAttribute(name);

  if (p.fontScale !== 1) root.style.setProperty('--uranus-font-scale', String(p.fontScale));
  else root.style.removeProperty('--uranus-font-scale');
  setAttr('data-a11y-font', p.font !== 'default' && p.font);
  setAttr('data-a11y-spacing', p.spacing && 'true');
  setAttr('data-a11y-contrast', p.contrast && 'high');
  setAttr('data-a11y-links', p.underlineLinks && 'underline');
  setAttr('data-a11y-motion', p.reduceMotion && 'reduce');
  setAttr('data-season', season?.id ?? false);
  if (season?.accent) root.style.setProperty('--uranus-season-accent', season.accent);
  else root.style.removeProperty('--uranus-season-accent');
}

function useSystemReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

export function PreferencesProvider({children}: {children?: ReactNode}) {
  // Valeurs par défaut au rendu serveur, puis lecture du stockage local une fois dans le navigateur.
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES);
  const [loaded, setLoaded] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [season, setSeason] = useState<Season | undefined>(undefined);
  const systemReduced = useSystemReducedMotion();

  useEffect(() => {
    setPreferences(readStored());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const resolved =
      preferences.season === 'off'
        ? undefined
        : preferences.season === 'auto'
          ? getSeasonForDate(new Date())
          : getSeasonById(preferences.season);
    setSeason(resolved);
    applyToDocument(preferences, resolved);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      // Stockage indisponible (navigation privée…) : les réglages valent pour cette visite.
    }
  }, [preferences, loaded]);

  const update = useCallback((changes: Partial<Preferences>) => {
    setPreferences((current) => ({...current, ...changes}));
  }, []);
  const reset = useCallback(() => setPreferences(DEFAULT_PREFERENCES), []);
  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  const value = useMemo<ContextValue>(
    () => ({
      preferences,
      update,
      reset,
      motionReduced: preferences.reduceMotion || systemReduced,
      season,
      settingsOpen,
      openSettings,
      closeSettings,
    }),
    [preferences, update, reset, systemReduced, season, settingsOpen, openSettings, closeSettings],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): ContextValue {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences doit être utilisé dans <PreferencesProvider>.');
  }
  return context;
}
