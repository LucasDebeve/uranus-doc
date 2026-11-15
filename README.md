# Uranus

## Licenses

Ce site utilise [Docusaurus](https://github.com/facebook/docusaurus) sous licence MIT.
Voir le fichier `LICENSE-DOCUSAURUS.txt` pour les détails.

Modification apportées par Lucas Debeve sous licence GPLv3.
Voir le fichier `LICENSE.txt` pour les détails.

Le contenu est sous licence CC BY-NC-ND 4.0.
Voir le fichier `LICENSE-COURS.txt` pour les détails.

## Organisation du site

- `docs/snt/` : cours de SNT (Seconde)
- `docs/nsi/premiere/` et `docs/nsi/terminale/` : cours de NSI, un menu latéral par niveau (voir `sidebars.ts`)
- `versioned_docs/` : archives des années précédentes

Pour ajouter un chapitre, créez un fichier `.mdx` dans le bon dossier : il apparaît automatiquement dans le menu et dans le compteur de la page d'accueil.

## Encadrés de cours

En plus des encadrés de Docusaurus (`:::info`, `:::tip`…), six encadrés sont disponibles :
`:::objectifs`, `:::retenir`, `:::exercice`, `:::correction` (replié, s'ouvre au clic), `:::methode`, `:::vocabulaire`.

```md
::::exercice Exercice 1 : le pendu

Énoncé de l'exercice.

:::correction

La solution, cachée tant qu'on ne clique pas.

:::

::::
```

Le texte après le mot-clé remplace le titre par défaut. Pour mettre un encadré dans un autre, l'encadré extérieur prend un `:` de plus (exemple ci-dessus). Le rendu est dans `src/components/Encadres/`.

## Calendrier de l'année

Les pages « Calendrier de l'année » de chaque niveau lisent `src/data/progression.ts` : chapitres, projets, évaluations et vacances avec leurs dates. L'état « Vu / En cours / À venir » et la prochaine évaluation sont calculés automatiquement chaque jour.

## Entraîneurs

Exercices générés au hasard, à refaire à l'infini, avec correction détaillée (`src/components/Entraineurs/`) :

| Composant | Exemple |
| --- | --- |
| `QCM` | question à choix écrite par l'enseignant, thèmes `serieux` / `ludique` : `<QCM theme="serieux" question="…" choices={[{label: 'CSS', isCorrect: true}, …]} explanation="…" />` (réponses en formule avec `isEquation: true`, ex. `2^32`) |
| `ConversionBases` | `<ConversionBases from={10} to={2} />`, `<ConversionBases bases={[2, 8, 16]} max={500} />` |
| `NombreDeBits` | `<NombreDeBits kinds={['entier', 'somme', 'produit']} />` |
| `ComplementDeux` | `<ComplementDeux bits={8} modes={['coder', 'decoder', 'plage']} />` |
| `Flottants` | `<Flottants modes={['ecriture', 'fini', 'python']} />` |
| `TableVerite` | `<TableVerite deuxVariables />` |
| `AdditionBinaire` | `<AdditionBinaire bits={6} />` |
| `EvaluationSequentielle` | `<EvaluationSequentielle />` |
| `Encodage` | `<Encodage modes={['ascii', 'taille', 'octets', 'mojibake']} />` |
| `ConvertisseurTexte` | outil de conversion de texte et de fichiers entre encodages |
| `Frise/FriseChronologique` | `<FriseChronologique themes={['reseaux']} niveau="moyen" />` (événements dans `src/data/histoire.ts`) |

Pour créer un nouvel entraîneur, partir de `core/Entraineur.tsx` : il gère la question, la vérification, la correction et le score.

## Fiches de révision

Un fichier `fiche.mdx` contenant `<FicheRevision />` dans le dossier d'un chapitre affiche automatiquement tous les encadrés `:::retenir` et `:::vocabulaire` des pages de ce dossier (exemple : `docs/nsi/premiere/representation-donnees/fiche.mdx`).

## Signaler une erreur

Le lien en bas de chaque cours ouvre un ticket GitHub pré-rempli. Pour utiliser un autre moyen (formulaire, ENT…), modifier `src/config/feedback.ts`.

## Thèmes saisonniers

Les périodes (hiver, Halloween, journée de π…) sont définies dans `src/seasons/seasons.ts`. Ajoutez une entrée pour créer un nouvel événement.

## Accessibilité

Les réglages (taille du texte, police OpenDyslexic, contraste, animations…) sont gérés dans `src/components/A11y/` et expliqués aux élèves sur la page `/accessibilite/`.

### Installation

```
$ pnpm install
```

### Local Development

```
$ pnpm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ pnpm build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Using SSH:

```
$ USE_SSH=true pnpm deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> pnpm deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
