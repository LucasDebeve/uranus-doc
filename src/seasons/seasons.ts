/**
 * Thèmes saisonniers du site.
 *
 * Chaque thème est actif automatiquement entre deux dates (jour et mois, bornes incluses).
 * Une période peut chevaucher le Nouvel An (ex. du 1er décembre au 28 février).
 * Quand plusieurs thèmes sont actifs le même jour, c'est le PREMIER de la liste qui gagne :
 * placez donc les événements courts (π, Halloween…) avant les saisons longues.
 *
 * Pour ajouter un événement : ajoutez une entrée à `SEASONS`, choisissez un effet
 * existant dans `particles` (voir `SeasonalEffects.tsx`) et, si besoin, une couleur d'accent.
 */

export type ParticleKind = 'snow' | 'bats' | 'pi' | 'petals' | 'leaves';

export type Season = {
  id: string;
  /** Nom affiché dans les réglages. */
  label: string;
  /** Petit message affiché sur la page d'accueil pendant la période. */
  message: string;
  /** [mois (1-12), jour] */
  from: [number, number];
  to: [number, number];
  particles: ParticleKind;
  /** Couleur d'accent qui remplace l'orange « orbite » pendant la période. */
  accent?: string;
};

export const SEASONS: Season[] = [
  {
    id: 'piday',
    label: 'Journée de π',
    message: '14 mars, journée de π : 3,14159 26535 89793…',
    from: [3, 14],
    to: [3, 14],
    particles: 'pi',
  },
  {
    id: 'halloween',
    label: 'Halloween',
    message: 'Halloween : des bugs rôdent dans le code. Restez vigilants.',
    from: [10, 20],
    to: [11, 2],
    particles: 'bats',
    accent: '#ff7a1a',
  },
  {
    id: 'hiver',
    label: 'Hiver',
    message: "C'est l'hiver. Sur Uranus, il fait −224 °C : la planète la plus froide du système solaire.",
    from: [12, 1],
    to: [2, 28],
    particles: 'snow',
    accent: '#8ec5ff',
  },
  {
    id: 'printemps',
    label: 'Printemps',
    message: 'Le printemps est là, et les épreuves approchent : bon courage pour les révisions !',
    from: [3, 20],
    to: [4, 30],
    particles: 'petals',
    accent: '#f48fb1',
  },
  {
    id: 'automne',
    label: 'Automne',
    message: 'Bonne rentrée ! Les feuilles tombent, les chapitres arrivent.',
    from: [9, 22],
    to: [10, 19],
    particles: 'leaves',
    accent: '#e0892b',
  },
];

const toNumber = ([month, day]: [number, number]) => month * 100 + day;

export function isSeasonActive(season: Season, date: Date): boolean {
  const today = toNumber([date.getMonth() + 1, date.getDate()]);
  const from = toNumber(season.from);
  const to = toNumber(season.to);
  return from <= to ? today >= from && today <= to : today >= from || today <= to;
}

export function getSeasonForDate(date: Date): Season | undefined {
  return SEASONS.find((season) => isSeasonActive(season, date));
}

export function getSeasonById(id: string): Season | undefined {
  return SEASONS.find((season) => season.id === id);
}
