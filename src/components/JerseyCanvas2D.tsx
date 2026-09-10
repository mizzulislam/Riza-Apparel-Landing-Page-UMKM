import React from 'react';
import { DesignState } from '../types';
import { JerseySVG2D } from './JerseySVG2D';

interface JerseyCanvas2DProps {
  design: DesignState;
}

export const JerseyCanvas2D: React.FC<JerseyCanvas2DProps> = ({ design }) => {
  const { zoomLevel = 1.0 } = design;

  return (
    <div
      className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out origin-center p-2 select-none"
      style={{ transform: `scale(${zoomLevel})` }}
    >
      <JerseySVG2D
        config={design}
        idPrefix="canvas2d-"
        className="w-full h-full max-h-[460px] filter drop-shadow-2xl"
      />
    </div>
  );
};
