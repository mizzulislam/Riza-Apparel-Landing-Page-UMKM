import React from 'react';
import { createRoot } from 'react-dom/client';
import { DesignState, ViewAngleId } from '../types';
import { JerseySVG2D } from '../components/studio/JerseySVG2D';

/**
 * PrintExporter Utility
 * FR-D1, FR-D4: High-Res (≥150 DPI) Print Render & SVG Vector Export Engine
 */

export interface ExportAnglesOptions {
  scale?: number; // Default 5x scale for ~150-300 DPI high resolution
  isDark?: boolean;
}

/**
 * Render a JerseySVG2D configuration into an HTML Image Element and draw to Canvas at specified scale
 */
export async function renderJerseyToCanvas(
  design: DesignState,
  angleSide: ViewAngleId,
  scale: number = 5
): Promise<HTMLCanvasElement> {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = '600px';
  container.style.height = '680px';
  document.body.appendChild(container);

  const testConfig: DesignState = {
    ...design,
    viewSide: angleSide,
    zoomLevel: 1.0,
  };

  const root = createRoot(container);
  
  await new Promise<void>((resolve) => {
    root.render(
      <JerseySVG2D
        config={testConfig}
        idPrefix={`export-${angleSide}-`}
        className="w-full h-full"
      />
    );
    // Give DOM time to attach and process SVG defs
    setTimeout(resolve, 150);
  });

  const svgElement = container.querySelector('svg');
  if (!svgElement) {
    root.unmount();
    document.body.removeChild(container);
    throw new Error('SVG element not found for export');
  }

  // Set explicit width & height on SVG for crisp XML rendering
  const width = 600;
  const height = 680;
  svgElement.setAttribute('width', `${width}`);
  svgElement.setAttribute('height', `${height}`);

  const svgData = new XMLSerializer().serializeToString(svgElement);
  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const img = new Image();
  img.crossOrigin = 'anonymous';

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = (e) => reject(e);
    img.src = url;
  });

  // Create High-DPI Output Canvas
  const canvas = document.createElement('canvas');
  canvas.width = width * scale; // e.g. 600 * 5 = 3000px width
  canvas.height = height * scale; // e.g. 680 * 5 = 3400px height

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    URL.revokeObjectURL(url);
    root.unmount();
    document.body.removeChild(container);
    throw new Error('Failed to create canvas context');
  }

  // Draw background & image at scaled resolution
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // Clean up DOM & blob URL
  URL.revokeObjectURL(url);
  root.unmount();
  document.body.removeChild(container);

  return canvas;
}

/**
 * Trigger browser file download from Canvas Data URL
 */
export function downloadCanvasImage(
  canvas: HTMLCanvasElement,
  filename: string,
  type: string = 'image/png'
) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL(type, 1.0);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export SVG file directly as raw vector format (FR-D2)
 */
export async function downloadSVGVectorFile(
  design: DesignState,
  angleSide: ViewAngleId,
  filename: string
) {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = '600px';
  container.style.height = '680px';
  document.body.appendChild(container);

  const testConfig: DesignState = {
    ...design,
    viewSide: angleSide,
    zoomLevel: 1.0,
  };

  const root = createRoot(container);
  
  await new Promise<void>((resolve) => {
    root.render(
      <JerseySVG2D
        config={testConfig}
        idPrefix={`svg-vector-${angleSide}-`}
        className="w-full h-full"
      />
    );
    setTimeout(resolve, 150);
  });

  const svgElement = container.querySelector('svg');
  if (!svgElement) {
    root.unmount();
    document.body.removeChild(container);
    throw new Error('SVG element not found');
  }

  svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const svgData = new XMLSerializer().serializeToString(svgElement);
  
  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  root.unmount();
  document.body.removeChild(container);
}
