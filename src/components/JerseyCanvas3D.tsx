import React from 'react';
import { DesignState } from '../types';
import { JerseyMockup3D } from './JerseyMockup3D';

interface JerseyCanvas3DProps {
  design: DesignState;
}

export const JerseyCanvas3D: React.FC<JerseyCanvas3DProps> = ({ design }) => {
  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      <JerseyMockup3D config={design} />
    </div>
  );
};
