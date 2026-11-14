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

## Thèmes saisonniers

Les périodes (hiver, Halloween, journée de π…) sont définies dans `src/seasons/seasons.ts`. Ajoutez une entrée pour créer un nouvel événement.

## Accessibilité

Les réglages (taille du texte, police OpenDyslexic, contraste, animations…) sont gérés dans `src/components/A11y/` et expliqués aux élèves sur la page `/accessibilite/`.

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Using SSH:

```
$ USE_SSH=true yarn deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
