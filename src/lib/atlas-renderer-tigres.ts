import * as THREE from 'three';
import { DesignConfig, DesignState } from '../types';

export function createTigresTexture(
  config: DesignConfig | DesignState
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    const tex = new THREE.CanvasTexture(canvas);
    tex.flipY = false;
    return tex;
  }

  const cfg = config as (DesignConfig & Partial<DesignState>);
  const baseColor = cfg.baseColor || '#881337';
  const secondaryColor = cfg.secondaryColor || '#f59e0b';
  const accentColor = cfg.accentColor || '#ffffff';
  const playerName = cfg.playerName || 'RIZA SPORT';
  const playerNumber = cfg.playerNumber || '10';
  const sponsorText = cfg.sponsorText || 'RIZA SPORT';

  // 1. Fill background (Base Color)
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 2048, 2048);

  const cellSize = 128; // 2048 / 16

  // Helper to get center of a grid cell
  const getPos = (colChar: string, rowNum: number) => {
    const xIdx = colChar.charCodeAt(0) - 65; // A=0, B=1, ...
    const yIdx = rowNum - 1; // 1=0, 2=1, ...
    return {
      x: xIdx * cellSize + cellSize / 2,
      y: yIdx * cellSize + cellSize / 2
    };
  };

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Matematika UV Map telah terpecahkan murni dari diagnosis warna:
  // - Kiri Kanvas (Biru) -> Kiri Model (Biru) => Sumbu X NORMAL
  // - Atas Kanvas (Merah) -> Bawah Model (Merah) => Sumbu Y TERBALIK (Flipped Vertically)
  // Solusi Definitif: Balikkan sumbu Y di Kanvas (scale(1, -1))
  
  const drawDefinitiveText = (text: string, x: number, y: number, font: string, fillStyle: string) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1, -1); // FLIP Y
    ctx.fillStyle = fillStyle;
    ctx.font = font;
    ctx.fillText(text, 0, 0);
    ctx.restore();
  };

  // 2. SPONSOR (Dada Tengah: D7 dan E7)
  const sponsorPos = { 
    x: (getPos('D', 7).x + getPos('E', 7).x) / 2, 
    y: getPos('D', 7).y 
  };
  drawDefinitiveText(sponsorText, sponsorPos.x, sponsorPos.y, 'bold 64px sans-serif', accentColor);

  // 3. LOGO TIM (Dada Kiri: C9 -> digeser sedikit ke tengah)
  const logoPos = {
    x: getPos('C', 9).x + 30,
    y: getPos('C', 9).y 
  };
  ctx.save();
  ctx.translate(logoPos.x, logoPos.y);
  ctx.scale(1, -1); // FLIP Y
  ctx.beginPath();
  ctx.arc(0, 0, 40, 0, Math.PI * 2);
  ctx.fillStyle = secondaryColor;
  ctx.fill();
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.fillStyle = accentColor;
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('LOGO', 0, 0);
  ctx.restore();

  // 4. NOMOR PUNGGUNG (Punggung Tengah: L7 dan M7)
  const numPos = { 
    x: (getPos('L', 7).x + getPos('M', 7).x) / 2, 
    y: getPos('L', 7).y 
  };
  drawDefinitiveText(playerNumber, numPos.x, numPos.y, 'bold 150px monospace', accentColor);

  // 5. NAMA PEMAIN (Punggung Atas: L9 dan M9)
  const namePos = { 
    x: (getPos('L', 9).x + getPos('M', 9).x) / 2, 
    y: getPos('L', 9).y 
  };
  drawDefinitiveText(playerName, namePos.x, namePos.y, 'bold 70px sans-serif', accentColor);

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.flipY = false; // GLTF standard
  
  return texture;
}
