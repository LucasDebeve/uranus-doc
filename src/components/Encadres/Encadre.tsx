import React, {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  IconChevron,
  IconCorrection,
  IconExercice,
  IconMethode,
  IconObjectifs,
  IconRetenir,
  IconVocabulaire,
} from './icons';
import styles from './styles.module.css';

export type EncadreType = 'objectifs' | 'retenir' | 'exercice' | 'correction' | 'methode' | 'vocabulaire';

const CONFIG: Record<EncadreType, {label: string; Icon: () => ReactNode}> = {
  objectifs: {label: 'Objectifs', Icon: IconObjectifs},
  retenir: {label: 'À retenir', Icon: IconRetenir},
  exercice: {label: 'Exercice', Icon: IconExercice},
  correction: {label: 'Correction', Icon: IconCorrection},
  methode: {label: 'Méthode', Icon: IconMethode},
  vocabulaire: {label: 'Vocabulaire', Icon: IconVocabulaire},
};

type Props = {
  type: EncadreType;
  /** Titre personnalisé (`:::exercice Exercice 2`) ; sinon le nom du type. */
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
};

/**
 * Encadré de cours. S'utilise directement en Markdown :
 *
 *   :::exercice Exercice 1 : le pendu
 *   Énoncé…
 *   :::
 *
 * `:::correction` donne un encadré replié qu'on ouvre d'un clic.
 */
export default function Encadre({type, title, children, className}: Props): ReactNode {
  const {label, Icon} = CONFIG[type];
  const titleId = useId();

  if (type === 'correction') {
    return (
      <details className={clsx(styles.encadre, styles.correction, className)} data-type={type}>
        <summary className={clsx(styles.tab, styles.summary)}>
          <Icon />
          <span>{title ?? label}</span>
          <span className={styles.chevron}>
            <IconChevron />
          </span>
        </summary>
        <div className={styles.content}>{children}</div>
      </details>
    );
  }

  return (
    <div className={clsx(styles.encadre, className)} data-type={type} role="note" aria-labelledby={titleId}>
      <p className={styles.tab} id={titleId}>
        <Icon />
        <span>{title ?? label}</span>
      </p>
      <div className={styles.content}>{children}</div>
    </div>
  );
}

/** Variantes prêtes à l'emploi, pour une utilisation en JSX dans une page MDX. */
export const Objectifs = (p: Omit<Props, 'type'>) => <Encadre type="objectifs" {...p} />;
export const Retenir = (p: Omit<Props, 'type'>) => <Encadre type="retenir" {...p} />;
export const Exercice = (p: Omit<Props, 'type'>) => <Encadre type="exercice" {...p} />;
export const Correction = (p: Omit<Props, 'type'>) => <Encadre type="correction" {...p} />;
export const Methode = (p: Omit<Props, 'type'>) => <Encadre type="methode" {...p} />;
export const Vocabulaire = (p: Omit<Props, 'type'>) => <Encadre type="vocabulaire" {...p} />;
