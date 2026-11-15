import React, {Children, isValidElement, type ComponentType, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {useActiveVersion, useDoc} from '@docusaurus/plugin-content-docs/client';
import styles from './styles.module.css';

/** Types d'encadrés repris dans la fiche, dans l'ordre d'affichage. */
const KEPT = ['retenir', 'vocabulaire'];

type DocModule = {
  default: ComponentType<{components?: Record<string, ComponentType<{children?: ReactNode}>>}>;
  frontMatter?: {id?: string; title?: string; sidebar_position?: number; fiche?: boolean};
  contentTitle?: string;
};

// Toutes les pages de cours de l'année en cours (les fiches elles-mêmes exclues).
// webpack les regroupe à la compilation : ajouter une page suffit à la faire apparaître dans la fiche.
const docsContext = require.context('@site/docs', true, /^\.\/(?!.*\/fiche\.mdx?$).*\.mdx?$/);

/**
 * Éléments de premier niveau d'une page MDX. Avec MDX 3, l'enveloppe (`wrapper`) reçoit un seul
 * composant interne qui produit le contenu : on l'appelle pour obtenir la liste des blocs
 * (titres, paragraphes, encadrés…).
 */
function topLevel(children: ReactNode): ReactNode[] {
  const list = Children.toArray(children);
  const only = list[0];
  if (list.length === 1 && isValidElement<{type?: string}>(only) && typeof only.type === 'function' && !only.props.type) {
    const rendered = (only.type as (props: unknown) => ReactNode)(only.props);
    if (isValidElement<{children?: ReactNode}>(rendered)) return Children.toArray(rendered.props.children);
  }
  return list;
}

/** Ne garde, parmi les éléments de premier niveau d'une page, que les encadrés voulus. */
function keepOnly(children: ReactNode): ReactNode[] {
  return topLevel(children).filter(
    (child) => isValidElement<{type?: string}>(child) && KEPT.includes(child.props.type ?? ''),
  );
}

type Entry = {key: string; id: string; title: string; position: number; Content: DocModule['default']};

/**
 * Fiche de révision d'un chapitre : rassemble les encadrés « À retenir » et « Vocabulaire »
 * de toutes les pages du dossier où se trouve la fiche (sous-dossiers compris).
 * Utilisation : un fichier `fiche.mdx` dans le dossier du chapitre, contenant <FicheRevision />.
 */
export default function FicheRevision(): ReactNode {
  const {metadata} = useDoc();
  const version = useActiveVersion(undefined);

  // '@site/docs/nsi/premiere/xxx/fiche.mdx' → 'nsi/premiere/xxx/'
  const dir = metadata.source.replace(/^@site\/docs\//, '').replace(/[^/]+$/, '');

  const entries: Entry[] = docsContext
    .keys()
    .filter((key) => key.startsWith(`./${dir}`))
    .map((key) => {
      const mod = docsContext(key) as DocModule;
      const relative = key.slice(2).replace(/\.mdx?$/, '');
      const id = relative.replace(/[^/]+$/, '') + (mod.frontMatter?.id ?? relative.split('/').pop());
      return {
        key,
        id,
        title: mod.frontMatter?.title ?? mod.contentTitle ?? id,
        position: mod.frontMatter?.sidebar_position ?? 999,
        Content: mod.default,
      };
    })
    .sort((a, b) => a.position - b.position || a.key.localeCompare(b.key));

  // Remplace l'enveloppe de chaque page par un filtre : seuls les encadrés retenus sont affichés.
  const Filter = ({children}: {children?: ReactNode}) => <>{keepOnly(children)}</>;

  return (
    <div className={styles.fiche}>
      <div className={styles.toolbar}>
        <p className={styles.intro}>
          Cette fiche rassemble automatiquement les encadrés <strong>À retenir</strong> et <strong>Vocabulaire</strong> de chaque
          page du chapitre. Elle se met à jour toute seule quand le cours change.
        </p>
        <button type="button" className={styles.print} onClick={() => window.print()}>
          Imprimer la fiche
        </button>
      </div>

      {entries.map((entry) => {
        const path = version?.docs.find((d) => d.id === entry.id)?.path;
        return (
          <section key={entry.key} className={styles.section} data-fiche-section>
            <h2 className={styles.sectionTitle}>{path ? <Link to={path}>{entry.title}</Link> : entry.title}</h2>
            <entry.Content components={{wrapper: Filter}} />
          </section>
        );
      })}

      <p className={styles.empty}>Aucun encadré « À retenir » ou « Vocabulaire » dans ce chapitre pour l’instant.</p>
    </div>
  );
}
