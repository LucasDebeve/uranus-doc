import type {Plugin} from '@docusaurus/types';

/**
 * Injecte un petit script dans <head> qui applique les réglages d'accessibilité
 * enregistrés (localStorage) AVANT le premier affichage, pour éviter que la page
 * « saute » (changement de police, de taille…) une fois React chargé.
 *
 * Les attributs posés ici sont ensuite tenus à jour par
 * `src/components/A11y/PreferencesProvider.tsx`.
 */
export const STORAGE_KEY = 'uranus-preferences';

const inlineScript = `(function () {
  try {
    var p = JSON.parse(localStorage.getItem('${STORAGE_KEY}') || '{}');
    var d = document.documentElement;
    if (p.fontScale) d.style.setProperty('--uranus-font-scale', String(p.fontScale));
    if (p.font && p.font !== 'default') d.setAttribute('data-a11y-font', p.font);
    if (p.spacing) d.setAttribute('data-a11y-spacing', 'true');
    if (p.contrast) d.setAttribute('data-a11y-contrast', 'high');
    if (p.underlineLinks) d.setAttribute('data-a11y-links', 'underline');
    if (p.reduceMotion) d.setAttribute('data-a11y-motion', 'reduce');
  } catch (e) {}
})();`;

export default function a11yPreferencesPlugin(): Plugin {
  return {
    name: 'uranus-a11y-preferences',
    injectHtmlTags() {
      return {
        headTags: [{tagName: 'script', innerHTML: inlineScript}],
      };
    },
  };
}
