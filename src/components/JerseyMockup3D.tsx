import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RotateCw, Sparkles, Box, RefreshCw } from 'lucide-react';
import { DesignConfig, DesignState } from '../types';
import { createJerseyAtlasTexture } from '../lib/atlas-renderer';

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
  const currentConfig = propConfig || design || ({} as DesignState);
  const cfg = currentConfig as (DesignConfig & Partial<DesignState>);

  const mountRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isAutoSpinning, setIsAutoSpinning] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const startXRef = useRef<number>(0);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const modelType = cfg.collarStyle === 'polo' || cfg.motifTemplate?.includes('raglan') ? 'raglan-crew' : 'vneck-setin';

  // 1. Initialize Three.js WebGL Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 450;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0, 3.2);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    // Clear previous canvas
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 3-Point PBR Fabric Lighting (Key, Fill, Rim)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(2, 3, 3);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
    fillLight.position.set(-2, 1, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.0);
    rimLight.position.set(0, 3, -3);
    scene.add(rimLight);

    // Group for model rotation
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // Soft Contact Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(2.0, 2.0);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.18 });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.0;
    shadowMesh.receiveShadow = true;
    scene.add(shadowMesh);

    // Load GLB Model
    const loader = new GLTFLoader();
    const isMobileDevice = window.innerWidth <= 640;
    const modelUrl = `/models/${modelType}${isMobileDevice ? '.mobile' : ''}.glb`;

    setIsLoading(true);

    loader.load(
      modelUrl,
      (gltf) => {
        const loadedModel = gltf.scene;
        loadedModel.scale.set(1.1, 1.1, 1.1);
        loadedModel.position.set(0, -0.05, 0);

        loadedModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
              const mat = new THREE.MeshPhysicalMaterial({
                roughness: 0.82,
                metalness: 0.0,
                sheen: 0.4,
                sheenRoughness: 0.5,
                side: THREE.DoubleSide,
              });
              mesh.material = mat;
            }
          }
        });

        // Remove old models in group
        while (modelGroup.children.length > 0) {
          modelGroup.remove(modelGroup.children[0]);
        }
        modelGroup.add(loadedModel);
        setIsLoading(false);
      },
      undefined,
      (err) => {
        console.warn('GLB Load fallback to procedural 3D mesh:', err);
        const jerseyGeo = new THREE.CylinderGeometry(0.52, 0.48, 1.5, 32, 16, true);
        const jerseyMat = new THREE.MeshPhysicalMaterial({
          color: 0x881337,
          roughness: 0.82,
          metalness: 0.0,
          sheen: 0.4,
          side: THREE.DoubleSide,
        });
        const fallbackMesh = new THREE.Mesh(jerseyGeo, jerseyMat);
        fallbackMesh.position.y = -0.1;

        while (modelGroup.children.length > 0) {
          modelGroup.remove(modelGroup.children[0]);
        }
        modelGroup.add(fallbackMesh);
        setIsLoading(false);
      }
    );

    // Render loop
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // Resize listener
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 450;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
      }
    };
  }, [modelType]);

  // 2. Render 2048x2048 UV Atlas Texture & Apply to 3D Jersey Panels
  useEffect(() => {
    try {
      const isMobileDevice = window.innerWidth <= 640;
      const resolution = isMobileDevice ? 1024 : 2048;
      const texture = createJerseyAtlasTexture(cfg, { resolution, dilationPadding: 16 });

      if (modelGroupRef.current) {
        modelGroupRef.current.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.material) {
              const mat = (mesh.material as THREE.MeshPhysicalMaterial).clone();
              mat.map = texture;
              mat.needsUpdate = true;
              mesh.material = mat;
            }
          }
        });
      }
      textureRef.current = texture;
    } catch (err) {
      console.warn('3D UV Atlas generation note:', err);
    }
  }, [
    cfg.baseColor,
    cfg.secondaryColor,
    cfg.accentColor,
    cfg.motifTemplate,
    cfg.playerName,
    cfg.playerNumber,
    cfg.sponsorText,
    cfg.collarStyle,
  ]);

  // 3. Update Model Group Y-Rotation
  useEffect(() => {
    if (modelGroupRef.current) {
      modelGroupRef.current.rotation.y = (rotation * Math.PI) / 180;
    }
    if (onRotationChange) {
      onRotationChange(rotation);
    }
  }, [rotation, onRotationChange]);

  // 4. Auto-spin animation
  useEffect(() => {
    let timer: any = null;
    if (isAutoSpinning) {
      timer = setInterval(() => {
        setRotation((prev) => {
          let next = prev + 1.5;
          if (next > 180) next -= 360;
          return next;
        });
      }, 30);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAutoSpinning]);

  // Mouse & Touch Drag Handlers
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

  const getFacingLabel = () => {
    const absRot = Math.abs(rotation);
    if (absRot < 35) return 'Tampak Depan (Front)';
    if (absRot > 145) return 'Tampak Belakang (Back)';
    if (rotation > 0) return 'Tampak Lengan Kiri (Left)';
    return 'Tampak Lengan Kanan (Right)';
  };

  return (
    <div className={`flex flex-col items-center justify-between w-full h-full select-none ${className}`}>
      
      {/* 3D WebGL Canvas Container */}
      <div
        className="relative w-full max-w-[380px] h-[340px] sm:h-[380px] flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden rounded-2xl touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Three.js Mount Node */}
        <div ref={mountRef} className="w-full h-full flex items-center justify-center" />

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex flex-col items-center justify-center gap-2 text-white">
            <RefreshCw className="w-7 h-7 animate-spin text-brand-500" />
            <span className="text-xs font-bold">Memuat Model 3D WebGL...</span>
          </div>
        )}

        {/* 3D Orbit Badge */}
        <div className="absolute top-2 left-2 bg-slate-900/85 backdrop-blur-sm text-slate-200 text-[11px] px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 border border-slate-700 shadow-md">
          <Box className="w-3.5 h-3.5 text-heritage-zawo shrink-0" />
          <span>Real 3D WebGL Orbit</span>
        </div>

        {/* Facing Angle Indicator */}
        <div className="absolute top-2 right-2 bg-brand-500/20 text-brand-300 border border-brand-500/40 text-[11px] px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1 shadow-md">
          <Sparkles className="w-3 h-3 text-brand-400 shrink-0" />
          <span>{getFacingLabel()}</span>
        </div>
      </div>

      {/* Angle Presets & Auto-Spin Control */}
      <div className="w-full max-w-sm px-4 pb-2">
        <div className="grid grid-cols-4 gap-1.5 mb-2">
          <button
            type="button"
            onClick={() => { setIsAutoSpinning(false); setRotation(0); }}
            className={`text-[11px] py-1.5 px-1 rounded-lg font-bold transition-all text-center min-h-[32px] ${
              Math.abs(rotation) < 25
                ? 'bg-heritage-zawo text-slate-950 shadow-md font-black'
                : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
          >
            Depan (0°)
          </button>
          <button
            type="button"
            onClick={() => { setIsAutoSpinning(false); setRotation(90); }}
            className={`text-[11px] py-1.5 px-1 rounded-lg font-bold transition-all text-center min-h-[32px] ${
              Math.abs(rotation - 90) < 25
                ? 'bg-heritage-zawo text-slate-950 shadow-md font-black'
                : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
          >
            Kiri (90°)
          </button>
          <button
            type="button"
            onClick={() => { setIsAutoSpinning(false); setRotation(180); }}
            className={`text-[11px] py-1.5 px-1 rounded-lg font-bold transition-all text-center min-h-[32px] ${
              Math.abs(Math.abs(rotation) - 180) < 25
                ? 'bg-heritage-zawo text-slate-950 shadow-md font-black'
                : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
          >
            Belakang (180°)
          </button>
          <button
            type="button"
            onClick={() => { setIsAutoSpinning(false); setRotation(-90); }}
            className={`text-[11px] py-1.5 px-1 rounded-lg font-bold transition-all text-center min-h-[32px] ${
              Math.abs(rotation - -90) < 25
                ? 'bg-heritage-zawo text-slate-950 shadow-md font-black'
                : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
          >
            Kanan (-90°)
          </button>
        </div>

        {/* Orbit Slider Control */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-2 rounded-xl">
          <button
            type="button"
            onClick={() => setIsAutoSpinning((prev) => !prev)}
            title={isAutoSpinning ? 'Hentikan Putar Otomatis' : 'Putar 360° Otomatis'}
            className={`p-1.5 rounded-lg transition-all flex items-center justify-center min-h-[32px] min-w-[32px] ${
              isAutoSpinning
                ? 'bg-heritage-zawo text-slate-950 font-bold'
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
            className="w-full accent-heritage-zawo cursor-pointer h-1.5 bg-slate-700 rounded-lg appearance-none"
          />
          <span className="text-[11px] font-mono text-heritage-zawo font-bold w-11 text-right">
            {rotation}°
          </span>
        </div>
      </div>

    </div>
  );
};
