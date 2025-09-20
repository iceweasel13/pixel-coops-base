import { Scene } from 'phaser';

export class Boot extends Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    // No heavy assets here; Preloader will load game assets.
  }

  create() {
    // Create full-screen HTML overlay per design:
    // - map.png covers the whole screen
    // - centered logo.png
    // - white loading bar underneath
    this.createLoadingOverlay();

    // Hand over to Preloader which will update the progress bar
    this.scene.start('Preloader');
  }

  private createLoadingOverlay() {
    if (document.getElementById('loading-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.setAttribute(
      'style',
      [
        'position:fixed',
        'inset:0',
        'width:100vw',
        'height:100vh',
        'display:flex',
        'align-items:center',
        'justify-content:center',
        'z-index:9999',
        'pointer-events:none',
        'overflow:hidden',
      ].join(';')
    );

    // Blurred background layer (map.png), stronger blur than login screen
    const bg = document.createElement('div');
    bg.setAttribute(
      'style',
      [
        'position:absolute',
        'inset:0',
        "background:url('/assets/map.png') center/cover no-repeat",
        // Heavier blur (e.g., 14px) than tailwind blur-sm (~4px)
        'filter:blur(14px)',
        // Slight scale to avoid edge artifacts from blur
        'transform:scale(1.05)',
        'will-change:transform',
      ].join(';')
    );

    const container = document.createElement('div');
    container.setAttribute(
      'style',
      [
        'display:flex',
        'flex-direction:column',
        'align-items:center',
        'justify-content:center',
        'gap:16px',
        'padding:24px',
        // subtle backdrop to improve contrast if the bg is bright
        'background:rgba(0,0,0,0.0)',
        'position:relative',
        'z-index:2',
      ].join(';')
    );

    const logo = document.createElement('img');
    logo.src = '/logo.png';
    logo.alt = 'Logo';
    logo.setAttribute('style', 'width:min(40vw, 240px); height:auto;');

    const barTrack = document.createElement('div');
    barTrack.id = 'loading-bar';
    barTrack.setAttribute(
      'style',
      [
        'width:min(60vw, 480px)',
        'height:12px',
        'border:1px solid #fff',
        'border-radius:6px',
        'background:rgba(255,255,255,0.15)',
        'overflow:hidden',
      ].join(';')
    );

    const barFill = document.createElement('div');
    barFill.id = 'loading-bar-fill';
    barFill.setAttribute(
      'style',
      [
        'height:100%',
        'width:0%',
        'background:#ffffff',
        'transition:width 120ms ease-out',
      ].join(';')
    );

    // Semi-transparent black scrim to darken background by 50%
    const scrim = document.createElement('div');
    scrim.setAttribute(
      'style',
      [
        'position:absolute',
        'inset:0',
        'background:rgba(0,0,0,0.5)',
        'z-index:1',
      ].join(';')
    );

    barTrack.appendChild(barFill);
    container.appendChild(logo);
    container.appendChild(barTrack);
    overlay.appendChild(bg);
    overlay.appendChild(scrim);
    overlay.appendChild(container);
    document.body.appendChild(overlay);
  }
}
