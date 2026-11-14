import React, {useEffect, useRef, type ReactNode} from 'react';
import {usePreferences} from '@site/src/components/A11y/PreferencesProvider';
import type {ParticleKind} from '@site/src/seasons/seasons';
import styles from './styles.module.css';

type Particle = {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  phase: number;
  rotation: number;
  spin: number;
  alpha: number;
  glyph?: string;
  hue?: number;
};

type Palette = {dark: boolean};

const PI_GLYPHS = ['π', 'π', 'π', '3', '1', '4', '1', '5', '9', '2', '6', '5'];

/** Nombre de particules selon la largeur d'écran (reste discret sur mobile). */
function countFor(kind: ParticleKind, width: number): number {
  const base = {snow: width / 18, bats: width / 160, pi: width / 50, petals: width / 40, leaves: width / 55}[kind];
  return Math.max(4, Math.min(Math.round(base), kind === 'snow' ? 90 : 40));
}

function spawn(kind: ParticleKind, w: number, h: number, anywhere: boolean): Particle {
  const rand = Math.random;
  const p: Particle = {
    x: rand() * w,
    y: anywhere ? rand() * h : -20,
    size: 0,
    speed: 0,
    drift: rand() * 0.8 + 0.2,
    phase: rand() * Math.PI * 2,
    rotation: rand() * Math.PI * 2,
    spin: (rand() - 0.5) * 0.03,
    alpha: rand() * 0.5 + 0.5,
  };
  switch (kind) {
    case 'snow':
      p.size = rand() * 2.6 + 1.2;
      p.speed = p.size * 0.28 + rand() * 0.3;
      break;
    case 'bats':
      p.size = rand() * 8 + 10;
      p.speed = rand() * 0.8 + 0.6;
      p.x = anywhere ? rand() * w : -40;
      p.y = rand() * h * 0.7 + h * 0.05;
      break;
    case 'pi':
      p.size = rand() * 14 + 14;
      p.speed = rand() * 0.35 + 0.2;
      p.y = anywhere ? rand() * h : h + 30;
      p.glyph = PI_GLYPHS[Math.floor(rand() * PI_GLYPHS.length)];
      p.alpha = rand() * 0.25 + 0.15;
      break;
    case 'petals':
      p.size = rand() * 5 + 5;
      p.speed = rand() * 0.6 + 0.5;
      p.hue = rand() * 25 + 330;
      break;
    case 'leaves':
      p.size = rand() * 6 + 7;
      p.speed = rand() * 0.7 + 0.6;
      p.hue = rand() * 30 + 15;
      break;
  }
  return p;
}

function drawBat(ctx: CanvasRenderingContext2D, s: number, flap: number) {
  // Silhouette simple : corps + deux ailes dont la hauteur varie (battement).
  const wing = s * (0.35 + 0.45 * flap);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-s * 0.5, -wing, -s, -wing * 0.4);
  ctx.quadraticCurveTo(-s * 0.75, s * 0.05, -s * 0.5, s * 0.1);
  ctx.quadraticCurveTo(-s * 0.3, -s * 0.05, 0, s * 0.25);
  ctx.quadraticCurveTo(s * 0.3, -s * 0.05, s * 0.5, s * 0.1);
  ctx.quadraticCurveTo(s * 0.75, s * 0.05, s, -wing * 0.4);
  ctx.quadraticCurveTo(s * 0.5, -wing, 0, 0);
  ctx.fill();
}

function draw(ctx: CanvasRenderingContext2D, kind: ParticleKind, p: Particle, t: number, palette: Palette) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.globalAlpha = p.alpha;
  switch (kind) {
    case 'snow':
      ctx.fillStyle = palette.dark ? '#ffffff' : '#9cc4ea';
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'bats':
      ctx.fillStyle = palette.dark ? '#b9a7e8' : '#2a2140';
      drawBat(ctx, p.size, (Math.sin(t * 0.012 + p.phase) + 1) / 2);
      break;
    case 'pi':
      ctx.fillStyle = palette.dark ? '#7de3e1' : '#0b7285';
      ctx.font = `600 ${p.size}px "Space Grotesk Variable", sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(p.glyph ?? 'π', 0, 0);
      break;
    case 'petals':
      ctx.rotate(p.rotation);
      ctx.fillStyle = `hsl(${p.hue}, 80%, ${palette.dark ? 78 : 72}%)`;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'leaves':
      ctx.rotate(p.rotation);
      ctx.fillStyle = `hsl(${p.hue}, 75%, ${palette.dark ? 55 : 45}%)`;
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.quadraticCurveTo(p.size * 0.8, 0, 0, p.size);
      ctx.quadraticCurveTo(-p.size * 0.8, 0, 0, -p.size);
      ctx.fill();
      break;
  }
  ctx.restore();
}

function step(kind: ParticleKind, p: Particle, w: number, h: number, t: number): boolean {
  switch (kind) {
    case 'bats':
      p.x += p.speed;
      p.y += Math.sin(t * 0.004 + p.phase) * 0.6;
      return p.x < w + 60;
    case 'pi':
      p.y -= p.speed;
      p.x += Math.sin(t * 0.001 + p.phase) * 0.2;
      return p.y > -40;
    default:
      p.y += p.speed;
      p.x += Math.sin(t * 0.0015 + p.phase) * p.drift;
      p.rotation += p.spin;
      return p.y < h + 20;
  }
}

/** Couche décorative plein écran : purement visuelle, ignorée des lecteurs d'écran et des clics. */
export default function SeasonalEffects(): ReactNode {
  const {season, motionReduced} = usePreferences();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const kind = season?.particles;
  const active = Boolean(kind) && !motionReduced;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!active || !kind || !canvas || !ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let frame = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = countFor(kind, width);
      particles = Array.from({length: target}, (_, i) => particles[i] ?? spawn(kind, width, height, true));
    };
    resize();
    window.addEventListener('resize', resize);

    const loop = (t: number) => {
      const palette = {dark: document.documentElement.dataset.theme === 'dark'};
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p, i) => {
        if (!step(kind, p, width, height, t)) particles[i] = spawn(kind, width, height, false);
        draw(ctx, kind, particles[i], t, palette);
      });
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      ctx.clearRect(0, 0, width, height);
    };
  }, [active, kind]);

  if (!active) return null;
  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
