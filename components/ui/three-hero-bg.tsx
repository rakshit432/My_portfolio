"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const LineComponent = "line" as any;

function MorphingBlob({ color, position, scale, speed }: { color: string; position: [number, number, number]; scale: [number, number, number]; speed: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const handleStateChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsPlaying(customEvent.detail);
    };
    window.addEventListener("audioPlayState", handleStateChange);
    return () => window.removeEventListener("audioPlayState", handleStateChange);
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const activeSpeed = isPlaying ? speed * 2.0 : speed;

    // Slowly drift the position in a smooth circular path
    meshRef.current.position.x = position[0] + Math.sin(t * activeSpeed * 0.4) * 0.9;
    meshRef.current.position.y = position[1] + Math.cos(t * activeSpeed * 0.6) * 0.6;
    
    // Slowly rotate to morph reflections
    meshRef.current.rotation.x = t * 0.05;
    meshRef.current.rotation.y = t * 0.03;
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <sphereGeometry args={[1.6, 32, 32]} />
      <meshPhysicalMaterial 
        color={color}
        emissive={color}
        emissiveIntensity={0.08}
        transmission={0.8}
        roughness={0.45}
        thickness={2.0}
        transparent
        opacity={0.08} // Soft and subtle, does not distract
      />
    </mesh>
  );
}

function AnalogWaveLine({ color, speed, amplitude, yOffset, opacity }: { color: string; speed: number; amplitude: number; yOffset: number; opacity: number }) {
  const lineRef = useRef<THREE.Line>(null!);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(1);

  useEffect(() => {
    const handleStateChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsPlaying(customEvent.detail);
    };
    window.addEventListener("audioPlayState", handleStateChange);
    return () => window.removeEventListener("audioPlayState", handleStateChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const o = Math.max(0, 1 - scrollY / 550);
      setScrollOpacity(o);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const points = useMemo(() => {
    const pts = [];
    const count = 72;
    for (let i = 0; i < count; i++) {
      const x = -8.0 + (i / (count - 1)) * 16.0;
      pts.push(new THREE.Vector3(x, 0, -2.5));
    }
    return pts;
  }, []);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const activeSpeed = isPlaying ? speed * 2.2 : speed;
    const activeAmp = isPlaying ? amplitude * 1.8 : amplitude;
    const pos = lineRef.current.geometry.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = Math.sin(x * 0.55 + t * activeSpeed) * Math.cos(x * 0.25 - t * activeSpeed * 0.4) * activeAmp + yOffset;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
  });

  return (
    <LineComponent ref={lineRef} geometry={geometry} visible={scrollOpacity > 0}>
      <lineBasicMaterial color={color} transparent opacity={opacity * scrollOpacity} linewidth={1.5} />
    </LineComponent>
  );
}

function MusicParticles() {
  const pointsRef = useRef<THREE.Points>(null!);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const handleStateChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsPlaying(customEvent.detail);
    };
    window.addEventListener("audioPlayState", handleStateChange);
    return () => window.removeEventListener("audioPlayState", handleStateChange);
  }, []);

  const [positions, velocities, colors] = useMemo(() => {
    const count = 120;
    const pos = new Float32Array(count * 3);
    const vels = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);

    const palette = [
      new THREE.Color("#22d3ee"),
      new THREE.Color("#c084fc"),
    ];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;

      vels[i * 3] = (Math.random() - 0.5) * 0.008;
      vels[i * 3 + 1] = (Math.random() - 0.5) * 0.008;
      vels[i * 3 + 2] = (Math.random() - 0.5) * 0.008;

      const color = palette[Math.floor(Math.random() * palette.length)];
      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    }
    return [pos, vels, cols];
  }, []);

  useFrame((state) => {
    const geom = pointsRef.current?.geometry;
    if (!geom) return;

    const pos = geom.attributes.position;
    const speed = isPlaying ? 2.2 : 0.5;
    const time = state.clock.getElapsedTime();

    const mx = state.pointer.x * 6;
    const my = state.pointer.y * 6;

    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
    const scrollOffset = scrollY * 0.002;

    for (let i = 0; i < 120; i++) {
      let x = pos.getX(i) + velocities[i * 3] * speed;
      let y = pos.getY(i) + velocities[i * 3 + 1] * speed;
      let z = pos.getZ(i) + velocities[i * 3 + 2] * speed;

      const dx = mx - x;
      const dy = my - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 4.0) {
        const pull = (4.0 - dist) * 0.008;
        x += dx * pull;
        y += dy * pull;
      }

      if (Math.abs(x) > 10) x = (Math.random() - 0.5) * 18;
      if (Math.abs(y) > 10) y = (Math.random() - 0.5) * 18;
      if (Math.abs(z) > 8) z = (Math.random() - 0.5) * 12;

      pos.setXYZ(i, x, y, z);
    }
    pos.needsUpdate = true;

    pointsRef.current.rotation.y = time * 0.01 + scrollOffset * 0.08;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial 
        size={0.06} 
        vertexColors 
        transparent 
        opacity={0.3} 
        sizeAttenuation 
      />
    </points>
  );
}

export default function ThreeHeroBg() {
  return (
    <div className="three-canvas-wrapper absolute inset-0 -z-10 h-full w-full overflow-hidden pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5.0], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[0, 10, 5]} intensity={1.5} color="#22d3ee" />
        
        <MusicParticles />

        {/* Large, slowly morphing 3D Glassmorphic Blobs */}
        <MorphingBlob 
          color="#a855f7" // Purple
          position={[-2.5, 1.5, -4.0]} 
          scale={[1.8, 1.8, 1.8]} 
          speed={0.3} 
        />
        <MorphingBlob 
          color="#06b6d4" // Cyan
          position={[3.0, -1.8, -4.0]} 
          scale={[2.2, 2.2, 2.2]} 
          speed={0.25} 
        />

        {/* Dynamic Analog Oscilloscope Waveforms */}
        <AnalogWaveLine 
          color="#22d3ee" 
          speed={0.4} 
          amplitude={0.35} 
          yOffset={0.3} 
          opacity={0.22} 
        />
        <AnalogWaveLine 
          color="#c084fc" 
          speed={0.3} 
          amplitude={0.28} 
          yOffset={-0.4} 
          opacity={0.16} 
        />
      </Canvas>
    </div>
  );
}
