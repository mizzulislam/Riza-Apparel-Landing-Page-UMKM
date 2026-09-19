import React, { useRef, useState, useEffect } from 'react';
import { DesignState } from '../types';
import { JerseySVG2D } from './JerseySVG2D';

interface JerseyCanvas2DProps {
  design: DesignState;
}

export const JerseyCanvas2D: React.FC<JerseyCanvas2DProps> = ({ design }) => {
  const { zoomLevel = 1.0 } = design;
  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamic Touch & Pan State
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [touchDistance, setTouchDistance] = useState<number | null>(null);

  // Double tap to reset zoom & pan
  const lastTapRef = useRef<number>(0);

  const handleDoubleTapReset = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      setPanOffset({ x: 0, y: 0 });
    }
    lastTapRef.current = now;
  };

  // Mouse Drag Panning handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only primary click
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Gesture Handling for Mobile Devices (Pinch to Zoom / Drag Pan)
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDoubleTapReset();
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - panOffset.x, y: touch.clientY - panOffset.y });
    } else if (e.touches.length === 2) {
      // Pinch gesture start
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setTouchDistance(dist);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      setPanOffset({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      });
    } else if (e.touches.length === 2 && touchDistance !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setTouchDistance(dist);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTouchDistance(null);
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="w-full h-full flex items-center justify-center transition-transform duration-100 ease-out origin-center p-2 select-none cursor-grab active:cursor-grabbing touch-none"
      style={{
        transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
      }}
    >
      <JerseySVG2D
        config={design}
        idPrefix="canvas2d-"
        className="w-full h-full max-h-[460px] filter drop-shadow-2xl"
      />
    </div>
  );
};
