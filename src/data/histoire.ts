/**
 * Événements de l'histoire de l'informatique utilisés par la frise chronologique.
 * Pour en ajouter : une année, un titre court, et une phrase d'explication (affichée après validation).
 * `theme` permet de faire des frises thématiques : <FriseChronologique themes={['reseaux']} />.
 */

export type HistoireTheme = 'machines' | 'langages' | 'reseaux' | 'donnees' | 'ia';

export type HistoireEvent = {
  year: number;
  title: string;
  detail: string;
  theme: HistoireTheme;
};

export const HISTOIRE: HistoireEvent[] = [
  {year: 1642, theme: 'machines', title: 'La Pascaline', detail: 'Blaise Pascal invente une machine à calculer mécanique qui additionne et soustrait.'},
  {year: 1801, theme: 'machines', title: 'Le métier à tisser de Jacquard', detail: 'Des cartes perforées commandent le motif tissé : une première forme de programme.'},
  {year: 1843, theme: 'langages', title: 'Le premier programme d’Ada Lovelace', detail: 'Ada Lovelace décrit un algorithme pour la machine analytique de Babbage : on la considère comme la première programmeuse.'},
  {year: 1854, theme: 'donnees', title: 'L’algèbre de Boole', detail: 'George Boole formalise la logique avec deux valeurs, vrai et faux : la base des circuits des ordinateurs.'},
  {year: 1936, theme: 'machines', title: 'La machine de Turing', detail: 'Alan Turing définit un modèle théorique de calcul qui sert encore à dire ce qu’un ordinateur peut calculer.'},
  {year: 1945, theme: 'machines', title: 'L’architecture de von Neumann', detail: 'Programme et données sont rangés dans la même mémoire : presque tous les ordinateurs actuels suivent ce modèle.'},
  {year: 1946, theme: 'machines', title: 'L’ENIAC est présenté au public', detail: 'Un des premiers ordinateurs électroniques : 30 tonnes et environ 18 000 tubes à vide.'},
  {year: 1947, theme: 'machines', title: 'L’invention du transistor', detail: 'Mis au point aux laboratoires Bell, il remplace les tubes à vide : plus petit, plus fiable, moins gourmand.'},
  {year: 1952, theme: 'langages', title: 'Le premier compilateur', detail: 'Grace Hopper crée le compilateur A-0, qui traduit un programme en langage machine.'},
  {year: 1956, theme: 'ia', title: 'Naissance de l’expression « intelligence artificielle »', detail: 'Elle est popularisée lors de la conférence de Dartmouth, aux États-Unis.'},
  {year: 1957, theme: 'langages', title: 'Le langage FORTRAN', detail: 'Un des premiers langages de haut niveau, conçu chez IBM pour le calcul scientifique.'},
  {year: 1958, theme: 'machines', title: 'Le circuit intégré', detail: 'Jack Kilby rassemble plusieurs composants sur une même puce de semi-conducteur.'},
  {year: 1963, theme: 'donnees', title: 'Le code ASCII', detail: 'Une table commune pour coder les caractères sur 7 bits : 128 caractères, sans accents.'},
  {year: 1969, theme: 'reseaux', title: 'Premier message sur ARPANET', detail: 'L’ancêtre d’Internet relie des universités américaines. Le premier message, « LO », fait planter le système !'},
  {year: 1970, theme: 'donnees', title: 'Le modèle relationnel', detail: 'Edgar F. Codd propose d’organiser les données en tables reliées entre elles : la base des SGBD actuels.'},
  {year: 1971, theme: 'machines', title: 'Le premier microprocesseur', detail: 'L’Intel 4004 réunit tout le processeur sur une seule puce.'},
  {year: 1972, theme: 'langages', title: 'Le langage C', detail: 'Dennis Ritchie crée le C pour écrire le système Unix ; il reste très utilisé aujourd’hui.'},
  {year: 1974, theme: 'reseaux', title: 'Les protocoles TCP/IP', detail: 'Vint Cerf et Bob Kahn décrivent les règles qui permettent à des réseaux différents de communiquer.'},
  {year: 1981, theme: 'machines', title: 'L’IBM PC', detail: 'Ce micro-ordinateur fixe le standard du « PC » pour des décennies.'},
  {year: 1984, theme: 'machines', title: 'Le Macintosh', detail: 'Il popularise la souris et l’interface graphique avec des fenêtres et des icônes.'},
  {year: 1985, theme: 'donnees', title: 'La norme IEEE 754', detail: 'Elle fixe la façon de représenter les nombres flottants dans les ordinateurs.'},
  {year: 1989, theme: 'reseaux', title: 'L’invention du Web', detail: 'Au CERN, Tim Berners-Lee propose un système de pages reliées par des liens : HTML, HTTP et les URL.'},
  {year: 1991, theme: 'langages', title: 'Le langage Python', detail: 'Guido van Rossum publie la première version de Python.'},
  {year: 1997, theme: 'ia', title: 'Deep Blue bat Kasparov', detail: 'Un ordinateur d’IBM bat le champion du monde d’échecs en titre.'},
  {year: 1998, theme: 'reseaux', title: 'La création de Google', detail: 'Son moteur de recherche classe les pages selon les liens qui pointent vers elles.'},
  {year: 2001, theme: 'reseaux', title: 'Le lancement de Wikipédia', detail: 'Une encyclopédie libre écrite par ses lecteurs.'},
  {year: 2007, theme: 'machines', title: 'Le premier iPhone', detail: 'Le smartphone à écran tactile se répand : Internet tient désormais dans la poche.'},
  {year: 2016, theme: 'ia', title: 'AlphaGo bat Lee Sedol', detail: 'Une IA fondée sur l’apprentissage profond bat l’un des meilleurs joueurs de go.'},
];

export const THEME_LABELS: Record<HistoireTheme, string> = {
  machines: 'Machines',
  langages: 'Langages',
  reseaux: 'Réseaux et Web',
  donnees: 'Données',
  ia: 'Intelligence artificielle',
};
