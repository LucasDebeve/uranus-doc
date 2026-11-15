import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Année scolaire en cours (dossier `docs/`) et dernière année archivée (`versioned_docs/`).
 * À la rentrée : `pnpm docusaurus docs:version <année en cours>`, puis mettre à jour ces deux constantes
 * et la liste `versions` plus bas.
 */
const CURRENT_YEAR = '2025-2026';
const ARCHIVE_YEAR = '2024-2025';

const config: Config = {
  title: 'Uranus',
  tagline: 'Les cours de SNT et de NSI, en orbite toute l\'année.',
  favicon: 'img/favicon.svg',

  // Set the production url of your site here
  url: 'https://cours.lucasdebeve.eu/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'LucasDebeve', // Usually your GitHub org/user name.
  projectName: 'uranus-doc', // Usually your repo name.
  deploymentBranch: 'gh-pages',
  trailingSlash: true,

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          remarkPlugins: [remarkMath],
          // Encadrés de cours (:::objectifs, :::exercice…) en plus des types de Docusaurus.
          // Leur rendu est dans src/components/Encadres et src/theme/Admonition/Types.tsx.
          admonitions: {
            keywords: ['objectifs', 'retenir', 'exercice', 'correction', 'methode', 'vocabulaire'],
            extendDefaults: true,
          },
          rehypePlugins: [rehypeKatex],
          // Date de dernière modification de chaque page, lue dans l'historique git.
          showLastUpdateTime: true,
          // L'année en cours est la version de référence ; les années passées sont des archives.
          lastVersion: 'current',
          versions: {
            current: {
              label: `${CURRENT_YEAR} (en cours)`,
              path: CURRENT_YEAR,
              banner: 'none',
              badge: false,
            },
            '2024-2025': {
              label: 'Archives 2024-2025',
              path: '2024-2025',
            },
          },
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  themes: [
    [
      // Recherche entièrement locale : l'index est construit au build, aucun service externe.
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['fr'],
        indexDocs: true,
        indexBlog: false,
        indexPages: false,
        docsRouteBasePath: '/docs',
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        searchResultLimits: 8,
        searchBarShortcutHint: true,
        // Seuls les cours de l'année en cours sont proposés (ni les archives, ni les calendriers, ni les fiches).
        ignoreFiles: [new RegExp(`docs/(?!${CURRENT_YEAR}/)`), /\/(progression|fiche)\/?$/],
      },
    ],
  ],
  plugins: [
    'docusaurus-plugin-image-zoom',
    // Applique les réglages d'accessibilité avant le premier affichage (pas de flash).
    './src/plugins/a11y-preferences.ts',
    [
      '@docusaurus/plugin-client-redirects',
      {
        // Anciennes adresses (avant la réorganisation SNT / NSI de 2025-2026) → nouvelles pages.
        // Ces chemins sont historiques : ne pas les remplacer par CURRENT_YEAR.
        createRedirects(existingPath: string) {
          const base = '/docs/2025-2026/';
          if (existingPath === `${base}nsi/premiere/algorithmique/crepier/`) {
            return `${base}sansPC/test/`;
          }
          for (const level of ['premiere', 'terminale']) {
            const now = `${base}nsi/${level}/`;
            if (existingPath.startsWith(now) && existingPath !== now) {
              return existingPath.replace(now, `${base}${level}/`);
            }
          }
          return undefined;
        },
        redirects: [
          {from: '/docs/2025-2026/intro/', to: '/'},
          // Le parcours Collège a quitté la version en cours : on renvoie vers les archives.
          {from: '/docs/2025-2026/developpement-web/', to: '/docs/2024-2025/developpement-web/'},
          {from: '/docs/2025-2026/le-web-comment-ca-marche/', to: '/docs/2024-2025/le-web-comment-ca-marche/'},
          {from: '/docs/2025-2026/college/developpement-web/projet-fan/', to: '/docs/2024-2025/college/developpement-web/projet-fan/'},
          {from: '/docs/2025-2026/college/developpement-web/escape-game/', to: '/docs/2024-2025/college/developpement-web/escape-game/'},
          {
            from: [
              '/docs/2025-2026/college/developpement-web/outils-developpement/',
              '/docs/2025-2026/college/developpement-web/structure-html/',
              '/docs/2025-2026/college/developpement-web/style-css/',
            ],
            to: '/docs/2024-2025/developpement-web/',
          },
        ],
      },
    ],
  ],
  headTags: [
    {tagName: 'link', attributes: {rel: 'apple-touch-icon', href: '/img/apple-touch-icon.png'}},
    {tagName: 'meta', attributes: {name: 'theme-color', content: '#0f1a3c'}},
  ],
  themeConfig: {
    image: 'img/uranus-social-card.png',
    metadata: [
      {name: 'description', content: 'Les cours de SNT (Seconde) et de NSI (Première, Terminale) : chapitres, exercices et projets.'},
    ],
    colorMode: {
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    navbar: {
      title: 'Uranus',
      hideOnScroll: false,
      logo: {
        alt: 'Uranus, accueil',
        src: 'img/logo.svg',
        width: 36,
        height: 36,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'sntSidebar',
          position: 'left',
          label: 'SNT',
        },
        {
          type: 'dropdown',
          label: 'NSI',
          position: 'left',
          items: [
            {type: 'docSidebar', sidebarId: 'nsiPremiereSidebar', label: 'Première'},
            {type: 'docSidebar', sidebarId: 'nsiTerminaleSidebar', label: 'Terminale'},
          ],
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          type: 'search',
          position: 'right',
        },
        {
          type: 'custom-a11ySettings',
          position: 'right',
        },
        {
          href: 'https://github.com/LucasDebeve',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      logo: {
        alt: 'Uranus',
        src: 'img/logo.svg',
        width: 48,
        height: 48,
        href: '/',
      },
      links: [
        {
          title: 'Cours',
          items: [
            {label: 'SNT — Seconde', to: `/docs/${CURRENT_YEAR}/snt/presentation/`},
            {label: 'NSI — Première', to: `/docs/${CURRENT_YEAR}/nsi/premiere/`},
            {label: 'NSI — Terminale', to: `/docs/${CURRENT_YEAR}/nsi/terminale/`},
            {label: `Archives ${ARCHIVE_YEAR}`, to: `/docs/${ARCHIVE_YEAR}/intro/`},
          ],
        },
        {
          title: 'Le site',
          items: [
            {label: 'Accessibilité et réglages', to: '/accessibilite/'},
            {label: 'Blog', to: '/blog'},
          ],
        },
        {
          title: 'Plus',
          items: [
            {label: 'GitHub', href: 'https://github.com/LucasDebeve'},
          ],
        },
      ],
      copyright: `Contenu sous licence CC BY-NC-ND 4.0 - Lucas Debeve ${new Date().getFullYear() === 2025 ? '2025' : '2025-' + new Date().getFullYear()}`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    zoom: {
        background: {
          light: 'rgb(50, 50, 50)',
          dark: 'rgb(50, 50, 50)'
        },
        config: {
          // options you can specify via https://github.com/francoischalifour/medium-zoom#usage
          margin: 50,
        }
      }
  } satisfies Preset.ThemeConfig,
};

export default config;
