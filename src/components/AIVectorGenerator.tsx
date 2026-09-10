import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  RefreshCw, 
  Check, 
  Download, 
  Shield, 
  Grid, 
  Zap, 
  Layers, 
  Copy,
  ChevronRight,
  ArrowRight,
  Palette,
  Sliders,
  Maximize2
} from 'lucide-react';

interface AIVectorGeneratorProps {
  onApplyPattern: (dataUrl: string, name: string) => void;
  onApplyLogo: (dataUrl: string, name: string) => void;
  isDark?: boolean;
  currentJerseyColors?: [string, string, string];
}

export interface PresetPrompt {
  id: string;
  title: string;
  category: 'motif' | 'crest';
  prompt: string;
  badge: string;
  colorScheme: [string, string, string];
  tags: string[];
}

export const PRESET_PROMPTS: PresetPrompt[] = [
  {
    id: 'ende-gold-maroon',
    title: 'Tenun Ikat Ende Zawo Gold',
    category: 'motif',
    prompt: 'Motif tenun ikat tradisional Ende Flores NTT pola Zawo simetris belah ketupat berlapis benang emas dan maroon pekat dengan aksen anyaman geometris zigzag watu api untuk sublimasi jersey atletis',
    badge: 'Heritage NTT',
    colorScheme: ['#881337', '#F59E0B', '#111827'],
    tags: ['tenun', 'ende', 'zawo', 'ikat', 'emas', 'marun'],
  },
  {
    id: 'flores-cyber-waves',
    title: 'Flores Ocean Aerodynamic Wave',
    category: 'motif',
    prompt: 'Pola gelombang laut dinamis Flores dengan sapuan garis kecepatan aerodinamis modern cyan dan navy sport texture untuk jersey futsal dan lari',
    badge: 'Modern Sport',
    colorScheme: ['#0284C7', '#0F172A', '#38BDF8'],
    tags: ['wave', 'ombak', 'laut', 'cyan', 'navy', 'speed'],
  },
  {
    id: 'garuda-athletic-crest',
    title: 'Majestic Garuda Tournament Crest',
    category: 'crest',
    prompt: 'Emblem perisai atletis turnamen sayap Garuda megah bersudut geometris presisi dengan bingkai 3D gold beveled metallic dan bintang kejuaraan',
    badge: 'Tournament Crest',
    colorScheme: ['#D97706', '#111827', '#FDE047'],
    tags: ['garuda', 'elang', 'sayap', 'crest', 'perisai', 'emas'],
  },
  {
    id: 'speed-slash-stripes',
    title: 'Speed Slash Racing Chevrons',
    category: 'motif',
    prompt: 'Pola garis tajam chevron racing diagonal kecepatan tinggi dengan aksen akselerasi neon amber dan midnight violet untuk jersey futsal pro',
    badge: 'Speed Racing',
    colorScheme: ['#B45309', '#581C87', '#FBBF24'],
    tags: ['speed', 'chevron', 'slash', 'stripes', 'racing', 'amber'],
  },
  {
    id: 'kelimutu-geometric',
    title: 'Kelimutu Tri-Color Crater Poly',
    category: 'motif',
    prompt: 'Pola kristal poligon geometris terinspirasi tiga danau kawah Kelimutu NTT dalam gradasi zamrud toska tembaga dan slate gelap',
    badge: 'Heritage NTT',
    colorScheme: ['#059669', '#0284C7', '#D97706'],
    tags: ['kelimutu', 'poligon', 'kristal', 'hijau', 'toska', 'tembaga'],
  },
  {
    id: 'komodo-dragon-shield',
    title: 'Komodo Apex Futsal Shield',
    category: 'crest',
    prompt: 'Emblem maskot kepala naga Komodo modern tajam dengan perisai atletis agresif aksen sisik geometris dan taring perak untuk klub sepakbola',
    badge: 'Club Mascot',
    colorScheme: ['#064E3B', '#10B981', '#F59E0B'],
    tags: ['komodo', 'naga', 'dragon', 'perisai', 'hijau', 'emas'],
  },
  {
    id: 'hex-tech-mesh',
    title: 'Hex Carbon Tech Cooling Mesh',
    category: 'motif',
    prompt: 'Pola sarang lebah hexagonal serat karbon berteknologi tinggi dengan pori sirkulasi mikro dan aksen gradasi titanium cyan untuk performa profesional',
    badge: 'Pro Tech',
    colorScheme: ['#334155', '#0F172A', '#06B6D4'],
    tags: ['hex', 'carbon', 'tech', 'honeycomb', 'cyan', 'abu'],
  },
  {
    id: 'royal-lion-badge',
    title: 'Royal Lion Crown Championship',
    category: 'crest',
    prompt: 'Emblem singa mahkota emas megah dengan bintang kejuaraan dan pita juara perisai ganda untuk lambang tim sepakbola profesional',
    badge: 'Royal Crest',
    colorScheme: ['#B45309', '#7C2D12', '#FDE047'],
    tags: ['singa', 'lion', 'mahkota', 'emas', 'perisai', 'juara'],
  },
];

// Helper to parse prompt and pick matching color palette
const extractColorsFromPrompt = (prompt: string, fallback: [string, string, string]): [string, string, string] => {
  const p = prompt.toLowerCase();
  let c1 = fallback[0];
  let c2 = fallback[1];
  let c3 = fallback[2];

  if (p.includes('maroon') || p.includes('marun') || p.includes('merah hati')) {
    c1 = '#881337';
    c2 = '#F59E0B';
    c3 = '#111827';
  } else if (p.includes('merah') || p.includes('red') || p.includes('crimson')) {
    c1 = '#DC2626';
    c2 = '#111827';
    c3 = '#FFFFFF';
  } else if (p.includes('emas') || p.includes('gold') || p.includes('kuning')) {
    c1 = '#D97706';
    c2 = '#111827';
    c3 = '#FDE047';
  } else if (p.includes('cyan') || p.includes('toska') || p.includes('turquoise')) {
    c1 = '#0284C7';
    c2 = '#0F172A';
    c3 = '#38BDF8';
  } else if (p.includes('biru') || p.includes('navy') || p.includes('blue')) {
    c1 = '#1E3A8A';
    c2 = '#0284C7';
    c3 = '#F8FAFC';
  } else if (p.includes('hijau') || p.includes('green') || p.includes('zamrud')) {
    c1 = '#065F46';
    c2 = '#10B981';
    c3 = '#F59E0B';
  } else if (p.includes('ungu') || p.includes('purple') || p.includes('violet')) {
    c1 = '#581C87';
    c2 = '#A855F7';
    c3 = '#FCD34D';
  } else if (p.includes('hitam') || p.includes('black') || p.includes('dark')) {
    c1 = '#0F172A';
    c2 = '#334155';
    c3 = '#94A3B8';
  }
  return [c1, c2, c3];
};

// Procedural SVG Synthesizer based on detailed prompt instructions
const generateAccurateVectorSVG = (
  prompt: string, 
  category: 'motif' | 'crest', 
  colors: [string, string, string],
  detailLevel: 'balanced' | 'high'
) => {
  const [c1, c2, c3] = colors;
  const p = prompt.toLowerCase();

  // CREST / EMBLEM GENERATION
  if (category === 'crest') {
    const isGaruda = p.includes('garuda') || p.includes('elang') || p.includes('sayap') || p.includes('eagle');
    const isKomodo = p.includes('komodo') || p.includes('naga') || p.includes('dragon');
    const isLion = p.includes('singa') || p.includes('lion') || p.includes('mahkota');

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 260" width="480" height="520">
      <defs>
        <linearGradient id="crestGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${c1}" />
          <stop offset="50%" stop-color="${c2}" />
          <stop offset="100%" stop-color="${c3}" />
        </linearGradient>
        <linearGradient id="shieldFillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#111827" />
          <stop offset="100%" stop-color="#030712" />
        </linearGradient>
        <linearGradient id="bevelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.25" />
          <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0.35" />
        </linearGradient>
        <filter id="badgeShadow3D" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="#000000" flood-opacity="0.6"/>
        </filter>
      </defs>

      <g filter="url(#badgeShadow3D)">
        <!-- Outer 3D Beveled Shield -->
        <polygon points="120,12 215,48 215,142 120,240 25,142 25,48" fill="url(#crestGoldGrad)" stroke="#000000" stroke-width="2" />
        
        <!-- Inner Dark Shield -->
        <polygon points="120,26 200,56 200,135 120,222 40,135 40,56" fill="url(#shieldFillGrad)" stroke="${c2}" stroke-width="2" />
        <polygon points="120,26 200,56 200,135 120,222 40,135 40,56" fill="url(#bevelGrad)" />

        <!-- Accent Inner Chevron Stripes -->
        <path d="M60,75 L120,115 L180,75 L180,88 L120,128 L60,88 Z" fill="${c1}" opacity="0.6" />
        <path d="M70,95 L120,130 L170,95 L170,105 L120,140 L70,105 Z" fill="${c2}" opacity="0.8" />

        ${isGaruda ? `
          <!-- Garuda / Eagle Wings Motif -->
          <g transform="translate(120, 115)">
            <!-- Left Wing Feathers -->
            <path d="M-5,-45 C-30,-48 -75,-25 -82,5 C-72,2 -45,-15 -25,-18 C-45,-5 -65,12 -68,32 C-55,22 -35,10 -15,5 C-30,18 -45,35 -40,52 C-28,38 -15,25 -5,18 Z" fill="url(#crestGoldGrad)" stroke="#111827" stroke-width="1.5" />
            <!-- Right Wing Feathers -->
            <path d="M5,-45 C30,-48 75,-25 82,5 C72,2 45,-15 25,-18 C45,-5 65,12 68,32 C55,22 35,10 15,5 C30,18 45,35 40,52 C28,38 15,25 5,18 Z" fill="url(#crestGoldGrad)" stroke="#111827" stroke-width="1.5" />
            <!-- Central Shield & Eagle Head -->
            <polygon points="0,-35 22,-5 0,22 -22,-5" fill="${c2}" stroke="#FFFFFF" stroke-width="1.5" />
            <polygon points="0,-25 14,-5 0,14 -14,-5" fill="#111827" />
            <circle cx="0" cy="-5" r="4" fill="${c3}" />
          </g>
        ` : isKomodo ? `
          <!-- Komodo Apex Predator Mascot -->
          <g transform="translate(120, 115)">
            <!-- Aggressive Head Silhouette -->
            <path d="M0,-48 C32,-45 55,-20 52,15 C45,35 22,50 0,55 C-22,50 -45,35 -52,15 C-55,-20 -32,-45 0,-48 Z" fill="#064E3B" stroke="${c2}" stroke-width="3" />
            <!-- Scales & Sharp Crest -->
            <path d="M-30,-15 L0,-38 L30,-15 L22,-5 L0,-25 L-22,-5 Z" fill="${c2}" />
            <path d="M-25,10 L0,-5 L25,10 L18,20 L0,5 L-18,20 Z" fill="${c3}" />
            <!-- Glowing Fierce Eyes -->
            <polygon points="-16,-5 -10,-8 -6,-4 -12,-2" fill="${c3}" />
            <polygon points="16,-5 10,-8 6,-4 12,-2" fill="${c3}" />
            <!-- Fangs / Teeth -->
            <polygon points="-12,28 -8,40 -4,28" fill="#FFFFFF" />
            <polygon points="12,28 8,40 4,28" fill="#FFFFFF" />
          </g>
        ` : isLion ? `
          <!-- Royal Lion Mascot & Crown -->
          <g transform="translate(120, 115)">
            <!-- Crown Top -->
            <path d="M-32,-42 L-22,-25 L0,-38 L22,-25 L32,-42 L26,-15 L-26,-15 Z" fill="${c3}" stroke="#111827" stroke-width="1.5" />
            <!-- Lion Mane & Face -->
            <circle cx="0" cy="5" r="38" fill="${c1}" stroke="${c2}" stroke-width="2" />
            <circle cx="0" cy="8" r="28" fill="#111827" />
            <!-- Eyes & Nose -->
            <circle cx="-10" cy="2" r="3.5" fill="${c3}" />
            <circle cx="10" cy="2" r="3.5" fill="${c3}" />
            <polygon points="0,12 8,20 -8,20" fill="${c2}" />
            <path d="M-8,24 Q0,29 8,24" stroke="${c3}" stroke-width="2" fill="none" />
          </g>
        ` : `
          <!-- Classic Athletic Heraldic Emblem -->
          <g transform="translate(120, 115)">
            <polygon points="0,-40 38,-10 38,25 0,50 -38,25 -38,-10" fill="${c2}" stroke="#FFFFFF" stroke-width="2" />
            <polygon points="0,-28 26,-6 26,18 0,38 -26,18 -26,-6" fill="#111827" />
            <!-- Central Star & Flash -->
            <path d="M0,-20 L5,-6 L18,-6 L8,2 L12,16 L0,8 L-12,16 L-8,2 L-18,-6 L-5,-6 Z" fill="${c3}" stroke="${c1}" stroke-width="1" />
          </g>
        `}

        <!-- Championship Stars -->
        <g fill="${c3}" stroke="#111827" stroke-width="0.8">
          <path d="M120,38 L122,44 L128,44 L123,48 L125,54 L120,50 L115,54 L117,48 L112,44 L118,44 Z" />
          <path d="M96,44 L98,49 L104,49 L99,52 L101,57 L96,54 L91,57 L93,52 L88,49 L94,49 Z" />
          <path d="M144,44 L146,49 L152,49 L147,52 L149,57 L144,54 L139,57 L141,52 L136,49 L142,49 Z" />
        </g>

        <!-- Banner Ribbon at Bottom -->
        <g transform="translate(120, 202)">
          <path d="M-75,0 L-55,-10 L55,-10 L75,0 L58,16 L-58,16 Z" fill="url(#crestGoldGrad)" stroke="#111827" stroke-width="2" />
          <text x="0" y="6" fill="#111827" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="10" text-anchor="middle" letter-spacing="2">
            RIZA SPORT
          </text>
        </g>
      </g>
    </svg>`;
  }

  // MOTIF / PATTERN SUBLIMATION GENERATION
  const isEndeZawo = p.includes('ende') || p.includes('zawo') || p.includes('tenun') || p.includes('ikat') || p.includes('flores');
  const isWave = p.includes('wave') || p.includes('ombak') || p.includes('laut') || p.includes('air');
  const isSpeed = p.includes('speed') || p.includes('chevron') || p.includes('slash') || p.includes('racing') || p.includes('garis');
  const isHexTech = p.includes('hex') || p.includes('honeycomb') || p.includes('carbon') || p.includes('tech');
  const isPolyCrater = p.includes('kelimutu') || p.includes('kawah') || p.includes('poligon') || p.includes('crater') || p.includes('kristal');

  // 1. TENUN IKAT ENDE ZAWO (HERITAGE NTT)
  if (isEndeZawo) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="800" height="800">
      <defs>
        <linearGradient id="endeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${c1}" />
          <stop offset="50%" stop-color="${c2}" />
          <stop offset="100%" stop-color="${c3}" />
        </linearGradient>
        <pattern id="endeWeave" width="80" height="80" patternUnits="userSpaceOnUse">
          <!-- Stepped diamond lozenge (Zawo Traditional Rhombus) -->
          <polygon points="40,4 76,40 40,76 4,40" fill="none" stroke="${c2}" stroke-width="3" />
          <polygon points="40,12 68,40 40,68 12,40" fill="${c1}" opacity="0.65" />
          <polygon points="40,20 60,40 40,60 20,40" fill="${c2}" opacity="0.85" />
          <polygon points="40,28 52,40 40,52 28,40" fill="${c3}" />
          <!-- Serrated Zigzag Watu Api Border Weave -->
          <polyline points="0,0 8,8 16,0 24,8 32,0 40,8 48,0 56,8 64,0 72,8 80,0" stroke="${c2}" stroke-width="1.8" fill="none" opacity="0.75" />
          <polyline points="0,80 8,72 16,80 24,72 32,80 40,72 48,80 56,72 64,80 72,72 80,80" stroke="${c2}" stroke-width="1.8" fill="none" opacity="0.75" />
          <!-- Center Sacred Star -->
          <circle cx="40" cy="40" r="3.5" fill="#FFFFFF" />
        </pattern>
      </defs>
      <rect width="400" height="400" fill="#0B0F19" />
      <rect width="400" height="400" fill="url(#endeWeave)" />
      <!-- High-End Diagonal Gradient Slashes -->
      <path d="M-40,180 L280,-140 L340,-80 L20,240 Z" fill="${c1}" opacity="0.45" />
      <path d="M40,260 L360,-60 L420,0 L100,320 Z" fill="${c2}" opacity="0.5" />
      <!-- Subtle Golden Ray Mesh -->
      <g stroke="${c3}" stroke-width="1" fill="none" opacity="0.3">
        <line x1="0" y1="0" x2="400" y2="400" />
        <line x1="400" y1="0" x2="0" y2="400" />
      </g>
    </svg>`;
  }

  // 2. FLORES CYBER WAVES (AERODYNAMIC SPORTSWEAR)
  if (isWave) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="800" height="800">
      <defs>
        <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${c1}" />
          <stop offset="100%" stop-color="${c3}" />
        </linearGradient>
        <linearGradient id="waveGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${c2}" />
          <stop offset="100%" stop-color="#0284C7" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="#0A0F1D" />
      <!-- Sweeping Aerodynamic Wave Strips -->
      <path d="M-50,80 Q100,160 250,60 T450,120 L450,180 Q250,120 100,220 T-50,140 Z" fill="url(#waveGrad1)" opacity="0.75" />
      <path d="M-50,160 Q120,240 280,140 T450,200 L450,270 Q280,210 120,310 T-50,230 Z" fill="url(#waveGrad2)" opacity="0.65" />
      <path d="M-50,250 Q140,320 310,220 T450,290 L450,370 Q310,300 140,400 T-50,330 Z" fill="${c3}" opacity="0.55" />
      <!-- Hydrodynamic Speed Lines & Water Cuts -->
      <g stroke="${c3}" stroke-width="1.8" stroke-dasharray="8 6" opacity="0.5">
        <path d="M-20,110 Q110,190 260,90 T430,150" fill="none" />
        <path d="M-20,190 Q130,270 290,170 T430,230" fill="none" />
        <path d="M-20,280 Q150,350 320,250 T430,320" fill="none" />
      </g>
    </svg>`;
  }

  // 3. SPEED RACING & CHEVRONS
  if (isSpeed) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="800" height="800">
      <defs>
        <linearGradient id="speedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${c1}" />
          <stop offset="50%" stop-color="${c2}" />
          <stop offset="100%" stop-color="${c3}" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="#0B0B14" />
      <!-- Sharp Angled Racing Chevrons -->
      <g transform="translate(0, 0)">
        <polygon points="-40,60 220,-80 260,-40 0,100" fill="${c1}" opacity="0.8" />
        <polygon points="10,120 270,-20 310,20 50,160" fill="${c2}" opacity="0.85" />
        <polygon points="60,180 320,40 360,80 100,220" fill="url(#speedGrad)" />
        <polygon points="110,240 370,100 410,140 150,280" fill="${c3}" opacity="0.9" />
        <polygon points="160,300 420,160 460,200 200,340" fill="${c2}" opacity="0.75" />
        <polygon points="210,360 470,220 510,260 250,400" fill="${c1}" opacity="0.7" />
      </g>
      <!-- Acceleration Accent Pin-Stripes -->
      <g stroke="${c3}" stroke-width="2" opacity="0.6">
        <line x1="-30" y1="110" x2="230" y2="-30" />
        <line x1="20" y1="170" x2="280" y2="30" />
        <line x1="70" y1="230" x2="330" y2="90" />
        <line x1="120" y1="290" x2="380" y2="150" />
      </g>
    </svg>`;
  }

  // 4. HEX CARBON TECH COOLING MESH
  if (isHexTech) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="800" height="800">
      <defs>
        <pattern id="hexTechPat" width="48" height="84" patternUnits="userSpaceOnUse">
          <polygon points="24,6 44,18 44,42 24,54 4,42 4,18" fill="none" stroke="${c2}" stroke-width="1.8" stroke-opacity="0.4" />
          <polygon points="24,14 38,22 38,38 24,46 10,38 10,22" fill="${c1}" fill-opacity="0.3" />
          <circle cx="24" cy="30" r="3" fill="${c3}" fill-opacity="0.8" />
          <polygon points="48,48 68,60 68,84 48,96 28,84 28,60" fill="none" stroke="${c2}" stroke-width="1.8" stroke-opacity="0.4" />
          <polygon points="0,48 20,60 20,84 0,96 -20,84 -20,60" fill="none" stroke="${c2}" stroke-width="1.8" stroke-opacity="0.4" />
        </pattern>
      </defs>
      <rect width="400" height="400" fill="#0A0E17" />
      <rect width="400" height="400" fill="url(#hexTechPat)" />
      <!-- Cyber Diagonal Glow Bands -->
      <path d="M-80,220 L320,-80 L360,-40 L-40,260 Z" fill="${c3}" opacity="0.4" />
      <path d="M40,320 L440,20 L470,50 L70,350 Z" fill="${c2}" opacity="0.35" />
    </svg>`;
  }

  // 5. KELIMUTU POLYGON CRATER FACETS
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="800" height="800">
    <rect width="400" height="400" fill="#0D1117" />
    <!-- Polygonal Facets and Mineral Shards -->
    <polygon points="0,0 120,40 80,140 0,90" fill="${c1}" opacity="0.7" />
    <polygon points="120,40 240,10 210,120 80,140" fill="${c2}" opacity="0.85" />
    <polygon points="240,10 380,0 350,110 210,120" fill="${c1}" opacity="0.6" />
    <polygon points="380,0 400,0 400,130 350,110" fill="${c3}" opacity="0.75" />

    <polygon points="0,90 80,140 50,250 0,220" fill="${c2}" opacity="0.65" />
    <polygon points="80,140 210,120 180,240 50,250" fill="${c3}" opacity="0.8" />
    <polygon points="210,120 350,110 320,230 180,240" fill="${c2}" opacity="0.7" />
    <polygon points="350,110 400,130 400,260 320,230" fill="${c1}" opacity="0.8" />

    <polygon points="0,220 50,250 30,370 0,400" fill="${c3}" opacity="0.7" />
    <polygon points="50,250 180,240 140,380 30,370" fill="${c1}" opacity="0.85" />
    <polygon points="180,240 320,230 290,390 140,380" fill="${c2}" opacity="0.9" />
    <polygon points="320,230 400,260 400,400 290,390" fill="${c3}" opacity="0.75" />

    <!-- Crystal facet highlights -->
    <g stroke="#FFFFFF" stroke-width="1.2" stroke-opacity="0.3" fill="none">
      <polygon points="80,140 210,120 180,240 50,250" />
      <polygon points="180,240 320,230 290,390 140,380" />
    </g>
  </svg>`;
};

export const AIVectorGenerator: React.FC<AIVectorGeneratorProps> = ({
  onApplyPattern,
  onApplyLogo,
  isDark = true,
  currentJerseyColors = ['#881337', '#F59E0B', '#111827'],
}) => {
  const [promptInput, setPromptInput] = useState('');
  const [activeCategory, setActiveCategory] = useState<'motif' | 'crest'>('motif');
  const [isGenerating, setIsGenerating] = useState(false);
  const [detailLevel, setDetailLevel] = useState<'balanced' | 'high'>('high');
  const [activePresetId, setActivePresetId] = useState<string>('ende-gold-maroon');
  const [colorMode, setColorMode] = useState<'preset' | 'jersey'>('preset');
  const [copiedState, setCopiedState] = useState(false);

  const [generatedVector, setGeneratedVector] = useState<{
    svgCode: string;
    dataUrl: string;
    name: string;
    category: 'motif' | 'crest';
  } | null>(null);

  // Trigger vector generation
  const handleGenerate = (customPrompt?: string, forceCategory?: 'motif' | 'crest') => {
    setIsGenerating(true);
    const finalCategory = forceCategory || activeCategory;
    const rawPrompt = customPrompt || promptInput;
    
    // Choose active preset or fallback
    const preset = PRESET_PROMPTS.find(p => p.id === activePresetId);
    const finalPrompt = rawPrompt.trim() 
      ? rawPrompt 
      : (preset ? preset.prompt : 'Motif tenun ikat Ende Flores NTT Zawo pola simetris emas dan marun sublimasi jersey');

    // Pick active color scheme
    const baseColors: [string, string, string] = colorMode === 'jersey' && currentJerseyColors
      ? currentJerseyColors
      : (preset ? preset.colorScheme : ['#881337', '#F59E0B', '#111827']);

    const resolvedColors = extractColorsFromPrompt(finalPrompt, baseColors);

    setTimeout(() => {
      const svg = generateAccurateVectorSVG(finalPrompt, finalCategory, resolvedColors, detailLevel);
      const encoded = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
      setGeneratedVector({
        svgCode: svg,
        dataUrl: encoded,
        name: finalPrompt.slice(0, 32),
        category: finalCategory,
      });
      setIsGenerating(false);
    }, 700);
  };

  // AI Prompt Enhancer: Expands simple user words into high-detail sublimation specs
  const handleEnhancePrompt = () => {
    const raw = promptInput.trim().toLowerCase();
    if (!raw) {
      setPromptInput(activeCategory === 'crest'
        ? 'Emblem perisai 3D sayap Garuda Flores emas obsidian dengan bintang kejuaraan turnamen atletis'
        : 'Motif tenun ikat Ende Zawo NTT simetris belah ketupat emas marun pekat dengan aksen garis aerodinamis atletis'
      );
      return;
    }

    let enhanced = '';
    if (activeCategory === 'crest') {
      enhanced = `Emblem perisai turnamen 3D presisi tinggi, ${raw}, beveled metallic outline, bintang kejuaraan heraldik atletis, pita juara RIZA SPORT resolusi tajam`;
    } else {
      enhanced = `Pola sublimasi jersey atletis resolusi tinggi, ${raw}, simetri dinamis aerodinamis, gradasi warna tajam anti-pecah untuk kain dry-fit Milano`;
    }
    setPromptInput(enhanced);
  };

  const handleSelectPreset = (preset: PresetPrompt) => {
    setActivePresetId(preset.id);
    setActiveCategory(preset.category);
    setPromptInput(preset.prompt);
    handleGenerate(preset.prompt, preset.category);
  };

  // Append chip tag to prompt
  const handleAppendTag = (tag: string) => {
    setPromptInput((prev) => {
      const trimmed = prev.trim();
      return trimmed ? `${trimmed}, ${tag}` : tag;
    });
  };

  // Download SVG
  const handleDownloadSVG = () => {
    if (!generatedVector) return;
    const blob = new Blob([generatedVector.svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `riza-ai-vector-${generatedVector.category}-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy SVG Code
  const handleCopyCode = () => {
    if (!generatedVector) return;
    navigator.clipboard.writeText(generatedVector.svgCode);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header Info Banner */}
      <div className={`p-4 rounded-2xl border ${
        isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 via-amber-500 to-rose-500 flex items-center justify-center text-white shadow-md shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className={`font-extrabold text-xs sm:text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                AI Vector & 3D Motif Generator
              </h4>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30">
                PRO ENGINE v4
              </span>
            </div>
            <p className={`text-[11px] mt-0.5 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Hasilkan pola motif sublimasi tenun NTT dan emblem perisai atletis presisi berbasis AI sesuai instruksi prompt Anda.
            </p>
          </div>
        </div>
      </div>

      {/* Mode Switcher: Motif vs Crest */}
      <div className={`flex p-1 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
        <button
          type="button"
          onClick={() => setActiveCategory('motif')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all min-h-[38px] ${
            activeCategory === 'motif'
              ? 'bg-brand-600 text-white shadow-sm'
              : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Pola Motif Jersey</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory('crest')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all min-h-[38px] ${
            activeCategory === 'crest'
              ? 'bg-brand-600 text-white shadow-sm'
              : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Emblem / Perisai Tim</span>
        </button>
      </div>

      {/* Preset Inspirations Curated by Admin & Dev */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className={`text-[11px] font-extrabold uppercase tracking-wider block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Template Desain Terverifikasi
          </label>
          <span className="text-[10px] text-brand-400 font-semibold">Pilih Cepat</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PRESET_PROMPTS
            .filter(p => p.category === activeCategory)
            .map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`p-3 rounded-xl border text-left transition-all relative group flex flex-col justify-between ${
                  activePresetId === preset.id
                    ? 'border-brand-500 bg-brand-500/10 shadow-sm ring-1 ring-brand-500/40'
                    : isDark ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-1 w-full mb-1.5">
                  <span className={`text-xs font-extrabold line-clamp-1 group-hover:text-brand-400 transition-colors ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {preset.title}
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                    {preset.badge}
                  </span>
                </div>
                <div className="flex items-center justify-between w-full mt-1">
                  <div className="flex items-center gap-1.5">
                    {preset.colorScheme.map((col, idx) => (
                      <span
                        key={idx}
                        className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-xs"
                        style={{ backgroundColor: col }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-brand-400 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    Pakai <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            ))}
        </div>
      </div>

      {/* Color Sync Toggle */}
      <div className={`p-3 rounded-xl border flex items-center justify-between ${
        isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-brand-400" />
          <span className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            Warna Vektor:
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setColorMode('preset')}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
              colorMode === 'preset'
                ? 'bg-brand-600 text-white shadow-xs'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sesuai Template
          </button>
          <button
            type="button"
            onClick={() => setColorMode('jersey')}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
              colorMode === 'jersey'
                ? 'bg-brand-600 text-white shadow-xs'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Gunakan warna dasar, trim dan aksen jersey saat ini"
          >
            Samakan Jersey
          </button>
        </div>
      </div>

      {/* Custom Prompt Input & AI Enhancer */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className={`text-[11px] font-extrabold uppercase tracking-wider block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Tulis Instruksi / Prompt Kustom Anda
          </label>
          <button
            type="button"
            onClick={handleEnhancePrompt}
            className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            title="Perkaya prompt dengan kosakata teknis sublimasi"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sempurnakan Prompt (AI)</span>
          </button>
        </div>

        <div className="relative">
          <textarea
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder={
              activeCategory === 'crest'
                ? 'Contoh: Emblem perisai turnamen sayap garuda emas bersudut geometris dengan bintang kejuaraan...'
                : 'Contoh: Motif tenun ikat Ende Zawo simetris belah ketupat emas marun untuk jersey futsal...'
            }
            rows={3}
            className={`w-full text-xs p-3 rounded-xl border outline-none transition-all resize-none leading-relaxed ${
              isDark 
                ? 'bg-slate-900/95 border-slate-700 text-white placeholder-slate-500 focus:border-brand-500' 
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-brand-600'
            }`}
          />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {[
            { label: '+ Tenun Ende Zawo', tag: 'motif tenun ikat ende zawo' },
            { label: '+ Emas & Marun', tag: 'warna emas dan marun pekat' },
            { label: '+ Garis Speed', tag: 'garis dinamis aerodinamis speed' },
            { label: '+ Perisai 3D', tag: 'perisai turnamen 3D beveled shield' },
            { label: '+ Hex Tech', tag: 'sarang lebah hex cooling tech' },
            { label: '+ Kelimutu', tag: 'kristal poligon kawah kelimutu' },
          ].map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleAppendTag(chip.tag)}
              className={`text-[10px] px-2 py-1 rounded-md border font-medium transition-all ${
                isDark 
                  ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700' 
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Generate Button */}
        <button
          type="button"
          onClick={() => handleGenerate()}
          disabled={isGenerating}
          className="w-full py-3 px-4 bg-gradient-to-r from-brand-600 via-amber-600 to-rose-600 hover:from-brand-500 hover:to-amber-500 text-white font-extrabold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 min-h-[44px]"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Memproses Vektor AI Sublimasi...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              <span>Generate Vektor Sekarang (Akurat)</span>
            </>
          )}
        </button>
      </div>

      {/* Generated Result Display & Application Actions */}
      {generatedVector && (
        <div className={`p-4 rounded-2xl border space-y-3.5 animate-fade-in ${
          isDark ? 'bg-slate-950 border-brand-500/50' : 'bg-white border-brand-400 shadow-md'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-extrabold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Check className="w-4 h-4 text-emerald-400" />
              Hasil Vektor AI Siap Diterapkan:
            </span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              SVG 300 DPI
            </span>
          </div>

          {/* Canvas Image Container */}
          <div className={`w-full h-44 rounded-xl border overflow-hidden flex items-center justify-center p-3 relative group ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <img 
              src={generatedVector.dataUrl} 
              alt="Generated Vector Result" 
              className="max-h-full max-w-full object-contain drop-shadow-md"
            />
            {/* Quick action buttons on hover */}
            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-90">
              <button
                type="button"
                onClick={handleCopyCode}
                title="Salin Kode SVG"
                className="p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white text-[10px] flex items-center gap-1"
              >
                {copiedState ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
              <button
                type="button"
                onClick={handleDownloadSVG}
                title="Unduh File SVG"
                className="p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white text-[10px] flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* 1-Click Application Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => onApplyPattern(generatedVector.dataUrl, generatedVector.name)}
              className="py-2.5 px-3 bg-brand-600 hover:bg-brand-500 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md min-h-[42px]"
            >
              <Grid className="w-4 h-4" />
              <span>Pasang Sebagai Motif</span>
            </button>
            <button
              type="button"
              onClick={() => onApplyLogo(generatedVector.dataUrl, generatedVector.name)}
              className={`py-2.5 px-3 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all border min-h-[42px] ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
              }`}
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Pasang Sebagai Emblem</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
