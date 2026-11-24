import React, { useState, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { 
  Orbit, Eye, EyeOff, Sliders, Activity, Sparkles, 
  Tv, Film, Play, Info, Settings, Compass, RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ==========================================
// 3D Inner Scene Components
// ==========================================

interface AnimatedSceneProps {
  orbVisible: boolean;
  hologramVisible: boolean;
  rotationSpeed: number;
  cinematicMode: boolean;
}

function AnimatedScene({ orbVisible, hologramVisible, rotationSpeed, cinematicMode }: AnimatedSceneProps) {
  const coreRef = useRef<THREE.Group>(null);
  const hologramRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);

  // Rotate elements in the 3D space
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const speedFactor = rotationSpeed * 0.5;

    // Rotate core/orb
    if (coreRef.current && orbVisible) {
      coreRef.current.rotation.y = time * 0.3 * speedFactor;
      coreRef.current.rotation.x = Math.sin(time * 0.1) * 0.1 * speedFactor;
    }

    // Rotate holographic dashboard rings
    if (hologramRef.current && hologramVisible) {
      hologramRef.current.rotation.y = -time * 0.15 * speedFactor;
      hologramRef.current.rotation.x = Math.cos(time * 0.08) * 0.05 * speedFactor;
    }

    // Rotate particles
    if (pointsRef.current && hologramVisible) {
      pointsRef.current.rotation.y = time * 0.08 * speedFactor;
    }

    // Cinematic Camera controller logic
    if (cinematicMode) {
      // Slow, dramatic, smooth camera sweep
      state.camera.position.x = Math.sin(time * 0.25) * 5.5;
      state.camera.position.z = Math.cos(time * 0.25) * 5.5;
      state.camera.position.y = Math.sin(time * 0.12) * 1.8;
      state.camera.lookAt(0, 0, 0);
    }
  });

  // Generate memoized telemetry particle cloud
  const particleCount = 220;
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    
    // Aesthetic neon palette
    const colorsPalette = [
      new THREE.Color('#6C2BFF'), // Deep Purple
      new THREE.Color('#00E5FF'), // Bright Cyan
      new THREE.Color('#00FFA3'), // Mint Green
      new THREE.Color('#FF3CAC'), // Hot Pink
    ];

    for (let i = 0; i < particleCount; i++) {
      // Outer disk orbital distribution
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.7 + Math.random() * 1.3;
      
      pos[i * 3] = Math.sin(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.5; // Thin horizontal band
      pos[i * 3 + 2] = Math.cos(angle) * radius;

      // Assign random color from neon palette
      const chosenColor = colorsPalette[Math.floor(Math.random() * colorsPalette.length)];
      col[i * 3] = chosenColor.r;
      col[i * 3 + 1] = chosenColor.g;
      col[i * 3 + 2] = chosenColor.b;
    }
    return { positions: pos, colors: col };
  }, []);

  return (
    <>
      {/* 3D AI Orb Group */}
      {orbVisible && (
        <group ref={coreRef}>
          {/* Inner Glowing Nucleus */}
          <mesh>
            <sphereGeometry args={[0.7, 32, 32]} />
            <meshBasicMaterial 
              color="#6C2BFF" 
              transparent 
              opacity={0.35} 
              wireframe 
            />
          </mesh>

          {/* Core Distorted Mesh / Particle Shell */}
          <mesh scale={[1.1, 1.1, 1.1]}>
            <sphereGeometry args={[0.7, 16, 16]} />
            <meshBasicMaterial 
              color="#00FFA3" 
              transparent 
              opacity={0.15} 
            />
          </mesh>

          {/* Outer Orbital Digital Cage */}
          <mesh scale={[1.3, 1.3, 1.3]}>
            <octahedronGeometry args={[0.8, 2]} />
            <meshBasicMaterial 
              color="#FF3CAC" 
              wireframe 
              transparent 
              opacity={0.4} 
            />
          </mesh>
        </group>
      )}

      {/* Holographic Dashboard Ring & Ring Mesh */}
      {hologramVisible && (
        <group ref={hologramRef}>
          {/* Main Horizontal Dashboard Grid Disk */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
            <ringGeometry args={[1.5, 1.55, 64]} />
            <meshBasicMaterial color="#00E5FF" side={THREE.DoubleSide} transparent opacity={0.65} />
          </mesh>

          {/* Concentric Secondary Ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
            <ringGeometry args={[1.8, 1.82, 32]} />
            <meshBasicMaterial color="#6C2BFF" side={THREE.DoubleSide} transparent opacity={0.4} />
          </mesh>

          {/* Outermost Segmented Dash Ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
            <ringGeometry args={[2.2, 2.25, 6]} />
            <meshBasicMaterial color="#FF3CAC" side={THREE.DoubleSide} transparent opacity={0.5} wireframe />
          </mesh>

          {/* Holographic vertical status marker lines */}
          <mesh position={[1.5, 0.1, 0]}>
            <boxGeometry args={[0.02, 0.6, 0.02]} />
            <meshBasicMaterial color="#00E5FF" transparent opacity={0.7} />
          </mesh>

          <mesh position={[-1.5, -0.1, 0]}>
            <boxGeometry args={[0.02, 0.4, 0.02]} />
            <meshBasicMaterial color="#00FFA3" transparent opacity={0.6} />
          </mesh>

          <mesh position={[0, 0, 1.5]}>
            <boxGeometry args={[0.02, 0.5, 0.02]} />
            <meshBasicMaterial color="#FF3CAC" transparent opacity={0.5} />
          </mesh>
        </group>
      )}

      {/* Orbiting Telemetry Spark Particles */}
      {hologramVisible && (
        <points ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[positions, 3]}
            />
            <bufferAttribute
              attach="attributes-color"
              args={[colors, 3]}
            />
          </bufferGeometry>
          <pointsMaterial 
            size={0.065} 
            vertexColors 
            transparent 
            opacity={0.9} 
            sizeAttenuation 
          />
        </points>
      )}
    </>
  );
}

// ==========================================
// Robust 2D/3D Fallback Vector Scene
// Used when WebGL is unsupported or throws an error
// ==========================================

class CanvasErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.warn("WebGL Canvas failed to load or threw an error, fallback active.", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

interface FallbackProps {
  orbVisible: boolean;
  hologramVisible: boolean;
  rotationSpeed: number;
  cinematicMode: boolean;
}

function SVGFallbackScene({ orbVisible, hologramVisible, rotationSpeed, cinematicMode }: FallbackProps) {
  // Speed parameter in seconds for full CSS spin
  const duration = Math.max(1, 15 / (rotationSpeed || 1));
  const corePulseDuration = Math.max(0.5, 3 / (rotationSpeed || 1));

  return (
    <div className="absolute inset-0 bg-[#070A15] flex items-center justify-center overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute w-72 h-72 rounded-full bg-[#6C2BFF]/10 blur-[100px] animate-pulse" />
      <div className="absolute w-48 h-48 rounded-full bg-[#00E5FF]/5 blur-[80px] -translate-x-12 -translate-y-12" />

      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* Holographic orbital rings */}
        {hologramVisible && (
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: cinematicMode ? 'perspective(800px) rotateX(60deg) rotateY(10deg)' : 'perspective(800px) rotateX(65deg)',
              transition: 'transform 1.5s ease-in-out'
            }}
          >
            {/* Outer segmented dash ring */}
            <div 
              className="absolute w-72 h-72 rounded-full border border-dashed border-[#FF3CAC]/40 animate-spin"
              style={{ animationDuration: `${duration * 1.5}s` }}
            />
            {/* Middle main tech ring */}
            <div 
              className="absolute w-60 h-60 rounded-full border-2 border-double border-[#00E5FF]/60 animate-spin"
              style={{ animationDuration: `${duration}s`, animationDirection: 'reverse' }}
            />
            {/* Inner secondary ring */}
            <div 
              className="absolute w-48 h-48 rounded-full border border-[#6C2BFF]/50 animate-spin"
              style={{ animationDuration: `${duration * 0.8}s` }}
            />
          </div>
        )}

        {/* Central glowing AI Core / Orb */}
        {orbVisible && (
          <div 
            className="relative w-24 h-24 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(108,43,255,0.4)] bg-gradient-to-tr from-[#6C2BFF]/30 to-[#00FFA3]/20 border border-[#6C2BFF]/40 backdrop-blur-sm transition-all"
            style={{
              animation: `pulse ${corePulseDuration}s ease-in-out infinite alternate`,
            }}
          >
            {/* Innermost wireframe-like rotating octahedron (SVG representation) */}
            <svg 
              className="w-16 h-16 text-[#00FFA3]/80 animate-spin" 
              style={{ animationDuration: `${duration * 0.5}s` }}
              viewBox="0 0 100 100"
            >
              <polygon points="50,10 80,50 50,90 20,50" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
              <polygon points="50,30 65,50 50,70 35,50" fill="none" stroke="#FF3CAC" strokeWidth="1" />
            </svg>

            {/* Core center glowing ball */}
            <div className="absolute w-6 h-6 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#6C2BFF] blur-[2px] opacity-80" />
          </div>
        )}

        {/* Star telemetry particles (SVG floating stars) */}
        {hologramVisible && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
            <circle cx="20" cy="30" r="0.8" fill="#00E5FF" className="animate-ping" style={{ animationDuration: '3s' }} />
            <circle cx="85" cy="40" r="1.2" fill="#00FFA3" className="animate-pulse" style={{ animationDuration: '4s' }} />
            <circle cx="35" cy="80" r="0.6" fill="#FF3CAC" className="animate-ping" style={{ animationDuration: '2.5s' }} />
            <circle cx="75" cy="70" r="1" fill="#6C2BFF" className="animate-pulse" style={{ animationDuration: '3.5s' }} />
          </svg>
        )}
      </div>
    </div>
  );
}

// ==========================================
// Main SceneController Component
// ==========================================

export default function SceneController() {
  const [orbVisible, setOrbVisible] = useState(true);
  const [hologramVisible, setHologramVisible] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(1.5);
  const [cinematicMode, setCinematicMode] = useState(false);
  const [showWireframeMenu, setShowWireframeMenu] = useState(false);

  // Reset controls to standard parameters
  const handleReset = () => {
    setOrbVisible(true);
    setHologramVisible(true);
    setRotationSpeed(1.5);
    setCinematicMode(false);
  };

  return (
    <div id="scene-controller-root" className="w-full min-h-[580px] bg-[#090D1A] rounded-3xl border border-white/10 relative overflow-hidden flex flex-col justify-between text-white select-none">
      
      {/* 3D RENDER CANVAS AREA */}
      <div className="absolute inset-0 z-0">
        <CanvasErrorBoundary fallback={
          <SVGFallbackScene 
            orbVisible={orbVisible}
            hologramVisible={hologramVisible}
            rotationSpeed={rotationSpeed}
            cinematicMode={cinematicMode}
          />
        }>
          <Canvas camera={{ position: [0, 1.2, 4.2], fov: 60 }}>
            <color attach="background" args={['#070A15']} />
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#6C2BFF" />
            <pointLight position={[-10, -10, -10]} intensity={0.8} color="#00E5FF" />
            <directionalLight position={[0, 5, 2]} intensity={1.2} color="#00FFA3" />
            
            <AnimatedScene 
              orbVisible={orbVisible}
              hologramVisible={hologramVisible}
              rotationSpeed={rotationSpeed}
              cinematicMode={cinematicMode}
            />

            {/* Allow custom pan and drag rotation unless locked by Cinematic mode */}
            {!cinematicMode && (
              <OrbitControls 
                enableZoom={true} 
                maxDistance={12} 
                minDistance={1.5} 
                enablePan={true}
              />
            )}
          </Canvas>
        </CanvasErrorBoundary>
      </div>

      {/* DYNAMIC TOP OVERLAY: BRANDING & UTILITIES */}
      <div className="relative z-10 p-5 flex items-start justify-between pointer-events-none">
        <div className="pointer-events-auto glass-panel bg-black/60 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center space-x-3 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-accent flex items-center justify-center animate-spin-slow">
            <Orbit className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display font-extrabold text-xs tracking-wider uppercase text-white">R3F Core Space</span>
              <span className="px-1.5 py-0.5 rounded text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold uppercase animate-pulse">INTELLIGENT</span>
            </div>
            <p className="text-[10px] text-white/50 font-mono">NODE COORD: ORB-220 // MATRIX ACTIVE</p>
          </div>
        </div>

        {/* Cinematic state notification HUD */}
        <AnimatePresence>
          {cinematicMode && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="pointer-events-auto glass-panel bg-red-950/40 border border-red-500/30 rounded-2xl p-3 flex items-center space-x-2.5 shadow-lg shadow-red-500/5"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <div className="text-left">
                <span className="block text-[9px] font-mono font-bold text-red-400 uppercase tracking-widest">CINEMATIC SWEEP ON</span>
                <span className="block text-[8px] font-mono text-white/50">CAM SPEED: 0.25RAD/S • AUTO SWEEP</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* DYNAMIC BOTTOM INTERACTION CONTROL CENTER */}
      <div className="relative z-10 p-5 space-y-4">
        
        {/* CINEMATIC MODE CINEMATIC LETTERBOXES (Rendered overlay on top/bottom of the canvas when cinematicMode is active) */}
        <AnimatePresence>
          {cinematicMode && (
            <>
              {/* Top widescreen letterbox */}
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: '36px' }}
                exit={{ height: 0 }}
                className="absolute top-0 left-0 right-0 bg-black z-30 pointer-events-none flex items-center justify-between px-6 border-b border-white/5"
              >
                <span className="text-[9px] font-mono text-white/40 tracking-wider">KRONEX CINEMATIC GRID ENGAGED // SEQUENCE-003</span>
                <span className="text-[9px] font-mono text-red-500 font-bold animate-pulse">● REC 4K</span>
              </motion.div>

              {/* Bottom widescreen letterbox */}
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: '36px' }}
                exit={{ height: 0 }}
                className="absolute bottom-0 left-0 right-0 bg-black z-30 pointer-events-none flex items-center justify-center border-t border-white/5"
              >
                <span className="text-[9px] font-mono text-white/40 tracking-wider uppercase">FOCAL DEEP SWEEP • ROTATION FACTOR: {(rotationSpeed * 0.5).toFixed(2)}x</span>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* FLOATING CONTROL HUD PANEL */}
        <div className="bg-[#0D1224]/85 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4 max-w-full relative overflow-hidden">
          
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4 text-brand-secondary" />
              <h3 className="font-display font-bold text-xs tracking-wider uppercase text-white">Telemetry & Scene Vector Matrix</h3>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleReset}
                title="Reset Simulation"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-primary/40 transition-all text-white/70 hover:text-white cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            
            {/* TOGGLE 3D AI ORB */}
            <div className="flex items-center justify-between bg-white/3 border border-white/5 p-3 rounded-xl hover:border-white/10 transition-colors">
              <div className="flex items-center space-x-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${orbVisible ? 'bg-brand-primary/15 border border-brand-primary/30 text-brand-primary' : 'bg-white/5 border border-white/5 text-white/40'}`}>
                  {orbVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </div>
                <div>
                  <span className="block text-[11px] font-extrabold uppercase tracking-wide">3D AI Orb</span>
                  <span className="block text-[8px] font-mono text-white/40">VECTOR CORE SHELL</span>
                </div>
              </div>
              <button
                onClick={() => setOrbVisible(!orbVisible)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${orbVisible ? 'bg-brand-primary' : 'bg-white/10'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${orbVisible ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* TOGGLE HOLOGRAPHIC DASHBOARD */}
            <div className="flex items-center justify-between bg-white/3 border border-white/5 p-3 rounded-xl hover:border-white/10 transition-colors">
              <div className="flex items-center space-x-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${hologramVisible ? 'bg-brand-accent/15 border border-brand-accent/30 text-brand-accent' : 'bg-white/5 border border-white/5 text-white/40'}`}>
                  {hologramVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </div>
                <div>
                  <span className="block text-[11px] font-extrabold uppercase tracking-wide">Holo Dash</span>
                  <span className="block text-[8px] font-mono text-white/40">ORBITAL GRID LATTICE</span>
                </div>
              </div>
              <button
                onClick={() => setHologramVisible(!hologramVisible)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${hologramVisible ? 'bg-brand-accent' : 'bg-white/10'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${hologramVisible ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* ROTATION SPEED SLIDER */}
            <div className="bg-white/3 border border-white/5 p-3 rounded-xl hover:border-white/10 transition-colors flex flex-col justify-center space-y-2 col-span-1 md:col-span-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Sliders className="w-3.5 h-3.5 text-brand-secondary" />
                  <span className="text-[10px] font-mono font-bold uppercase text-white/70">Warp Rotation</span>
                </div>
                <span className="text-[10px] font-mono text-brand-secondary font-bold">{rotationSpeed.toFixed(1)}x</span>
              </div>
              <input 
                type="range"
                min="0.1"
                max="5.0"
                step="0.1"
                value={rotationSpeed}
                onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                className="w-full accent-brand-secondary bg-white/10 rounded-lg cursor-pointer h-1.5"
              />
            </div>

            {/* CINEMATIC MODE TRIGGER */}
            <div className={`flex items-center justify-between p-3 rounded-xl transition-all ${cinematicMode ? 'bg-red-500/10 border border-red-500/20 shadow-lg shadow-red-500/5' : 'bg-white/3 border border-white/5 hover:border-white/10'}`}>
              <div className="flex items-center space-x-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${cinematicMode ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-white/40'}`}>
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <span className={`block text-[11px] font-extrabold uppercase tracking-wide ${cinematicMode ? 'text-red-400' : 'text-white'}`}>Cinematic Mode</span>
                  <span className="block text-[8px] font-mono text-white/40">DRAMATIC CAMERA SWEEP</span>
                </div>
              </div>
              <button
                onClick={() => setCinematicMode(!cinematicMode)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${cinematicMode ? 'bg-red-500' : 'bg-white/10'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${cinematicMode ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

          </div>

          {/* SIMULATION DATA READOUT HUD */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/5">
            <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
              <span className="block text-[8px] font-mono text-white/40 uppercase">MATRIX RESOLUTION</span>
              <span className="block text-[11px] font-mono font-bold text-white/80">3840 X 2160 (4K UHD)</span>
            </div>
            <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
              <span className="block text-[8px] font-mono text-white/40 uppercase">RENDER LOOP</span>
              <span className="block text-[11px] font-mono font-bold text-emerald-400 animate-pulse flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>60.0 FPS STABLE</span>
              </span>
            </div>
            <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
              <span className="block text-[8px] font-mono text-white/40 uppercase">BUFFER SECTORS</span>
              <span className="block text-[11px] font-mono font-bold text-white/80">8,192 COGNITIVE BLOCKS</span>
            </div>
            <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
              <span className="block text-[8px] font-mono text-white/40 uppercase">DRAG TO ROTATE</span>
              <span className="block text-[11px] font-mono font-bold text-brand-secondary flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 animate-spin-slow" />
                <span>{cinematicMode ? "CAMERA LOCKED" : "ORBIT ACTIVE"}</span>
              </span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
