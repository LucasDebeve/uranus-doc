/**
 * Lien « Signaler une erreur » affiché en bas de chaque page de cours.
 *
 * Par défaut : ouverture d'un ticket (issue) GitHub pré-rempli avec le titre et l'adresse
 * de la page. Les élèves ont besoin d'un compte GitHub pour l'envoyer.
 * Pour utiliser un autre moyen (formulaire en ligne, ENT…), il suffit de modifier
 * `buildReportUrl` : elle reçoit le titre et l'adresse de la page.
 */
const REPOSITORY = 'https://github.com/LucasDebeve/uranus-doc';

export function buildReportUrl({title, url}: {title: string; url: string}): string {
  const body = [
    `**Page :** [${title}](${url})`,
    '',
    '**Où se trouve le problème ?** (titre de la partie, numéro d’exercice…)',
    '',
    '',
    '**Qu’est-ce qui ne va pas ?** (faute, erreur dans le cours, passage pas clair, lien cassé…)',
    '',
  ].join('\n');
  const params = new URLSearchParams({title: `Erreur : ${title}`, body});
  return `${REPOSITORY}/issues/new?${params.toString()}`;
}
