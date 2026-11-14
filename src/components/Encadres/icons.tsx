import React from 'react';

const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
};

/** Cible : ce qu'on vise. */
export const IconObjectifs = () => (
  <svg {...base}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.2" fill="currentColor" />
  </svg>
);

/** Punaise : à garder en tête. */
export const IconRetenir = () => (
  <svg {...base}>
    <path d="M9 3h6l-1 6 4 3v2H6v-2l4-3z" />
    <path d="M12 14v7" />
  </svg>
);

/** Crayon : à toi de jouer. */
export const IconExercice = () => (
  <svg {...base}>
    <path d="M4 20l4-1 11-11-3-3L5 16z" />
    <path d="M14 7l3 3" />
  </svg>
);

/** Coche : la solution. */
export const IconCorrection = () => (
  <svg {...base}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12.5l2.8 2.8L16 10" />
  </svg>
);

/** Étapes numérotées : une marche à suivre. */
export const IconMethode = () => (
  <svg {...base}>
    <path d="M10 6h10M10 12h10M10 18h10" />
    <path d="M4 5l1.5-1V8M3.8 14h2.4L4 17h2.4" strokeWidth="1.6" />
  </svg>
);

/** Livre ouvert : les mots du cours. */
export const IconVocabulaire = () => (
  <svg {...base}>
    <path d="M12 6c-2-1.5-5-2-8-1.5V19c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V4.5c-3-.5-6 0-8 1.5z" />
    <path d="M12 6v14.5" />
  </svg>
);

export const IconChevron = () => (
  <svg {...base} width={16} height={16}>
    <path d="M9 6l6 6-6 6" />
  </svg>
);
