import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 2D SVG Pattern Generator for Riza Apparel Custom Jersey (T1)
 * Models: vneck-setin & raglan-crew
 * Parameters: Size L (Lebar Dada: 520mm, Panjang Baju: 720mm, Seam Allowance: 10mm, Bleed: 5mm)
 */

const DEFAULT_PARAMS = {
  size: 'L [PLACEHOLDER - Standar Futsal NTT]',
  lebarDada: 520,
  panjangBaju: 720,
  lebarBahu: 450,
  panjangLengan: 240,
  lingkarKerah: 460,
  seamAllowance: 10,
  bleed: 5,
};

function generateVNeckSetInSVG(params = DEFAULT_PARAMS) {
  const { lebarDada, panjangBaju, seamAllowance, bleed } = params;
  const totalW = 1200;
  const totalH = 900;

  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="${totalW}mm" height="${totalH}mm" viewBox="0 0 ${totalW} ${totalH}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .seam-line { fill: none; stroke: #0284C7; stroke-width: 1.5; stroke-dasharray: 4 2; }
    .cut-line { fill: none; stroke: #E11D48; stroke-width: 2; }
    .bleed-line { fill: none; stroke: #F59E0B; stroke-width: 1; stroke-dasharray: 2 2; }
    .panel-bg { fill: #F8FAFC; stroke: #CBD5E1; stroke-width: 1; }
    .text-label { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: bold; fill: #0F172A; }
    .text-sub { font-family: monospace; font-size: 10px; fill: #64748B; }
  </style>

  <!-- BACKGROUND METADATA -->
  <rect width="${totalW}" height="${totalH}" fill="#FFFFFF"/>
  <text x="30" y="40" class="text-label" font-size="20">RIZA APPAREL — POLA 2D V-NECK SET-IN (SIZE ${params.size})</text>
  <text x="30" y="62" class="text-sub">Lebar Dada: ${lebarDada}mm | Panjang Baju: ${panjangBaju}mm | Seam Allowance: ${seamAllowance}mm | Bleed: ${bleed}mm</text>

  <!-- 1. PANELS TORSO DEPAN (FRONT TORSO) -->
  <g id="panel-front" transform="translate(60, 100)">
    <!-- Bleed Outer Boundary -->
    <path d="M 260,20 L 370,55 L 340,210 L 320,735 L 20,735 L 0,210 L -30,55 L 80,20 Q 170,165 260,20 Z" class="bleed-line"/>
    <!-- Cut Line -->
    <path d="M 255,25 L 365,58 L 335,205 L 315,730 L 25,730 L -5,205 L -25,58 L 85,25 Q 170,155 255,25 Z" class="cut-line panel-bg"/>
    <!-- Seam Allowance Inner Line -->
    <path d="M 245,35 L 355,65 L 325,200 L 305,720 L 35,720 L 5,200 L -15,65 L 95,35 Q 170,145 245,35 Z" class="seam-line"/>
    <text x="170" y="320" text-anchor="middle" class="text-label">BADAN DEPAN (TORSO FRONT)</text>
    <text x="170" y="345" text-anchor="middle" class="text-sub">Panel ID: mat_torso_front | V-Neck Cutout</text>
  </g>

  <!-- 2. PANELS TORSO BELAKANG (BACK TORSO) -->
  <g id="panel-back" transform="translate(480, 100)">
    <path d="M 255,25 L 365,58 L 335,205 L 315,730 L 25,730 L -5,205 L -25,58 L 85,25 Q 170,55 255,25 Z" class="cut-line panel-bg"/>
    <path d="M 245,35 L 355,65 L 325,200 L 305,720 L 35,720 L 5,200 L -15,65 L 95,35 Q 170,62 245,35 Z" class="seam-line"/>
    <text x="170" y="320" text-anchor="middle" class="text-label">BADAN BELAKANG (TORSO BACK)</text>
    <text x="170" y="345" text-anchor="middle" class="text-sub">Panel ID: mat_torso_back | High Neck Curve</text>
  </g>

  <!-- 3. LENGAN KIRI (LEFT SLEEVE) -->
  <g id="panel-sleeve-left" transform="translate(870, 100)">
    <path d="M 120,20 Q 220,120 200,280 L 10,280 Q -10,120 120,20 Z" class="cut-line panel-bg"/>
    <path d="M 120,30 Q 210,125 190,270 L 20,270 Q 0,125 120,30 Z" class="seam-line"/>
    <text x="105" y="160" text-anchor="middle" class="text-label">LENGAN KIRI</text>
    <text x="105" y="180" text-anchor="middle" class="text-sub">mat_sleeve_left</text>
  </g>

  <!-- 4. LENGAN KANAN (RIGHT SLEEVE) -->
  <g id="panel-sleeve-right" transform="translate(870, 420)">
    <path d="M 120,20 Q 220,120 200,280 L 10,280 Q -10,120 120,20 Z" class="cut-line panel-bg"/>
    <path d="M 120,30 Q 210,125 190,270 L 20,270 Q 0,125 120,30 Z" class="seam-line"/>
    <text x="105" y="160" text-anchor="middle" class="text-label">LENGAN KANAN</text>
    <text x="105" y="180" text-anchor="middle" class="text-sub">mat_sleeve_right</text>
  </g>

  <!-- 5. KERAH V-NECK (V-NECK RIB COLLAR BAND) -->
  <g id="panel-collar" transform="translate(870, 730)">
    <rect x="0" y="0" width="280" height="50" rx="4" class="cut-line panel-bg"/>
    <rect x="10" y="8" width="260" height="34" rx="2" class="seam-line"/>
    <text x="140" y="30" text-anchor="middle" class="text-label">RIB KERAH V-NECK</text>
    <text x="140" y="44" text-anchor="middle" class="text-sub">mat_collar</text>
  </g>

</svg>`;
}

function generateRaglanCrewSVG(params = DEFAULT_PARAMS) {
  const { lebarDada, panjangBaju, seamAllowance, bleed } = params;
  const totalW = 1200;
  const totalH = 900;

  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="${totalW}mm" height="${totalH}mm" viewBox="0 0 ${totalW} ${totalH}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .seam-line { fill: none; stroke: #0284C7; stroke-width: 1.5; stroke-dasharray: 4 2; }
    .cut-line { fill: none; stroke: #E11D48; stroke-width: 2; }
    .bleed-line { fill: none; stroke: #F59E0B; stroke-width: 1; stroke-dasharray: 2 2; }
    .panel-bg { fill: #F8FAFC; stroke: #CBD5E1; stroke-width: 1; }
    .text-label { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: bold; fill: #0F172A; }
    .text-sub { font-family: monospace; font-size: 10px; fill: #64748B; }
  </style>

  <!-- BACKGROUND METADATA -->
  <rect width="${totalW}" height="${totalH}" fill="#FFFFFF"/>
  <text x="30" y="40" class="text-label" font-size="20">RIZA APPAREL — POLA 2D RAGLAN CREW-NECK (SIZE ${params.size})</text>
  <text x="30" y="62" class="text-sub">Lebar Dada: ${lebarDada}mm | Panjang Baju: ${panjangBaju}mm | Seam Allowance: ${seamAllowance}mm | Bleed: ${bleed}mm</text>

  <!-- 1. PANELS TORSO DEPAN (RAGLAN FRONT) -->
  <g id="panel-front" transform="translate(60, 100)">
    <path d="M 220,30 L 320,180 L 305,730 L 35,730 L 20,180 L 120,30 Q 170,110 220,30 Z" class="cut-line panel-bg"/>
    <path d="M 210,40 L 310,185 L 295,720 L 45,720 L 30,185 L 130,40 Q 170,100 210,40 Z" class="seam-line"/>
    <text x="170" y="320" text-anchor="middle" class="text-label">RAGLAN BADAN DEPAN</text>
    <text x="170" y="345" text-anchor="middle" class="text-sub">Panel ID: mat_torso_front</text>
  </g>

  <!-- 2. PANELS TORSO BELAKANG (RAGLAN BACK) -->
  <g id="panel-back" transform="translate(480, 100)">
    <path d="M 220,30 L 320,180 L 305,730 L 35,730 L 20,180 L 120,30 Q 170,50 220,30 Z" class="cut-line panel-bg"/>
    <path d="M 210,40 L 310,185 L 295,720 L 45,720 L 30,185 L 130,40 Q 170,60 210,40 Z" class="seam-line"/>
    <text x="170" y="320" text-anchor="middle" class="text-label">RAGLAN BADAN BELAKANG</text>
    <text x="170" y="345" text-anchor="middle" class="text-sub">Panel ID: mat_torso_back</text>
  </g>

  <!-- 3. RAGLAN LENGAN KIRI -->
  <g id="panel-sleeve-left" transform="translate(870, 100)">
    <path d="M 120,10 L 230,180 L 200,380 L 40,380 L 10,180 Z" class="cut-line panel-bg"/>
    <path d="M 120,20 L 220,185 L 190,370 L 50,370 L 20,185 Z" class="seam-line"/>
    <text x="120" y="200" text-anchor="middle" class="text-label">RAGLAN LENGAN KIRI</text>
    <text x="120" y="220" text-anchor="middle" class="text-sub">mat_sleeve_left</text>
  </g>

  <!-- 4. RAGLAN LENGAN KANAN -->
  <g id="panel-sleeve-right" transform="translate(870, 500)">
    <path d="M 120,10 L 230,180 L 200,340 L 40,340 L 10,180 Z" class="cut-line panel-bg"/>
    <path d="M 120,20 L 220,185 L 190,330 L 50,330 L 20,185 Z" class="seam-line"/>
    <text x="120" y="180" text-anchor="middle" class="text-label">RAGLAN LENGAN KANAN</text>
    <text x="120" y="200" text-anchor="middle" class="text-sub">mat_sleeve_right</text>
  </g>

</svg>`;
}

// Ensure destination dir exists
const patternsDir = path.resolve(__dirname, '../patterns');
if (!fs.existsSync(patternsDir)) {
  fs.mkdirSync(patternsDir, { recursive: true });
}

// Write 2D Flat SVG Pattern Files
fs.writeFileSync(path.join(patternsDir, 'vneck-setin.svg'), generateVNeckSetInSVG());
fs.writeFileSync(path.join(patternsDir, 'raglan-crew.svg'), generateRaglanCrewSVG());

console.log('✅ Success: 2D Flat SVG Patterns generated at assets-pipeline/patterns/');
