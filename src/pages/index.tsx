import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {useLatestVersion} from '@docusaurus/plugin-content-docs/client';
import {usePreferences} from '@site/src/components/A11y/PreferencesProvider';
import {A11yIcon} from '@site/src/components/A11y/SettingsNavbarItem';
import {useLastVisitedDoc} from '@site/src/components/Home/lastVisited';
import Planet from '@site/src/components/Home/Planet';

import styles from './index.module.css';

type Course = {
  sidebarId: string;
  name: string;
  level: string;
  description: string;
  topics: string[];
  tone: 'snt' | 'premiere' | 'terminale';
};

const COURSES: Course[] = [
  {
    sidebarId: 'sntSidebar',
    name: 'SNT',
    level: 'Seconde',
    description: 'Sciences Numériques et Technologie : comprendre le numérique qui nous entoure.',
    topics: ['Internet', 'Le Web', 'Réseaux sociaux', 'Photo numérique'],
    tone: 'snt',
  },
  {
    sidebarId: 'nsiPremiereSidebar',
    name: 'NSI',
    level: 'Première',
    description: 'Numérique et Sciences Informatiques : programmer en Python et penser en algorithmes.',
    topics: ['Python', 'Projets', 'Algorithmique'],
    tone: 'premiere',
  },
  {
    sidebarId: 'nsiTerminaleSidebar',
    name: 'NSI',
    level: 'Terminale',
    description: 'Aller plus loin : bases de données, structures de données et préparation du bac.',
    topics: ['Bases de données', 'SQL'],
    tone: 'terminale',
  },
];

function useCourseLinks() {
  const version = useLatestVersion(undefined);
  return (sidebarId: string) => {
    // Pages réelles du cours (sans les pages d'index générées, dont l'id commence par « / », ni le calendrier).
    const pages = version.docs.filter((doc) => doc.sidebar === sidebarId && !doc.id.startsWith('/') && !doc.id.endsWith('/progression') && !doc.unlisted);
    return {
      path: version.sidebars?.[sidebarId]?.link?.path ?? version.path,
      pageCount: pages.length,
    };
  };
}

function Hero() {
  const {season} = usePreferences();
  return (
    <header className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.heroText}>
          <p className={styles.kicker}>Lycée · SNT &amp; NSI</p>
          <Heading as="h1" className={styles.heroTitle}>
            Tes cours d’informatique, <span className={styles.heroHighlight}>en orbite</span> toute l’année.
          </Heading>
          <p className={styles.heroLead}>
            Chapitres, exercices interactifs et projets pour la Seconde, la Première et la Terminale.
            Choisis ton cours pour commencer.
          </p>
          {season && (
            <p className={styles.seasonNote}>
              <span className={styles.seasonDot} aria-hidden="true" />
              {season.message}
            </p>
          )}
        </div>
        <div className={styles.heroArt}>
          <Planet />
        </div>
      </div>
    </header>
  );
}

function CourseCards() {
  const getCourse = useCourseLinks();
  return (
    <section className={styles.section} aria-labelledby="choisir-cours">
      <Heading as="h2" id="choisir-cours" className={styles.sectionTitle}>
        Choisis ton cours
      </Heading>
      <ul className={styles.courses}>
        {COURSES.map((course) => {
          const {path, pageCount} = getCourse(course.sidebarId);
          return (
            <li key={course.sidebarId}>
              <Link to={path} className={styles.course} data-tone={course.tone}>
                <span className={styles.courseLevel}>{course.level}</span>
                <span className={styles.courseName}>{course.name}</span>
                <span className={styles.courseDescription}>{course.description}</span>
                <span className={styles.topics}>
                  {course.topics.map((topic) => (
                    <span key={topic} className={styles.topic}>
                      {topic}
                    </span>
                  ))}
                </span>
                <span className={styles.courseFooter}>
                  <span>
                    {pageCount} page{pageCount > 1 ? 's' : ''} de cours
                  </span>
                  <span className={styles.courseCta} aria-hidden="true">
                    Ouvrir →
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function ResumeReading() {
  const last = useLastVisitedDoc();
  if (!last) return null;
  return (
    <section className={styles.section} aria-label="Reprendre la lecture">
      <Link to={last.path} className={styles.resume}>
        <span className={styles.resumeLabel}>Reprendre là où tu t’étais arrêté{last.section ? ` · ${last.section}` : ''}</span>
        <span className={styles.resumeTitle}>{last.title}</span>
        <span className={styles.resumeArrow} aria-hidden="true">
          →
        </span>
      </Link>
    </section>
  );
}

function AccessibilityBand() {
  const {openSettings} = usePreferences();
  return (
    <section className={styles.section} aria-labelledby="a-ta-facon">
      <div className={styles.band}>
        <div>
          <Heading as="h2" id="a-ta-facon" className={styles.bandTitle}>
            Un site qui s’adapte à toi
          </Heading>
          <p className={styles.bandText}>
            Agrandis le texte, passe en police OpenDyslexic, espace les lignes, renforce le contraste ou coupe les
            animations. Tes réglages sont gardés sur ton appareil.
          </p>
        </div>
        <div className={styles.bandActions}>
          <button type="button" className={styles.bandButton} onClick={openSettings}>
            <A11yIcon /> Ouvrir les réglages
          </button>
          <Link to="/accessibilite/" className={styles.bandLink}>
            En savoir plus
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Cours de SNT et NSI"
      description="Les cours de SNT (Seconde) et de NSI (Première, Terminale) : chapitres, exercices interactifs et projets.">
      <Hero />
      <main className={styles.main}>
        <ResumeReading />
        <CourseCards />
        <AccessibilityBand />
        <p className={styles.archives}>
          Tu cherches un cours de l’an dernier ? Il est dans les{' '}
          <Link to="/docs/2024-2025/intro/">archives 2024-2025</Link>.
        </p>
      </main>
    </Layout>
  );
}
