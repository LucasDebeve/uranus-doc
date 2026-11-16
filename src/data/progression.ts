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
      // Période 1
      {title: 'Règles de classe', from: '2026-09-01', to: '2026-09-04', kind: 'chapitre', doc: 'nsi/premiere/regles-classe'},
      {title: 'Numération: entier en base b', from: '2026-09-07', to: '2026-09-18', kind: 'chapitre'},
      {title: 'Python : variables, opérateurs et fonctions', from: '2026-09-21', to: '2026-10-02', kind: 'chapitre'},
      {title: 'TP compétences : tracés mathématiques', from: '2026-10-02', kind: 'evaluation'},
      {title: 'Les entiers relatifs', from: '2026-10-05', to: '2026-10-09', kind: 'chapitre'},
      {title: 'Valeurs Booléennes et conditions', from: '2026-10-12', to: '2026-10-16', kind: 'chapitre'},
      
      // Période 2
      {title: 'Boucles, tableaux et p-uplets (Spécification)', from: '2026-11-02', to: '2026-11-20', kind: 'chapitre'},
      {title: 'Architecture et système d’exploitation', from: '2026-11-23', to: '2026-11-27', kind: 'chapitre'}, 
      {title: 'TP compétences : embouteillage fantôme', from: '2026-11-27', kind: 'evaluation'},
      {title: 'Réseaux : adresses IP, masques, paquets, protocoles', from: '2026-11-30', to: '2026-12-18', kind: 'chapitre'},
      {title: 'TP compétences : LAN', from: '2026-12-18', kind: 'evaluation'},
      
      // Période 3
      {title: 'Plan de travail 1 : flottants, texte, tableaux en compréhension', from: '2027-01-04', to: '2027-01-22', kind: 'chapitre'},
      {title: 'TP compétences : Ariane 5', from: '2027-01-22', kind: 'evaluation'},
      {title: 'Parcours séquentiels de tableaux', from: '2027-01-25', to: '2027-02-05', kind: 'chapitre'},
      {title: 'TP compétences : embouteillage fantôme', from: '2027-02-05', kind: 'evaluation'},
      {title: 'Tris par sélection et par insertion', from: '2027-02-08', to: '2027-02-19', kind: 'chapitre'},
      
      // Période 4
      {title: 'Dictionnaires, tables CSV, tri et fusion', from: '2027-02-22', to: '2027-03-12', kind: 'chapitre'},
      {title: 'TP compétences : données ouvertes', from: '2027-03-12', kind: 'evaluation'},
      {title: 'Plan de travail 2 : Web (événements, interaction), client-serveur et formulaires', from: '2027-03-15', to: '2027-04-02', kind: 'chapitre'},
      {title: 'Algorithmes : dichotomie, k plus proches et gloutons', from: '2027-04-05', to: '2027-04-30', kind: 'chapitre'},

      // Période 5
      {title: 'Projet d’IHM (retour sur fonctions, tableaux 2D, tests)', from: '2027-05-03', to: '2027-05-21', kind: 'chapitre'},
      
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
