import DefaultAdmonitionTypes from '@theme-original/Admonition/Types';
import {Correction, Exercice, Methode, Objectifs, Retenir, Vocabulaire} from '@site/src/components/Encadres/Encadre';

/**
 * Encadrés de cours ajoutés aux types de Docusaurus (note, tip, info…).
 * Les mots-clés correspondants sont déclarés dans docusaurus.config.ts (`admonitions.keywords`).
 */
export default {
  ...DefaultAdmonitionTypes,
  objectifs: Objectifs,
  retenir: Retenir,
  exercice: Exercice,
  correction: Correction,
  methode: Methode,
  vocabulaire: Vocabulaire,
};
