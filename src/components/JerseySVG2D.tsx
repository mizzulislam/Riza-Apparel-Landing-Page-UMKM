import React, { useId } from 'react';
import { DesignConfig, DesignState } from '../types';

export interface JerseySVG2DProps {
  config?: DesignConfig | DesignState;
  className?: string;
  idPrefix?: string;
}

export const JerseySVG2D: React.FC<JerseySVG2DProps> = ({
  config,
  className = 'w-full h-auto',
  idPrefix: customPrefix,
}) => {
  const autoId = useId().replace(/:/g, '');
  const prefix = customPrefix || `j2d-${autoId}-`;

  if (!config) return null;

  const cfg = config as (DesignConfig & Partial<DesignState>);
  const baseColorVal: any = cfg.baseColor;
  const primaryFill = typeof baseColorVal === 'string'
    ? baseColorVal
    : (baseColorVal?.hex || '#881337');

  const secondaryFill = cfg.secondaryColorHex
    || cfg.secondaryColor
    || (baseColorVal && typeof baseColorVal === 'object' ? baseColorVal.secondaryHex : undefined)
    || '#F59E0B';

  const accentFill = cfg.accentColorHex
    || cfg.accentColor
    || (baseColorVal && typeof baseColorVal === 'object' ? baseColorVal.accentHex : undefined)
    || '#FFFFFF';

  const motif = cfg.motif || cfg.motifTemplate || 'ende-zawo';
  const collar = cfg.collar || cfg.collarStyle || 'v-neck';
  const collarFill = cfg.collarColor || accentFill;
  const playerName = cfg.playerName ?? 'EUGENIO';
  const playerNumber = cfg.playerNumber ?? '10';
  const teamName = cfg.teamName || (cfg.sponsorLogoPosition === 'sleeve' ? 'RIZA APPAREL' : (cfg.sponsorText || 'RIZA SPORT'));
  const sponsorLogoText = cfg.sponsorLogoText || cfg.sponsorText || 'RIZA SPORT';
  const selectedAngle = cfg.selectedAngle || cfg.viewSide || 'front';

  // Typography & Styling attributes
  const fontFamily = cfg.fontFamily ? `${cfg.fontFamily}, 'Plus Jakarta Sans', sans-serif` : "Teko, 'Plus Jakarta Sans', sans-serif";
  const nameFontSize = cfg.nameFontSize || 19;
  const numberFontSize = cfg.numberFontSize || 82;
  const fontWeight = cfg.fontWeight || '900';
  const fontStyle = cfg.isItalic ? 'italic' : 'normal';
  const nameColor = cfg.nameColor || '#FFFFFF';
  const numberColor = cfg.numberColor || accentFill;
  const numberStrokeColor = cfg.strokeColor || cfg.numberStrokeColor || '#0F172A';
  const strokeWidth = cfg.strokeWidth !== undefined ? cfg.strokeWidth : (cfg.hasTextOutline !== false ? 1.4 : 0);
  const hasTextOutline = strokeWidth > 0;
  const textAnchor = cfg.textAlignment === 'left' ? 'start' : cfg.textAlignment === 'right' ? 'end' : 'middle';
  const letterSpacing = cfg.letterSpacing !== undefined ? `${cfg.letterSpacing}px` : '2px';
  const isUnderline = cfg.isUnderline === true;
  const elementOpacity = cfg.elementOpacity !== undefined ? Math.max(0.1, cfg.elementOpacity / 100) : 1;

  // Format player name according to textTransform
  const formatText = (txt: string) => {
    if (cfg.textTransform === 'capitalize') {
      return txt.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
    }
    if (cfg.textTransform === 'none') {
      return txt;
    }
    return txt.toUpperCase();
  };

  // Transform helper for position, rotation, flip around anchor center (cx, cy)
  const buildTransform = (cx: number, cy: number, pos?: any) => {
    if (!pos) return undefined;
    const x = pos.x || 0;
    const y = pos.y || 0;
    const rot = pos.rotation || 0;
    const scaleX = pos.flipH ? -1 : 1;
    const scaleY = pos.flipV ? -1 : 1;
    if (x === 0 && y === 0 && rot === 0 && scaleX === 1 && scaleY === 1) return undefined;
    return `translate(${cx + x}, ${cy + y}) rotate(${rot}) scale(${scaleX}, ${scaleY}) translate(${-cx}, ${-cy})`;
  };

  // Sponsor & Media attributes
  const sponsorLogoPosition = cfg.sponsorLogoPosition || 'chest';
  const sponsorScale = cfg.sponsorScale || 1;
  const sponsorLogoUrl = cfg.sponsorLogoUrl;
  const sponsorColor = cfg.sponsorColor || '#FFFFFF';
  const customPatternUrl = cfg.customPatternUrl;
  const customPatternScale = cfg.customPatternScale || 60;

  // Layer Visibility Helper
  const isLayerVisible = (layerId: string): boolean => {
    if (!cfg.layers || !Array.isArray(cfg.layers)) return true;
    const found = cfg.layers.find((l) => l.id === layerId);
    return found ? found.visible : true;
  };

  // Check if motif is solid/clean with no pattern overlay
  const isSolid = motif === 'solid-clean' || motif === 'solid-minimalist' || motif === 'none';

  // Render Pattern Definitions based on Heritage Motif and Custom Templates
  const renderPatternDefs = () => (
    <defs>
      {/* Milano micro-dot fabric texture simulation */}
      <pattern id={`${prefix}milano-texture`} width="8" height="8" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="0.8" fill="rgba(255,255,255,0.06)" />
        <circle cx="6" cy="6" r="0.8" fill="rgba(0,0,0,0.08)" />
      </pattern>

      {/* Subtle athletic seamline pattern */}
      <filter id={`${prefix}fabric-depth`} x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.35" />
      </filter>

      {/* 1. Ende Diamond Zawo Motif Pattern (Belah Ketupat Tenun Ikat NTT) */}
      <pattern id={`${prefix}pattern-ende-zawo`} width="44" height="44" patternUnits="userSpaceOnUse">
        <rect width="44" height="44" fill="transparent" />
        <polygon points="22,2 42,22 22,42 2,22" fill="none" stroke={accentFill} strokeWidth="2.5" strokeDasharray="3 1.5" />
        <polygon points="22,7 37,22 22,37 7,22" fill={accentFill} fillOpacity="0.3" />
        <polygon points="22,12 32,22 22,32 12,22" fill={secondaryFill} fillOpacity="0.75" />
        <polygon points="22,17 27,22 22,27 17,22" fill={accentFill} />
        {/* Weave Corner Teeth */}
        <polyline points="0,7 7,0 14,0 0,14" fill={accentFill} fillOpacity="0.4" />
        <polyline points="44,7 37,0 30,0 44,14" fill={accentFill} fillOpacity="0.4" />
        <polyline points="0,37 7,44 14,44 0,30" fill={accentFill} fillOpacity="0.4" />
        <polyline points="44,37 37,44 30,44 44,30" fill={accentFill} fillOpacity="0.4" />
      </pattern>

      {/* 2. Modern Dynamic Speed Stripes (Garis Dinamis Aerodinamis) */}
      <pattern id={`${prefix}pattern-modern-stripes`} width="36" height="36" patternUnits="userSpaceOnUse">
        <rect width="36" height="36" fill="transparent" />
        {/* Main central vertical bar */}
        <rect x="10" y="0" width="16" height="36" fill={secondaryFill} fillOpacity="0.8" />
        {/* Flanking pinstripes */}
        <line x1="5" y1="0" x2="5" y2="36" stroke={accentFill} strokeWidth="2.5" />
        <line x1="31" y1="0" x2="31" y2="36" stroke={accentFill} strokeWidth="2.5" />
        <line x1="18" y1="0" x2="18" y2="36" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="4 2" />
      </pattern>

      {/* 3. Gradient Speed Slash (Torehan Gradasi Kecepatan) */}
      <pattern id={`${prefix}pattern-gradient-slash`} width="48" height="48" patternUnits="userSpaceOnUse">
        <rect width="48" height="48" fill="transparent" />
        <polygon points="-5,12 18,-5 34,-5 8,24" fill={accentFill} fillOpacity="0.35" />
        <polygon points="8,26 36,5 50,5 24,38" fill={secondaryFill} fillOpacity="0.85" />
        <polygon points="22,40 52,18 64,18 36,52" fill={accentFill} fillOpacity="0.5" />
        <line x1="-10" y1="20" x2="30" y2="-10" stroke={accentFill} strokeWidth="2" opacity="0.75" />
        <line x1="6" y1="46" x2="56" y2="12" stroke={secondaryFill} strokeWidth="1.5" strokeDasharray="3 2" />
      </pattern>

      {/* 4. Diagonal Blaze (Blaze Garis Miring Agresif) */}
      <pattern id={`${prefix}pattern-diagonal-blaze`} width="56" height="56" patternUnits="userSpaceOnUse">
        <rect width="56" height="56" fill="transparent" />
        <polygon points="0,0 20,0 56,36 56,56" fill={secondaryFill} fillOpacity="0.7" />
        <polygon points="0,12 10,12 56,48 56,56 46,56 0,20" fill={accentFill} fillOpacity="0.85" />
        <line x1="0" y1="2" x2="56" y2="38" stroke={accentFill} strokeWidth="3" />
        <line x1="0" y1="32" x2="34" y2="56" stroke={secondaryFill} strokeWidth="2" strokeDasharray="4 2" />
      </pattern>

      {/* 5. Honeycomb Carbon Mesh Hex Grid (Honeycomb Carbon Mesh) */}
      <pattern id={`${prefix}pattern-hex-grid`} width="36" height="62.35" patternUnits="userSpaceOnUse">
        <rect width="36" height="62.35" fill="transparent" />
        {/* Upper Hexagon */}
        <polygon points="18,0 36,10.39 36,31.18 18,41.57 0,31.18 0,10.39" fill="none" stroke={accentFill} strokeWidth="1.6" opacity="0.4" />
        <circle cx="18" cy="20.78" r="2.5" fill={secondaryFill} opacity="0.6" />
        {/* Interlocking Lower Half Hexagons */}
        <polygon points="18,62.35 36,51.96 36,31.18 18,41.57 0,31.18 0,51.96" fill="none" stroke={accentFill} strokeWidth="1.6" opacity="0.4" />
        <circle cx="0" cy="51.96" r="2" fill={accentFill} opacity="0.5" />
        <circle cx="36" cy="51.96" r="2" fill={accentFill} opacity="0.5" />
      </pattern>

      {/* 6. Flores Ocean Waves Motif Pattern (Gelombang Laut Flores) */}
      <pattern id={`${prefix}pattern-flores-waves`} width="60" height="32" patternUnits="userSpaceOnUse">
        <rect width="60" height="32" fill="transparent" />
        <path
          d="M0,16 C15,6 20,26 35,16 C45,9 55,23 60,16"
          fill="none"
          stroke={accentFill}
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M0,24 C15,14 20,34 35,24 C45,17 55,31 60,24"
          fill="none"
          stroke={secondaryFill}
          strokeWidth="2"
          strokeDasharray="4 2"
        />
        <circle cx="15" cy="8" r="2" fill={accentFill} opacity="0.8" />
        <circle cx="45" cy="8" r="2" fill={secondaryFill} opacity="0.8" />
      </pattern>

      {/* 7. Geometric Camo Taktis / Military Camo (Geometric Camo Taktis) */}
      <pattern id={`${prefix}pattern-camo-military`} width="70" height="70" patternUnits="userSpaceOnUse">
        <rect width="70" height="70" fill="transparent" />
        <polygon points="5,5 28,8 34,26 18,36 8,24" fill={secondaryFill} fillOpacity="0.4" />
        <polygon points="38,18 64,12 58,42 42,34" fill={accentFill} fillOpacity="0.3" />
        <polygon points="12,42 36,46 30,66 6,58" fill={accentFill} fillOpacity="0.2" />
        <polygon points="46,45 68,52 62,68 40,65" fill={secondaryFill} fillOpacity="0.5" />
        <line x1="25" y1="2" x2="35" y2="15" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      </pattern>

      {/* 8. Cross Hoops (Garis Horisontal Hoops) */}
      <pattern id={`${prefix}pattern-cross-hoops`} width="80" height="42" patternUnits="userSpaceOnUse">
        <rect width="80" height="42" fill="transparent" />
        {/* Bold Horizontal Hoop Band */}
        <rect x="0" y="0" width="80" height="20" fill={secondaryFill} fillOpacity="0.85" />
        {/* Accent Edge Borders */}
        <line x1="0" y1="0" x2="80" y2="0" stroke={accentFill} strokeWidth="2.5" />
        <line x1="0" y1="20" x2="80" y2="20" stroke={accentFill} strokeWidth="2.5" />
        {/* Inner thin racing pin */}
        <line x1="0" y1="31" x2="80" y2="31" stroke={accentFill} strokeWidth="1.2" strokeDasharray="5 3" opacity="0.6" />
      </pattern>

      {/* 9. Kelimutu Abstract / Three Crater Lakes (Tiga Kawah Kelimutu) */}
      <pattern id={`${prefix}pattern-kelimutu-abstract`} width="60" height="60" patternUnits="userSpaceOnUse">
        <rect width="60" height="60" fill="transparent" />
        {/* Emerald/Turquoise Lake Tiwu Nuwa Muri Koo Fai */}
        <path d="M0,12 Q30,4 60,14" stroke="#06B6D4" strokeWidth="4" fill="none" opacity="0.9" />
        {/* Volcanic Amber Lake Tiwu Ata Polo */}
        <path d="M0,30 Q30,22 60,32" stroke="#D97706" strokeWidth="4.5" fill="none" opacity="0.9" />
        {/* Deep Obsidian/Blue Lake Tiwu Ata Bupu */}
        <path d="M0,48 Q30,40 60,50" stroke="#0284C7" strokeWidth="4" fill="none" opacity="0.9" />
        <circle cx="30" cy="18" r="3" fill="#06B6D4" opacity="0.75" />
        <circle cx="45" cy="38" r="3.5" fill="#D97706" opacity="0.75" />
        <circle cx="15" cy="54" r="3" fill="#0284C7" opacity="0.75" />
      </pattern>

      {/* 10. Chevron Arrow Precision (Chevron Panah Presisi) */}
      <pattern id={`${prefix}pattern-chevron-arrow`} width="44" height="44" patternUnits="userSpaceOnUse">
        <rect width="44" height="44" fill="transparent" />
        <polygon points="0,22 22,6 44,22 38,27 22,15 6,27" fill={accentFill} fillOpacity="0.85" />
        <polygon points="0,38 22,22 44,38 38,43 22,31 6,43" fill={secondaryFill} fillOpacity="0.7" />
      </pattern>

      {/* 11. Abstract Geometric Pattern */}
      <pattern id={`${prefix}pattern-abstract-geo`} width="60" height="60" patternUnits="userSpaceOnUse">
        <rect width="60" height="60" fill="transparent" />
        <polygon points="0,0 25,0 45,60 20,60" fill={accentFill} fillOpacity="0.22" />
        <polygon points="30,0 55,0 35,60 10,60" fill={secondaryFill} fillOpacity="0.3" />
        <line x1="0" y1="20" x2="60" y2="40" stroke={accentFill} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />
        <polygon points="50,10 60,25 40,25" fill={accentFill} fillOpacity="0.5" />
      </pattern>

      {/* 12. Halftone Sports Dots Pattern */}
      <pattern id={`${prefix}pattern-halftone-dots`} width="20" height="20" patternUnits="userSpaceOnUse">
        <rect width="20" height="20" fill="transparent" />
        <circle cx="5" cy="5" r="1.5" fill={accentFill} opacity="0.3" />
        <circle cx="15" cy="5" r="2.5" fill={accentFill} opacity="0.5" />
        <circle cx="5" cy="15" r="2" fill={secondaryFill} opacity="0.4" />
        <circle cx="15" cy="15" r="3.5" fill={secondaryFill} opacity="0.6" />
      </pattern>

      {/* Gradient Fade Linear Gradient */}
      <linearGradient id={`${prefix}gradient-fade-sublim`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={primaryFill} stopOpacity="0.9" />
        <stop offset="50%" stopColor={secondaryFill} stopOpacity="0.8" />
        <stop offset="100%" stopColor={accentFill} stopOpacity="0.45" />
      </linearGradient>

      {/* Custom Uploaded User Pattern */}
      {customPatternUrl && (
        <pattern id={`${prefix}pattern-custom-upload`} width={customPatternScale} height={customPatternScale} patternUnits="userSpaceOnUse">
          <image href={customPatternUrl} width={customPatternScale} height={customPatternScale} preserveAspectRatio="xMidYMid slice" />
        </pattern>
      )}

      {/* Jersey Clipping Paths for anatomical containment */}
      <clipPath id={`${prefix}jersey-body-clip-front`}>
        <path d="M120,70 Q160,88 200,70 L245,72 L230,285 Q200,295 160,295 Q120,295 90,285 L75,72 Z" />
      </clipPath>

      <clipPath id={`${prefix}jersey-chest-sash-clip`}>
        <polygon points="70,110 250,110 250,200 70,200" />
      </clipPath>

      <clipPath id={`${prefix}jersey-body-clip-back`}>
        <path d="M120,62 Q160,72 200,62 L245,70 L230,288 Q200,298 160,298 Q120,298 90,288 L75,70 Z" />
      </clipPath>

      <clipPath id={`${prefix}left-sleeve-clip`}>
        <polygon points="75,72 120,70 95,155 35,125" />
      </clipPath>

      <clipPath id={`${prefix}right-sleeve-clip`}>
        <polygon points="200,70 245,72 285,125 225,155" />
      </clipPath>
    </defs>
  );

  const getMotifPatternId = () => {
    switch (motif) {
      case 'custom-upload':
        return customPatternUrl ? `url(#${prefix}pattern-custom-upload)` : `url(#${prefix}pattern-modern-stripes)`;
      case 'ende-zawo':
      case 'ende-diamond':
        return `url(#${prefix}pattern-ende-zawo)`;
      case 'flores-waves':
      case 'flores-wave':
        return `url(#${prefix}pattern-flores-waves)`;
      case 'kelimutu-crater':
      case 'kelimutu-abstract':
        return `url(#${prefix}pattern-kelimutu-abstract)`;
      case 'modern-stripes':
      case 'athletic-minimal':
        return `url(#${prefix}pattern-modern-stripes)`;
      case 'gradient-slash':
      case 'gradient-fade':
        return `url(#${prefix}pattern-gradient-slash)`;
      case 'diagonal-blaze':
      case 'sash-diagonal':
        return `url(#${prefix}pattern-diagonal-blaze)`;
      case 'hex-grid':
        return `url(#${prefix}pattern-hex-grid)`;
      case 'camo-military':
      case 'camo-sport':
        return `url(#${prefix}pattern-camo-military)`;
      case 'cross-hoops':
        return `url(#${prefix}pattern-cross-hoops)`;
      case 'chevron-arrow':
        return `url(#${prefix}pattern-chevron-arrow)`;
      case 'abstract-geo':
        return `url(#${prefix}pattern-abstract-geo)`;
      case 'halftone-dots':
        return `url(#${prefix}pattern-halftone-dots)`;
      case 'solid-clean':
      case 'solid-minimalist':
      case 'none':
        return 'none';
      default:
        return `url(#${prefix}pattern-modern-stripes)`;
    }
  };

  // 1. FRONT VIEW
  const renderFrontView = () => (
    <g id="jersey-front-view">
      {/* Left & Right Sleeves (Raglan athletic construction) */}
      {isLayerVisible('base') && (
        <>
          {/* Left Sleeve */}
          <path
            d="M120,70 L75,72 L35,125 L75,148 L95,155 Z"
            fill={secondaryFill}
            stroke="rgba(0,0,0,0.3)"
            strokeWidth="1.5"
          />
          {/* Left Sleeve Motif Cuff */}
          {!isSolid && isLayerVisible('motif') && (
            <>
              <path
                d="M35,125 L75,148 L71,155 L31,132 Z"
                fill={getMotifPatternId()}
              />
              <path
                d="M35,125 L75,148 L71,155 L31,132 Z"
                fill={accentFill}
                fillOpacity="0.25"
              />
            </>
          )}

          {/* Right Sleeve */}
          <path
            d="M200,70 L245,72 L285,125 L245,148 L225,155 Z"
            fill={secondaryFill}
            stroke="rgba(0,0,0,0.3)"
            strokeWidth="1.5"
          />
          {/* Right Sleeve Motif Cuff */}
          {!isSolid && isLayerVisible('motif') && (
            <>
              <path
                d="M285,125 L245,148 L249,155 L289,132 Z"
                fill={getMotifPatternId()}
              />
              <path
                d="M285,125 L245,148 L249,155 L289,132 Z"
                fill={accentFill}
                fillOpacity="0.25"
              />
            </>
          )}

          {/* Main Torso Body */}
          <path
            d="M120,70 Q160,88 200,70 L245,72 L230,285 Q200,295 160,295 Q120,295 90,285 L75,72 Z"
            fill={primaryFill}
            stroke="rgba(0,0,0,0.35)"
            strokeWidth="1.8"
            filter={`url(#${prefix}fabric-depth)`}
          />

          {/* Subtle Milano Mesh Fabric Overlay */}
          <path
            d="M120,70 Q160,88 200,70 L245,72 L230,285 Q200,295 160,295 Q120,295 90,285 L75,72 Z"
            fill={`url(#${prefix}milano-texture)`}
          />

          {/* Dynamic Side Mesh Panels for athletic breathability */}
          <path
            d="M75,72 L90,140 L90,285 L80,283 L68,145 Z"
            fill={secondaryFill}
            opacity="0.9"
          />
          <path
            d="M245,72 L230,140 L230,285 L240,283 L252,145 Z"
            fill={secondaryFill}
            opacity="0.9"
          />
        </>
      )}

      {/* DISTINCT TEMPLATE SUBLIMATION / MOTIF LAYER (Strictly clipped to torso) */}
      {!isSolid && isLayerVisible('motif') && (
        <g clipPath={`url(#${prefix}jersey-body-clip-front)`}>
          {/* A. Full Torso Spanning Templates: Modern Stripes, Hex Grid, Cross Hoops, Camo, Geometric, Halftone, Custom */}
          {(motif === 'modern-stripes' || 
            motif === 'athletic-minimal' || 
            motif === 'hex-grid' || 
            motif === 'cross-hoops' || 
            motif === 'camo-military' || 
            motif === 'camo-sport' || 
            motif === 'abstract-geo' || 
            motif === 'halftone-dots' || 
            motif === 'custom-upload') && (
            <path
              d="M120,70 Q160,88 200,70 L245,72 L230,285 Q200,295 160,295 Q120,295 90,285 L75,72 Z"
              fill={getMotifPatternId()}
              opacity="0.92"
            />
          )}

          {/* B. Diagonal Blaze & Speed Slash Templates */}
          {(motif === 'diagonal-blaze' || 
            motif === 'gradient-slash' || 
            motif === 'gradient-fade' || 
            motif === 'sash-diagonal') && (
            <>
              {/* Dynamic diagonal sash spanning from right shoulder to left lower hem */}
              <polygon
                points="175,68 250,72 135,295 60,285"
                fill={getMotifPatternId()}
                opacity="0.95"
              />
              {/* Accompanying electric accent trim lines */}
              <line x1="175" y1="68" x2="60" y2="285" stroke={accentFill} strokeWidth="3.5" />
              <line x1="250" y1="72" x2="135" y2="295" stroke={accentFill} strokeWidth="3.5" />
              <line x1="165" y1="68" x2="50" y2="285" stroke={secondaryFill} strokeWidth="2" strokeDasharray="4 2" />
            </>
          )}

          {/* C. Heritage Ende Zawo Diamond, Flores Waves, Kelimutu Crater & Chevron Arrow */}
          {(motif === 'ende-diamond' || 
            motif === 'ende-zawo' || 
            motif === 'flores-waves' || 
            motif === 'flores-wave' || 
            motif === 'kelimutu-abstract' || 
            motif === 'kelimutu-crater' || 
            motif === 'chevron-arrow') && (
            <>
              {/* Chest band */}
              <path
                d="M60,115 L160,155 L260,115 L260,195 L160,235 L60,195 Z"
                fill={getMotifPatternId()}
                stroke={accentFill}
                strokeWidth="1"
                opacity="0.95"
              />
              {/* Accent border lines on motif band */}
              <path
                d="M60,115 L160,155 L260,115"
                fill="none"
                stroke={accentFill}
                strokeWidth="2.5"
              />
              <path
                d="M60,195 L160,235 L260,195"
                fill="none"
                stroke={accentFill}
                strokeWidth="2.5"
              />
              {/* Lower hem accent band */}
              <path
                d="M86,270 Q160,282 234,270 L230,285 Q160,295 90,285 Z"
                fill={getMotifPatternId()}
                opacity="0.85"
              />
              <path
                d="M86,270 Q160,282 234,270"
                fill="none"
                stroke={accentFill}
                strokeWidth="1.5"
              />
            </>
          )}
        </g>
      )}

      {/* Raglan Seamlines (Dashed authentic stitching) */}
      <path
        d="M120,70 L90,145"
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1.5"
        strokeDasharray="2 2"
      />
      <path
        d="M200,70 L230,145"
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1.5"
        strokeDasharray="2 2"
      />

      {/* SPONSOR & BADGES LAYER */}
      {isLayerVisible('sponsor') && (
        <>
          {/* Left Chest: Custom Sponsor Logo OR Official Crest Badge */}
          {sponsorLogoPosition === 'left-chest' && sponsorLogoUrl ? (
            <image
              href={sponsorLogoUrl}
              x={95 - (24 * (sponsorScale - 1)) / 2}
              y={92 - (24 * (sponsorScale - 1)) / 2}
              width={28 * sponsorScale}
              height={26 * sponsorScale}
              preserveAspectRatio="xMidYMid meet"
              className="drop-shadow-sm"
            />
          ) : (
            <g transform="translate(100, 95)">
              <polygon points="12,0 24,6 24,20 12,28 0,20 0,6" fill="#111827" stroke={accentFill} strokeWidth="1.5" />
              <polygon points="12,3 21,7 21,18 12,24 3,18 3,7" fill="#1F2937" />
              <text x="12" y="14" textAnchor="middle" fill="#F9FAFB" fontSize="5.5" fontWeight="800" letterSpacing="0.5">
                RIZA
              </text>
              <text x="12" y="20" textAnchor="middle" fill={accentFill} fontSize="3.8" fontWeight="700">
                ENDE
              </text>
            </g>
          )}

          {/* Right Chest: Custom Sponsor Logo OR Apparel Tag */}
          {sponsorLogoPosition === 'right-chest' && sponsorLogoUrl ? (
            <image
              href={sponsorLogoUrl}
              x={195 - (24 * (sponsorScale - 1)) / 2}
              y={92 - (24 * (sponsorScale - 1)) / 2}
              width={28 * sponsorScale}
              height={26 * sponsorScale}
              preserveAspectRatio="xMidYMid meet"
              className="drop-shadow-sm"
            />
          ) : (
            <g transform="translate(200, 102)">
              <path d="M0,0 L18,0 L14,7 L0,7 Z" fill={accentFill} />
              <path d="M4,10 L18,10" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
            </g>
          )}

          {/* Center Chest Sponsor Logo or Text */}
          {(sponsorLogoPosition === 'chest' || sponsorLogoPosition === 'chest-center' || !sponsorLogoPosition) && (
            <g 
              transform={buildTransform(160, 242, cfg.sponsorPosition)}
              opacity={cfg.sponsorPosition?.opacity !== undefined ? cfg.sponsorPosition.opacity / 100 : elementOpacity}
            >
              {sponsorLogoUrl ? (
                <image
                  href={sponsorLogoUrl}
                  x={160 - (58 * sponsorScale) / 2}
                  y={242 - (24 * sponsorScale) / 2}
                  width={58 * sponsorScale}
                  height={24 * sponsorScale}
                  preserveAspectRatio="xMidYMid meet"
                  className="drop-shadow-md"
                />
              ) : (
                sponsorLogoText && (
                  <g transform="translate(160, 246)">
                    <rect x="-44" y="-10" width="88" height="19" rx="3" fill="rgba(17,24,39,0.78)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
                    <text
                      x="0"
                      y="2.5"
                      textAnchor="middle"
                      fill={sponsorColor}
                      fontSize="8.5"
                      fontWeight="800"
                      letterSpacing="0.8"
                      fontFamily={fontFamily}
                      className="uppercase"
                    >
                      {sponsorLogoText}
                    </text>
                  </g>
                )
              )}
            </g>
          )}
        </>
      )}

      {/* TYPOGRAPHY LAYER */}
      {isLayerVisible('typography') && (
        <g opacity={elementOpacity}>
          {/* Team Name / Front Crest Lettering */}
          {teamName && (
            <g transform={buildTransform(160, 150, cfg.namePosition)}>
              <text
                x="160"
                y="150"
                textAnchor={textAnchor}
                fill={nameColor}
                stroke={hasTextOutline ? numberStrokeColor : 'none'}
                strokeWidth={hasTextOutline ? strokeWidth * 0.9 : 0}
                style={{ 
                  paintOrder: 'stroke fill',
                  textDecoration: isUnderline ? 'underline' : 'none'
                }}
                fontSize={nameFontSize ? nameFontSize * 0.9 : 17}
                fontWeight={fontWeight}
                fontStyle={fontStyle}
                letterSpacing={letterSpacing}
                fontFamily={fontFamily}
                className="drop-shadow-md"
              >
                {formatText(teamName)}
              </text>
            </g>
          )}

          {/* Front Small Number */}
          {playerNumber && (
            <g transform={buildTransform(160, 178, cfg.numberPosition)}>
              <text
                x="160"
                y="178"
                textAnchor={textAnchor}
                fill={numberColor}
                stroke={hasTextOutline ? numberStrokeColor : 'none'}
                strokeWidth={hasTextOutline ? strokeWidth * 0.8 : 0}
                style={{ 
                  paintOrder: 'stroke fill',
                  textDecoration: isUnderline ? 'underline' : 'none'
                }}
                fontSize={numberFontSize ? numberFontSize * 0.32 : 22}
                fontWeight={fontWeight}
                fontStyle={fontStyle}
                letterSpacing={letterSpacing}
                fontFamily={fontFamily}
                className="drop-shadow"
              >
                {playerNumber}
              </text>
            </g>
          )}
        </g>
      )}

      {/* Authentic Dry-Fit Milano Hem Authenticity Patch (Bottom Right) */}
      <g transform="translate(205, 268)">
        <rect width="20" height="11" rx="2" fill="#111827" stroke="#F59E0B" strokeWidth="0.8" />
        <text x="10" y="5" textAnchor="middle" fill="#F59E0B" fontSize="3.5" fontWeight="700">DRY-FIT</text>
        <text x="10" y="9" textAnchor="middle" fill="#FFFFFF" fontSize="3" fontWeight="500">160GSM</text>
      </g>

      {/* Dynamic Collar Implementation */}
      {isLayerVisible('collar') && renderCollarFront()}
    </g>
  );

  // 2. BACK VIEW
  const renderBackView = () => (
    <g id="jersey-back-view">
      {/* Sleeves Back */}
      {isLayerVisible('base') && (
        <>
          <path
            d="M120,62 L75,70 L35,125 L75,148 L95,155 Z"
            fill={secondaryFill}
            stroke="rgba(0,0,0,0.3)"
            strokeWidth="1.5"
          />
          <path
            d="M200,62 L245,70 L285,125 L245,148 L225,155 Z"
            fill={secondaryFill}
            stroke="rgba(0,0,0,0.3)"
            strokeWidth="1.5"
          />

          {/* Main Torso Back */}
          <path
            d="M120,62 Q160,72 200,62 L245,70 L230,288 Q200,298 160,298 Q120,298 90,288 L75,70 Z"
            fill={primaryFill}
            stroke="rgba(0,0,0,0.35)"
            strokeWidth="1.8"
            filter={`url(#${prefix}fabric-depth)`}
          />

          {/* Fabric Texture */}
          <path
            d="M120,62 Q160,72 200,62 L245,70 L230,288 Q200,298 160,298 Q120,298 90,288 L75,70 Z"
            fill={`url(#${prefix}milano-texture)`}
          />
        </>
      )}

      {/* Back Yoke & Body Accent with Heritage Motif */}
      {!isSolid && isLayerVisible('motif') && (
        <g clipPath={`url(#${prefix}jersey-body-clip-back)`}>
          {/* Subtle Full Body Pattern for all-over templates */}
          {(motif === 'modern-stripes' || 
            motif === 'athletic-minimal' || 
            motif === 'hex-grid' || 
            motif === 'cross-hoops' || 
            motif === 'camo-military' || 
            motif === 'camo-sport' || 
            motif === 'abstract-geo' || 
            motif === 'halftone-dots' || 
            motif === 'custom-upload') && (
            <path
              d="M120,62 Q160,72 200,62 L245,70 L230,288 Q200,298 160,298 Q120,298 90,288 L75,70 Z"
              fill={getMotifPatternId()}
              opacity="0.85"
            />
          )}

          {/* Upper Back Yoke Accent */}
          <path
            d="M75,70 L245,70 L238,102 Q160,118 82,102 Z"
            fill={getMotifPatternId()}
            stroke={accentFill}
            strokeWidth="1.5"
          />
          {/* Subtle Lower Hem Accent Band */}
          <path
            d="M86,275 Q160,286 234,275 L231,286 Q160,296 89,286 Z"
            fill={accentFill}
            opacity="0.85"
          />
        </g>
      )}

      {/* Raglan Stitching lines */}
      <path
        d="M120,62 L90,145"
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.5"
        strokeDasharray="2 2"
      />
      <path
        d="M200,62 L230,145"
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.5"
        strokeDasharray="2 2"
      />

      {/* Sponsor / Custom logo on Upper Back */}
      {isLayerVisible('sponsor') && (
        sponsorLogoPosition === 'upper-back' && sponsorLogoUrl ? (
          <image
            href={sponsorLogoUrl}
            x={160 - (38 * sponsorScale) / 2}
            y={88 - (20 * sponsorScale) / 2}
            width={38 * sponsorScale}
            height={20 * sponsorScale}
            preserveAspectRatio="xMidYMid meet"
          />
        ) : (
          /* NTT Authentic Wordmark below collar */
          <text
            x="160"
            y="112"
            textAnchor="middle"
            fill="rgba(255,255,255,0.6)"
            fontSize="5"
            fontWeight="800"
            letterSpacing="2"
          >
            NUSA BUNGA • FLORES
          </text>
        )
      )}

      {/* TYPOGRAPHY LAYER ON BACK */}
      {isLayerVisible('typography') && (
        <g opacity={elementOpacity}>
          {/* Player Name */}
          <g transform={buildTransform(160, 138, cfg.namePosition)}>
            <text
              x="160"
              y="138"
              textAnchor={textAnchor}
              fill={nameColor}
              stroke={hasTextOutline ? numberStrokeColor : 'none'}
              strokeWidth={hasTextOutline ? strokeWidth : 0}
              style={{ 
                paintOrder: 'stroke fill',
                textDecoration: isUnderline ? 'underline' : 'none'
              }}
              fontSize={nameFontSize}
              fontWeight={fontWeight}
              fontStyle={fontStyle}
              letterSpacing={letterSpacing}
              fontFamily={fontFamily}
              className="drop-shadow-md"
            >
              {formatText(playerName.trim() || 'NAMA PEMAIN')}
            </text>
          </g>

          {/* Player Big Back Number */}
          <g transform={buildTransform(160, 218, cfg.numberPosition)}>
            <text
              x="160"
              y="218"
              textAnchor={textAnchor}
              fill={numberColor}
              stroke={hasTextOutline ? numberStrokeColor : 'none'}
              strokeWidth={hasTextOutline ? strokeWidth * 1.5 : 0}
              style={{ 
                paintOrder: 'stroke fill',
                textDecoration: isUnderline ? 'underline' : 'none'
              }}
              fontSize={numberFontSize}
              fontWeight={fontWeight}
              fontStyle={fontStyle}
              fontFamily={fontFamily}
              className="drop-shadow-lg"
            >
              {playerNumber.trim() || '10'}
            </text>
          </g>
        </g>
      )}

      {/* City of Origin: ENDE - NTT */}
      <text
        x="160"
        y="256"
        textAnchor="middle"
        fill="rgba(255,255,255,0.75)"
        fontSize="7"
        fontWeight="700"
        letterSpacing="1.5"
      >
        ENDE • NUSA TENGGARA TIMUR
      </text>

      {/* Back Collar */}
      {isLayerVisible('collar') && renderCollarBack()}
    </g>
  );

  // 3. SLEEVE LEFT VIEW
  const renderSleeveLeftView = () => (
    <g id="jersey-sleeve-left-view" transform="translate(60, 20)">
      {/* Sleeve profile */}
      <path
        d="M80,50 Q100,45 130,52 L160,180 L70,180 L50,90 Z"
        fill={secondaryFill}
        stroke="rgba(0,0,0,0.35)"
        strokeWidth="1.8"
        filter={`url(#${prefix}fabric-depth)`}
      />
      <path
        d="M80,50 Q100,45 130,52 L160,180 L70,180 L50,90 Z"
        fill={`url(#${prefix}milano-texture)`}
      />
      {/* Central Motif Armband */}
      {!isSolid && isLayerVisible('motif') && (
        <rect x="58" y="110" width="94" height="42" fill={getMotifPatternId()} stroke={accentFill} strokeWidth="1.5" />
      )}
      {/* Sleeve Badge */}
      <g transform="translate(105, 80)">
        <circle cx="0" cy="0" r="14" fill="#111827" stroke={accentFill} strokeWidth="1.5" />
        <text x="0" y="2" textAnchor="middle" fill="#FFFFFF" fontSize="6" fontWeight="800">RIZA</text>
        <text x="0" y="8" textAnchor="middle" fill={accentFill} fontSize="4" fontWeight="700">NTT</text>
      </g>
      {/* Ribbed Cuff */}
      <rect x="70" y="172" width="90" height="12" rx="2" fill={primaryFill} stroke="rgba(0,0,0,0.3)" />
      <text x="105" y="220" textAnchor="middle" fill="#94A3B8" fontSize="9" fontWeight="600">
        LENGAN KIRI (LEFT SLEEVE)
      </text>
    </g>
  );

  // 4. SLEEVE RIGHT VIEW
  const renderSleeveRightView = () => (
    <g id="jersey-sleeve-right-view" transform="translate(60, 20)">
      <path
        d="M70,52 Q100,45 120,50 L150,90 L130,180 L40,180 Z"
        fill={secondaryFill}
        stroke="rgba(0,0,0,0.35)"
        strokeWidth="1.8"
        filter={`url(#${prefix}fabric-depth)`}
      />
      <path
        d="M70,52 Q100,45 120,50 L150,90 L130,180 L40,180 Z"
        fill={`url(#${prefix}milano-texture)`}
      />
      {/* Central Motif Armband */}
      {!isSolid && isLayerVisible('motif') && (
        <rect x="48" y="110" width="94" height="42" fill={getMotifPatternId()} stroke={accentFill} strokeWidth="1.5" />
      )}
      {/* Sleeve Logo: Custom Sponsor or Sublimation Pro Badge */}
      {isLayerVisible('sponsor') && (
        sponsorLogoPosition === 'sleeve' && sponsorLogoUrl ? (
          <image
            href={sponsorLogoUrl}
            x={95 - (34 * sponsorScale) / 2}
            y={80 - (20 * sponsorScale) / 2}
            width={34 * sponsorScale}
            height={20 * sponsorScale}
            preserveAspectRatio="xMidYMid meet"
          />
        ) : (
          <g transform="translate(95, 80)">
            <polygon points="0,-12 12,0 0,12 -12,0" fill="#111827" stroke={accentFill} strokeWidth="1.5" />
            <text x="0" y="2" textAnchor="middle" fill={accentFill} fontSize="6" fontWeight="800">100%</text>
            <text x="0" y="7" textAnchor="middle" fill="#FFFFFF" fontSize="3.5" fontWeight="600">SUBLIM</text>
          </g>
        )
      )}
      {/* Ribbed Cuff */}
      <rect x="40" y="172" width="90" height="12" rx="2" fill={primaryFill} stroke="rgba(0,0,0,0.3)" />
      <text x="95" y="220" textAnchor="middle" fill="#94A3B8" fontSize="9" fontWeight="600">
        LENGAN KANAN (RIGHT SLEEVE)
      </text>
    </g>
  );

  // Collar Helper (Front)
  function renderCollarFront() {
    switch (collar) {
      case 'v-neck':
        return (
          <g id="collar-v-neck">
            {/* Inner neck hole */}
            <path d="M125,70 Q160,82 195,70 L160,102 Z" fill="#0F172A" />
            {/* V-neck outer band */}
            <path
              d="M120,68 L160,106 L200,68 L192,66 L160,98 L128,66 Z"
              fill={collarFill}
              stroke="#0F172A"
              strokeWidth="0.8"
            />
            {/* Inner back tape */}
            <path d="M130,68 Q160,76 190,68" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" />
          </g>
        );
      case 'polo':
        return (
          <g id="collar-polo">
            {/* Inner neck */}
            <path d="M125,70 Q160,82 195,70 Z" fill="#0F172A" />
            {/* Polo Placket with 2 buttons */}
            <rect x="154" y="76" width="12" height="38" fill="#1E293B" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
            <circle cx="160" cy="85" r="1.8" fill="#FFFFFF" />
            <circle cx="160" cy="100" r="1.8" fill="#FFFFFF" />
            {/* Left Collar Wing */}
            <polygon points="120,66 160,74 150,96 112,80" fill={collarFill} stroke="#0F172A" strokeWidth="0.8" />
            {/* Right Collar Wing */}
            <polygon points="200,66 160,74 170,96 208,80" fill={collarFill} stroke="#0F172A" strokeWidth="0.8" />
          </g>
        );
      case 'stand-up':
        return (
          <g id="collar-stand-up">
            <path d="M125,68 Q160,78 195,68 L160,88 Z" fill="#0F172A" />
            <path
              d="M122,64 L160,69 L198,64 L192,57 Q160,63 128,57 Z"
              fill={collarFill}
              stroke="#0F172A"
              strokeWidth="0.8"
            />
          </g>
        );
      case 'o-neck':
      default:
        return (
          <g id="collar-o-neck">
            {/* Inner neck hole */}
            <path d="M124,70 Q160,90 196,70 Q160,76 124,70 Z" fill="#0F172A" />
            {/* O-neck circular ribbed band */}
            <path
              d="M120,68 Q160,96 200,68 Q160,88 120,68 Z"
              fill={collarFill}
              stroke="#0F172A"
              strokeWidth="0.8"
            />
            {/* Inner neck size label */}
            <rect x="154" y="74" width="12" height="6" rx="1" fill="#FFFFFF" opacity="0.8" />
            <text x="160" y="79" textAnchor="middle" fill="#111827" fontSize="3.5" fontWeight="800">L</text>
          </g>
        );
    }
  }

  // Collar Helper (Back)
  function renderCollarBack() {
    return (
      <g id="collar-back">
        <path
          d="M120,62 Q160,74 200,62 Q160,68 120,62 Z"
          fill={collarFill}
          stroke="#0F172A"
          strokeWidth="0.8"
        />
      </g>
    );
  }

  return (
    <svg
      viewBox="0 0 320 320"
      className={`${className} transition-all duration-300 drop-shadow-2xl select-none`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {renderPatternDefs()}
      {selectedAngle === 'front' && renderFrontView()}
      {selectedAngle === 'back' && renderBackView()}
      {selectedAngle === 'sleeve-left' && renderSleeveLeftView()}
      {selectedAngle === 'sleeve-right' && renderSleeveRightView()}
    </svg>
  );
};
