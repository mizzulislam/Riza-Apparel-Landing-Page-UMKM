import React, { useRef, useState, useEffect } from 'react';
import { DesignConfig, DesignState } from '../types';
import { JerseySVG2D } from './JerseySVG2D';
import { RotateCw, MoveHorizontal, Sparkles } from 'lucide-react';

interface JerseyMockup3DProps {
  config?: DesignConfig | DesignState;
  design?: DesignState;
  onRotationChange?: (angle: number) => void;
  className?: string;
}

export const JerseyMockup3D: React.FC<JerseyMockup3DProps> = ({
  config: propConfig,
  design,
  onRotationChange,
  className = '',
}) => {
  const config = propConfig || design || ({} as DesignConfig);
  const initialRot = (config as DesignConfig).rotation3D ?? 0;
  const [rotation, setRotation] = useState<number>(initialRot);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isAutoSpinning, setIsAutoSpinning] = useState<boolean>(false);
  const startXRef = useRef<number>(0);
  const currentRotRef = useRef<number>(initialRot);
  const spinIntervalRef = useRef<any>(null);

  // Sync rotation with changes to selectedAngle / viewSide
  useEffect(() => {
    const angle = (config as any).selectedAngle || (config as any).viewSide;
    if (angle === 'front') setRotation(0);
    else if (angle === 'back') setRotation(180);
    else if (angle === 'sleeve-left') setRotation(90);
    else if (angle === 'sleeve-right') setRotation(-90);
  }, [(config as any).selectedAngle, (config as any).viewSide]);

  useEffect(() => {
    currentRotRef.current = rotation;
    if (onRotationChange) {
      onRotationChange(rotation);
    }
  }, [rotation, onRotationChange]);

  // Optional subtle auto-spin preview
  useEffect(() => {
    if (isAutoSpinning) {
      spinIntervalRef.current = setInterval(() => {
        setRotation((prev) => {
          let next = prev + 1;
          if (next > 180) next -= 360;
          return next;
        });
      }, 30);
    } else if (spinIntervalRef.current) {
      clearInterval(spinIntervalRef.current);
    }
    return () => {
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
    };
  }, [isAutoSpinning]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsAutoSpinning(false);
    setIsDragging(true);
    startXRef.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startXRef.current;
    startXRef.current = e.clientX;
    setRotation((prev) => {
      let next = prev + deltaX * 0.8;
      if (next > 180) next -= 360;
      if (next < -180) next += 360;
      return Math.round(next);
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsAutoSpinning(false);
      setIsDragging(true);
      startXRef.current = e.touches[0].clientX;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - startXRef.current;
    startXRef.current = e.touches[0].clientX;
    setRotation((prev) => {
      let next = prev + deltaX * 0.9;
      if (next > 180) next -= 360;
      if (next < -180) next += 360;
      return Math.round(next);
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Calculate dynamic lighting and shadow based on rotation
  const rad = (rotation * Math.PI) / 180;
  const lightFactor = Math.cos(rad); // 1 = fully lit front, -1 = back lit
  const shadowIntensity = Math.max(0.1, 0.45 - lightFactor * 0.25);
  const highlightOffset = Math.sin(rad) * 40;

  // Determine colors for dynamic depth and ribbons
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

  // Angle label
  const getFacingLabel = () => {
    const absRot = Math.abs(rotation);
    if (absRot < 35) return 'Tampak Depan (Front)';
    if (absRot > 145) return 'Tampak Belakang (Back)';
    if (rotation > 0) return 'Tampak Lengan Kiri (Left)';
    return 'Tampak Lengan Kanan (Right)';
  };

  return (
    <div className={`flex flex-col items-center justify-between w-full h-full select-none ${className}`}>
      {/* 3D Viewport with Perspective */}
      <div
        className="relative w-full max-w-[360px] h-[340px] sm:h-[370px] flex items-center justify-center cursor-grab active:cursor-grabbing overflow-visible touch-none"
        style={{ perspective: '1200px' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Subtle studio glow backdrop */}
        <div
          className="absolute inset-x-8 top-10 bottom-10 rounded-full blur-3xl pointer-events-none opacity-25 transition-all duration-300"
          style={{
            backgroundColor: accentFill,
            transform: `translateX(${highlightOffset}px)`,
          }}
        />

        {/* Dynamic Floor Shadow beneath 3D Jersey */}
        <div
          className="absolute bottom-3 w-56 h-8 rounded-full blur-md pointer-events-none transition-transform duration-100"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 70%)',
            transform: `scale(${1 - Math.abs(Math.sin(rad)) * 0.15}) skewX(${-rotation * 0.15}deg)`,
          }}
        />

        {/* 3D Orbiting Stage Container */}
        <div
          className="relative w-[300px] h-[310px] sm:w-[320px] sm:h-[330px] transition-transform ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateY(${rotation}deg) rotateX(4deg)`,
            transitionDuration: isDragging ? '0ms' : '150ms',
          }}
        >
          {/* FRONT FACE (Z: +10px) */}
          <div
            className="absolute inset-0"
            style={{
              transform: 'translateZ(10px)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <JerseySVG2D
              config={{
                ...config,
                selectedAngle: 'front',
              }}
              idPrefix="orbit-front-"
              className="w-full h-full filter drop-shadow-xl"
            />
            {/* Dynamic Light Overlay shifting across front */}
            <div
              className="absolute inset-0 pointer-events-none mix-blend-overlay rounded-2xl"
              style={{
                background: `linear-gradient(${90 + rotation}deg, rgba(255,255,255,${Math.max(0, lightFactor * 0.35)}) 0%, rgba(0,0,0,${shadowIntensity}) 100%)`,
              }}
            />
          </div>

          {/* BACK FACE (Rotated 180deg, Z: -10px) */}
          <div
            className="absolute inset-0"
            style={{
              transform: 'rotateY(180deg) translateZ(10px)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <JerseySVG2D
              config={{
                ...config,
                selectedAngle: 'back',
              }}
              idPrefix="orbit-back-"
              className="w-full h-full filter drop-shadow-xl"
            />
            {/* Dynamic Light Overlay shifting across back */}
            <div
              className="absolute inset-0 pointer-events-none mix-blend-overlay rounded-2xl"
              style={{
                background: `linear-gradient(${90 - rotation}deg, rgba(255,255,255,${Math.max(0, -lightFactor * 0.35)}) 0%, rgba(0,0,0,${shadowIntensity}) 100%)`,
              }}
            />
          </div>

          {/* 3D Depth Ribbons (Fabric thickness simulation) */}
          <div
            className="absolute inset-y-8 left-1/2 w-4 -ml-2 pointer-events-none opacity-40"
            style={{
              transform: 'rotateY(90deg) translateZ(135px)',
              background: `linear-gradient(to bottom, ${primaryFill}, ${secondaryFill})`,
            }}
          />
          <div
            className="absolute inset-y-8 left-1/2 w-4 -ml-2 pointer-events-none opacity-40"
            style={{
              transform: 'rotateY(-90deg) translateZ(135px)',
              background: `linear-gradient(to bottom, ${primaryFill}, ${secondaryFill})`,
            }}
          />
        </div>

        {/* Interactive Drag Hint Overlay */}
        <div className="absolute top-2 left-2 bg-gray-900/85 backdrop-blur-sm text-gray-300 text-[11px] px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 border border-gray-800 pointer-events-none shadow-md">
          <MoveHorizontal className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Geser mouse/layar untuk rotasi 360°</span>
        </div>

        {/* Current Angle Pill */}
        <div className="absolute top-2 right-2 bg-amber-500/15 text-amber-400 border border-amber-500/40 text-[11px] px-2.5 py-1.5 rounded-lg font-semibold pointer-events-none flex items-center gap-1 shadow-md">
          <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
          <span>{getFacingLabel()}</span>
        </div>
      </div>

      {/* Manual Horizontal Rotation Slider Control & Angle Presets */}
      <div className="w-full max-w-sm px-4 pb-2">
        {/* Preset Angle Buttons */}
        <div className="grid grid-cols-4 gap-1.5 mb-2.5">
          <button
            type="button"
            onClick={() => { setIsAutoSpinning(false); setRotation(0); }}
            className={`text-[11px] py-1.5 px-1 rounded-md font-semibold transition-all text-center min-h-[32px] flex items-center justify-center ${
              Math.abs(rotation) < 25
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
            }`}
          >
            Depan (0°)
          </button>
          <button
            type="button"
            onClick={() => { setIsAutoSpinning(false); setRotation(90); }}
            className={`text-[11px] py-1.5 px-1 rounded-md font-semibold transition-all text-center min-h-[32px] flex items-center justify-center ${
              Math.abs(rotation - 90) < 25
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
            }`}
          >
            Kiri (90°)
          </button>
          <button
            type="button"
            onClick={() => { setIsAutoSpinning(false); setRotation(180); }}
            className={`text-[11px] py-1.5 px-1 rounded-md font-semibold transition-all text-center min-h-[32px] flex items-center justify-center ${
              Math.abs(Math.abs(rotation) - 180) < 25
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
            }`}
          >
            Belakang (180°)
          </button>
          <button
            type="button"
            onClick={() => { setIsAutoSpinning(false); setRotation(-90); }}
            className={`text-[11px] py-1.5 px-1 rounded-md font-semibold transition-all text-center min-h-[32px] flex items-center justify-center ${
              Math.abs(rotation - -90) < 25
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
            }`}
          >
            Kanan (-90°)
          </button>
        </div>

        {/* Orbit slider and Auto-spin toggle */}
        <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 p-2 rounded-xl">
          <button
            type="button"
            onClick={() => setIsAutoSpinning((prev) => !prev)}
            title={isAutoSpinning ? 'Hentikan Putar Otomatis' : 'Putar Otomatis 360°'}
            className={`p-1.5 rounded-lg transition-colors flex items-center justify-center min-h-[32px] min-w-[32px] ${
              isAutoSpinning
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoSpinning ? 'animate-spin' : ''}`} />
          </button>
          <input
            type="range"
            min="-180"
            max="180"
            value={rotation}
            onChange={(e) => {
              setIsAutoSpinning(false);
              setRotation(parseInt(e.target.value, 10));
            }}
            className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg appearance-none"
          />
          <span className="text-[11px] font-mono text-amber-400 font-bold w-11 text-right">
            {rotation}°
          </span>
        </div>
      </div>
    </div>
  );
};
