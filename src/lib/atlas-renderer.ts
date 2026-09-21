import * as THREE from 'three';
import { DesignConfig, DesignState } from '../types';

/**
 * Client-Side Runtime UV Atlas Renderer for Riza Apparel 3D Studio (Tahap I2)
 * Converts DesignState to 2048x2048 (or 1024x1024 mobile) sRGB Canvas Texture
 * mapped 1:1 per panel with 16px edge dilation padding to eliminate seam artifacts.
 */

export interface AtlasOptions {
  resolution?: number;
  dilationPadding?: number;
}

function renderJerseyAtlasCanvas(
  config: DesignConfig | DesignState,
  options: AtlasOptions = {}
): HTMLCanvasElement {
  const resolution = options.resolution || 2048;
  const bleed = options.dilationPadding || 16;
  const scale = resolution / 2048;

  const canvas = document.createElement('canvas');
  canvas.width = resolution;
  canvas.height = resolution;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const cfg = config as (DesignConfig & Partial<DesignState>);
  const baseColor = cfg.baseColor || '#881337';
  const secondaryColor = cfg.secondaryColor || '#f59e0b';
  const accentColor = cfg.accentColor || '#ffffff';
  const playerName = cfg.playerName || 'RIZA SPORT';
  const playerNumber = cfg.playerNumber || '10';
  const sponsorText = cfg.sponsorText || 'RIZA SPORT';
  const motif = cfg.motifTemplate || 'tenun-ende';

  // Clear background
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, resolution, resolution);

  // Helper scaled rect
  const drawBleedRect = (x: number, y: number, w: number, h: number, color: string) => {
    const sx = Math.floor((x - bleed) * scale);
    const sy = Math.floor((y - bleed) * scale);
    const sw = Math.ceil((w + bleed * 2) * scale);
    const sh = Math.ceil((h + bleed * 2) * scale);
    ctx.fillStyle = color;
    ctx.fillRect(sx, sy, sw, sh);
  };

  // Helper scaled inner rect
  const drawPanelRect = (x: number, y: number, w: number, h: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x * scale), Math.floor(y * scale), Math.floor(w * scale), Math.floor(h * scale));
  };

  // 1. BODY FRONT (x: 41, y: 41, w: 942, h: 1290)
  const fx = 41, fy = 41, fw = 942, fh = 1290;
  drawBleedRect(fx, fy, fw, fh, baseColor);
  drawPanelRect(fx, fy, fw, fh, baseColor);

  // Motif Overlay on Front
  if (motif !== 'none') {
    ctx.save();
    const grid = Math.floor(120 * scale);
    ctx.fillStyle = secondaryColor;
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = Math.max(1, 2 * scale);

    const startX = Math.floor((fx + 100) * scale);
    const endX = Math.floor((fx + fw - 100) * scale);
    const startY = Math.floor((fy + 200) * scale);
    const endY = Math.floor((fy + fh - 200) * scale);

    for (let my = startY; my < endY; my += grid) {
      for (let mx = startX; mx < endX; mx += grid) {
        const cx = mx + grid / 2;
        const cy = my + grid / 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy - 35 * scale);
        ctx.lineTo(cx + 35 * scale, cy);
        ctx.lineTo(cx, cy + 35 * scale);
        ctx.lineTo(cx - 35 * scale, cy);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // Front Text & Number
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Player Name Front Chest
  ctx.fillStyle = accentColor;
  ctx.font = `bold ${Math.floor(44 * scale)}px sans-serif`;
  ctx.fillText(playerName, Math.floor((fx + fw / 2) * scale), Math.floor((fy + 380) * scale));

  // Player Number Front Chest
  ctx.fillStyle = secondaryColor;
  ctx.font = `extrabold ${Math.floor(96 * scale)}px monospace`;
  ctx.fillText(playerNumber, Math.floor((fx + fw / 2) * scale), Math.floor((fy + 480) * scale));

  // Sponsor Logo/Text Lower Chest
  ctx.fillStyle = accentColor;
  ctx.font = `bold ${Math.floor(34 * scale)}px sans-serif`;
  ctx.fillText(sponsorText, Math.floor((fx + fw / 2) * scale), Math.floor((fy + 820) * scale));
  ctx.restore();

  // 2. BODY BACK (x: 1065, y: 41, w: 942, h: 1290)
  const bx = 1065, by = 41, bw = 942, bh = 1290;
  drawBleedRect(bx, by, bw, bh, baseColor);
  drawPanelRect(bx, by, bw, bh, baseColor);

  // Motif Overlay on Back
  if (motif !== 'none') {
    ctx.save();
    const grid = Math.floor(120 * scale);
    ctx.fillStyle = secondaryColor;
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = Math.max(1, 2 * scale);

    const startX = Math.floor((bx + 100) * scale);
    const endX = Math.floor((bx + bw - 100) * scale);
    const startY = Math.floor((by + 200) * scale);
    const endY = Math.floor((by + bh - 200) * scale);

    for (let my = startY; my < endY; my += grid) {
      for (let mx = startX; mx < endX; mx += grid) {
        const cx = mx + grid / 2;
        const cy = my + grid / 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy - 35 * scale);
        ctx.lineTo(cx + 35 * scale, cy);
        ctx.lineTo(cx, cy + 35 * scale);
        ctx.lineTo(cx - 35 * scale, cy);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // Back Player Name & Large Number
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillStyle = accentColor;
  ctx.font = `bold ${Math.floor(54 * scale)}px sans-serif`;
  ctx.fillText(playerName, Math.floor((bx + bw / 2) * scale), Math.floor((by + 280) * scale));

  ctx.fillStyle = accentColor;
  ctx.font = `extrabold ${Math.floor(160 * scale)}px monospace`;
  ctx.fillText(playerNumber, Math.floor((bx + bw / 2) * scale), Math.floor((by + 440) * scale));
  ctx.restore();

  // 3. SLEEVE LEFT (x: 41, y: 1392, w: 881, h: 410)
  const lx = 41, ly = 1392, lw = 881, lh = 410;
  drawBleedRect(lx, ly, lw, lh, secondaryColor);
  drawPanelRect(lx, ly, lw, lh, secondaryColor);
  // Sleeve Cuff Stripe Accent
  ctx.fillStyle = accentColor;
  ctx.fillRect(
    Math.floor(lx * scale),
    Math.floor((ly + lh - 50) * scale),
    Math.floor(lw * scale),
    Math.floor(50 * scale)
  );

  // 4. SLEEVE RIGHT (x: 1126, y: 1392, w: 881, h: 410)
  const rx = 1126, ry = 1392, rw = 881, rh = 410;
  drawBleedRect(rx, ry, rw, rh, secondaryColor);
  drawPanelRect(rx, ry, rw, rh, secondaryColor);
  ctx.fillStyle = accentColor;
  ctx.fillRect(
    Math.floor(rx * scale),
    Math.floor((ry + rh - 50) * scale),
    Math.floor(rw * scale),
    Math.floor(50 * scale)
  );

  // 5. COLLAR RIB (x: 41, y: 1843, w: 1966, h: 164)
  const cx = 41, cy = 1843, cw = 1966, ch = 164;
  drawBleedRect(cx, cy, cw, ch, secondaryColor);
  drawPanelRect(cx, cy, cw, ch, secondaryColor);
  // Rib Accent Stripe
  ctx.fillStyle = accentColor;
  ctx.fillRect(
    Math.floor(cx * scale),
    Math.floor((cy + ch / 3) * scale),
    Math.floor(cw * scale),
    Math.floor(24 * scale)
  );
  ctx.fillStyle = baseColor;
  ctx.fillRect(
    Math.floor(cx * scale),
    Math.floor((cy + (2 * ch) / 3) * scale),
    Math.floor(cw * scale),
    Math.floor(16 * scale)
  );

  return canvas;
}

export function createJerseyAtlasTexture(
  config: DesignConfig | DesignState,
  options: AtlasOptions = {}
): THREE.CanvasTexture {
  const canvas = renderJerseyAtlasCanvas(config, options);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}
