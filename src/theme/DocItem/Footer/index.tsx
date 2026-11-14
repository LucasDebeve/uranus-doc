import React, {type ReactNode} from 'react';
import Footer from '@theme-original/DocItem/Footer';
import type FooterType from '@theme/DocItem/Footer';
import type {WrapperProps} from '@docusaurus/types';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {buildReportUrl} from '@site/src/config/feedback';
import styles from './styles.module.css';

type Props = WrapperProps<typeof FooterType>;

/** Pied de page des cours : celui de Docusaurus (date de mise à jour) + « Signaler une erreur ». */
export default function FooterWrapper(props: Props): ReactNode {
  const {metadata} = useDoc();
  const {siteConfig} = useDocusaurusContext();
  const url = new URL(metadata.permalink, siteConfig.url).toString();
  const reportUrl = buildReportUrl({title: metadata.title, url});

  return (
    <>
      <Footer {...props} />
      <aside className={styles.report} aria-label="Signaler une erreur">
        <p className={styles.text}>
          Une faute, une erreur, un passage pas clair ?
        </p>
        <a className={styles.link} href={reportUrl} target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M5 21V4m0 0h11l-2 4 2 4H5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Signaler une erreur
          <span className={styles.srOnly}> (ouvre un nouvel onglet)</span>
        </a>
      </aside>
    </>
  );
}
