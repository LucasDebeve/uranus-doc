import React, {type ReactNode} from 'react';
import styles from './Planet.module.css';

/** Illustration de la page d'accueil : Uranus, son anneau presque vertical et une lune en orbite. */
export default function Planet(): ReactNode {
  return (
    <svg className={styles.planet} viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="planet-ring-front">
          <rect x="200" y="-60" width="260" height="520" transform="rotate(14 200 200)" />
        </clipPath>
      </defs>
      <g className={styles.stars}>
        <circle cx="40" cy="60" r="2.4" />
        <circle cx="352" cy="88" r="1.8" />
        <circle cx="70" cy="320" r="1.6" />
        <circle cx="330" cy="330" r="2.6" />
        <circle cx="300" cy="30" r="1.4" />
        <circle cx="24" cy="200" r="1.4" />
      </g>
      {/* orbite de la lune */}
      <ellipse cx="200" cy="200" rx="185" ry="62" transform="rotate(-18 200 200)" className={styles.orbit} />
      <ellipse cx="200" cy="200" rx="46" ry="166" transform="rotate(14 200 200)" className={styles.ringBack} />
      <circle cx="200" cy="200" r="104" className={styles.body} />
      <path d="M200 96a104 104 0 0 1 0 208a128 128 0 0 0 0-208z" className={styles.shade} />
      <path d="M118 160c50 10 114 10 164 0" className={styles.band} />
      <path d="M108 222c58 12 126 12 184 0" className={styles.band} />
      <ellipse
        cx="200"
        cy="200"
        rx="46"
        ry="166"
        transform="rotate(14 200 200)"
        className={styles.ringFront}
        clipPath="url(#planet-ring-front)"
      />
      <g transform="rotate(-18 200 200)">
        <circle r="13" className={styles.moon} />
      </g>
    </svg>
  );
}
