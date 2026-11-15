/**
 * Calendrier de l'année, par niveau. Affiché sur les pages « Progression de l'année »
 * (docs/snt/progression.mdx, docs/nsi/premiere/progression.mdx, docs/nsi/terminale/progression.mdx).
 *
 * ⚠️ Les dates ci-dessous sont un EXEMPLE de progression : à ajuster avant publication.
 *
 * Chaque ligne :
 *   - title : intitulé affiché
 *   - from  : date de début (AAAA-MM-JJ) ; pour une évaluation, c'est sa date
 *   - to    : date de fin (facultatif, même jour que `from` si absent)
 *   - kind  : 'chapitre' | 'projet' | 'evaluation' | 'vacances'
 *   - doc   : identifiant de la page de cours à lier (chemin dans docs/, sans extension), facultatif
 *   - note  : précision affichée sous le titre (facultatif)
 *
 * L'état « Vu / En cours / À venir » est calculé automatiquement à partir de la date du jour.
 */

export type ProgressionKind = 'chapitre' | 'projet' | 'evaluation' | 'vacances';

export type ProgressionEntry = {
  title: string;
  from: string;
  to?: string;
  kind: ProgressionKind;
  doc?: string;
  note?: string;
};

export type ProgressionLevel = 'snt' | 'nsiPremiere' | 'nsiTerminale';

export type Progression = {
  label: string;
  schoolYear: string;
  entries: ProgressionEntry[];
};

/** Vacances communes à toutes les zones ; ajoutez celles d'hiver et de printemps de votre zone. */
const VACANCES: ProgressionEntry[] = [
  {title: 'Vacances de la Toussaint', from: '2026-10-17', to: '2026-11-01', kind: 'vacances'},
  {title: 'Vacances de Noël', from: '2026-12-19', to: '2027-01-03', kind: 'vacances'},
];

export const PROGRESSIONS: Record<ProgressionLevel, Progression> = {
  snt: {
    label: 'SNT — Seconde',
    schoolYear: '2026-2027',
    entries: [
      {title: 'Présentation de la SNT', from: '2026-09-01', to: '2026-09-11', kind: 'chapitre', doc: 'snt/presentation'},
      {title: 'Internet', from: '2026-09-14', to: '2026-10-16', kind: 'chapitre'},
      {title: 'Évaluation : Internet', from: '2026-10-16', kind: 'evaluation'},
      {title: 'Le Web', from: '2026-11-02', to: '2026-12-11', kind: 'chapitre'},
      {title: 'Évaluation : Le Web', from: '2026-12-11', kind: 'evaluation'},
      {title: 'Les réseaux sociaux', from: '2026-12-14', to: '2027-01-29', kind: 'chapitre'},
      {title: 'Les données structurées', from: '2027-02-01', to: '2027-03-12', kind: 'chapitre'},
      {title: 'Évaluation : données structurées', from: '2027-03-12', kind: 'evaluation'},
      {title: 'Localisation, cartographie et mobilité', from: '2027-03-15', to: '2027-04-16', kind: 'chapitre'},
      {title: 'La photographie numérique', from: '2027-04-19', to: '2027-05-21', kind: 'chapitre'},
      {title: 'Informatique embarquée et objets connectés', from: '2027-05-24', to: '2027-06-18', kind: 'projet', note: 'Mini-projet en groupe'},
      ...VACANCES,
    ],
  },

  nsiPremiere: {
    label: 'NSI — Première',
    schoolYear: '2026-2027',
    entries: [
      {title: 'Règles de classe', from: '2026-09-01', to: '2026-09-04', kind: 'chapitre', doc: 'nsi/premiere/regles-classe'},
      {title: 'Python : types et valeurs de base', from: '2026-09-07', to: '2026-10-02', kind: 'chapitre'},
      {title: 'Évaluation : bases de Python', from: '2026-10-02', kind: 'evaluation'},
      {title: 'Projet : le jeu du pendu', from: '2026-10-05', to: '2026-10-16', kind: 'projet', doc: 'nsi/premiere/pendu/introduction'},
      {title: 'Algorithmique : le crêpier psychorigide', from: '2026-11-02', to: '2026-11-13', kind: 'chapitre', doc: 'nsi/premiere/algorithmique/crepier', note: 'Activité débranchée'},
      {title: 'Rendu du projet pendu', from: '2026-11-06', kind: 'evaluation'},
      {title: 'Représentation des données : types et valeurs de base', from: '2026-11-16', to: '2026-12-18', kind: 'chapitre', doc: 'nsi/premiere/representation-donnees/entiers-positifs'},
      {title: 'Évaluation : représentation des données', from: '2026-12-18', kind: 'evaluation'},
      {title: 'Données en table (CSV)', from: '2027-01-04', to: '2027-02-05', kind: 'chapitre'},
      {title: 'Architecture et système d’exploitation', from: '2027-02-08', to: '2027-03-19', kind: 'chapitre'},
      {title: 'Algorithmes de tri', from: '2027-03-22', to: '2027-04-23', kind: 'chapitre'},
      {title: 'Évaluation : algorithmes de tri', from: '2027-04-23', kind: 'evaluation'},
      {title: 'Interactions sur le Web', from: '2027-04-26', to: '2027-05-21', kind: 'chapitre'},
      {title: 'Projet de fin d’année', from: '2027-05-24', to: '2027-06-18', kind: 'projet'},
      ...VACANCES,
    ],
  },

  nsiTerminale: {
    label: 'NSI — Terminale',
    schoolYear: '2026-2027',
    entries: [
      {title: 'Bases de données : introduction', from: '2026-09-01', to: '2026-09-25', kind: 'chapitre', doc: 'nsi/terminale/bdd/introduction'},
      {title: 'Le langage SQL', from: '2026-09-28', to: '2026-10-16', kind: 'chapitre', doc: 'nsi/terminale/bdd/sql_base'},
      {title: 'Évaluation : bases de données et SQL', from: '2026-10-16', kind: 'evaluation'},
      {title: 'Récursivité', from: '2026-11-02', to: '2026-11-27', kind: 'chapitre'},
      {title: 'Évaluation : récursivité', from: '2026-11-27', kind: 'evaluation'},
      {title: 'Programmation orientée objet', from: '2026-11-30', to: '2026-12-18', kind: 'chapitre'},
      {title: 'Listes, piles et files', from: '2027-01-04', to: '2027-01-29', kind: 'chapitre'},
      {title: 'Arbres', from: '2027-02-01', to: '2027-03-05', kind: 'chapitre'},
      {title: 'Bac blanc', from: '2027-03-10', kind: 'evaluation'},
      {title: 'Graphes', from: '2027-03-08', to: '2027-04-09', kind: 'chapitre'},
      {title: 'Révisions et épreuve pratique', from: '2027-04-12', to: '2027-05-28', kind: 'projet'},
      ...VACANCES,
    ],
  },
};
