"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const LineComponent = "line" as any;

function SynthHardware() {
  const groupRef = useRef<THREE.Group>(null!);
  const waveRef = useRef<THREE.Line>(null!);
  const knob1Ref = useRef<THREE.Mesh>(null!);
  const knob2Ref = useRef<THREE.Mesh>(null!);
  const knob3Ref = useRef<THREE.Mesh>(null!);

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const handleStateChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsPlaying(customEvent.detail);
    };
    window.addEventListener("audioPlayState", handleStateChange);
    return () => window.removeEventListener("audioPlayState", handleStateChange);
  }, []);

  // Construct points for the CRT oscilloscope waveform screen
  const points = useMemo(() => {
    const pts = [];
    const count = 32;
    for (let i = 0; i < count; i++) {
      // Linear X coordinates inside screen bounds [-0.5, 0.5]
      const x = -0.5 + i / (count - 1);
      pts.push(new THREE.Vector3(x, 0, 0.06));
    }
    return pts;
  }, []);

  const lineGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const speed = isPlaying ? 10.0 : 2.0;
    const amplitude = isPlaying ? 0.18 : 0.02;

    // 1. Update live CRT oscilloscope waveform vertices
    if (waveRef.current) {
      const geom = waveRef.current.geometry;
      const pos = geom.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        // Create an organic audio wave simulation
        const y = Math.sin(x * 6.5 + t * speed) * Math.cos(x * 3.0 - t * speed * 0.5) * amplitude;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
    }

    // 2. Animate knob rotations (faster if playing audio)
    if (knob1Ref.current) knob1Ref.current.rotation.z = Math.sin(t * (isPlaying ? 3.0 : 0.8)) * 0.8;
    if (knob2Ref.current) knob2Ref.current.rotation.z = Math.cos(t * (isPlaying ? 4.0 : 1.0)) * 0.8;
    if (knob3Ref.current) knob3Ref.current.rotation.z = Math.sin(t * (isPlaying ? 2.0 : 0.5)) * 0.8;

    // 3. Mouse parallax tilt on the entire module chassis
    const mx = state.pointer.x * 0.25;
    const my = state.pointer.y * 0.25;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mx, 0.1);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -my, 0.1);
  });

  return (
    <group ref={groupRef}>
      {/* 3D Steel Module Casing/Backplate */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 2.2, 0.08]} />
        <meshStandardMaterial color="#1e1e24" roughness={0.45} metalness={0.8} />
      </mesh>
      
      {/* Front Plate Outer Glowing Rim Border */}
      <mesh position={[0, 0, 0.045]}>
        <boxGeometry args={[1.44, 2.14, 0.01]} />
        <meshStandardMaterial color="#0c0a0f" roughness={0.5} />
      </mesh>

      {/* Screen Frame Box (Bezel) */}
      <mesh position={[0, 0.55, 0.06]}>
        <boxGeometry args={[1.2, 0.65, 0.03]} />
        <meshStandardMaterial color="#17171a" roughness={0.6} />
      </mesh>

      {/* CRT Glowing Green Screen Backdrop */}
      <mesh position={[0, 0.55, 0.076]}>
        <planeGeometry args={[1.1, 0.55]} />
        <meshStandardMaterial 
          color="#051c18" 
          emissive="#041210"
          roughness={0.1}
        />
      </mesh>

      {/* Oscilloscope Green Line Waveform */}
      <LineComponent ref={waveRef} geometry={lineGeometry} position={[0, 0.55, 0.02]}>
        <lineBasicMaterial color="#34d399" linewidth={2} />
      </LineComponent>

      {/* Knob 1 (Left - Frequency Fader) */}
      <group position={[-0.38, -0.15, 0.06]}>
        {/* Base Cylinder */}
        <mesh ref={knob1Ref}>
          <cylinderGeometry args={[0.18, 0.18, 0.12, 24]} />
          <meshStandardMaterial color="#2d2d30" roughness={0.5} metalness={0.6} />
          {/* Pointer indicator line */}
          <mesh position={[0, 0.07, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
            <boxGeometry args={[0.02, 0.08, 0.02]} />
            <meshBasicMaterial color="#22d3ee" />
          </mesh>
        </mesh>
        {/* Label text indicator */}
        <mesh position={[0, -0.22, 0.06]}>
          <planeGeometry args={[0.3, 0.08]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.0} />
        </mesh>
      </group>

      {/* Knob 2 (Center - Resonance Fader) */}
      <group position={[0, -0.15, 0.06]}>
        <mesh ref={knob2Ref}>
          <cylinderGeometry args={[0.18, 0.18, 0.12, 24]} />
          <meshStandardMaterial color="#2d2d30" roughness={0.5} metalness={0.6} />
          <mesh position={[0, 0.07, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
            <boxGeometry args={[0.02, 0.08, 0.02]} />
            <meshBasicMaterial color="#c084fc" />
          </mesh>
        </mesh>
      </group>

      {/* Knob 3 (Right - Decay Fader) */}
      <group position={[0.38, -0.15, 0.06]}>
        <mesh ref={knob3Ref}>
          <cylinderGeometry args={[0.18, 0.18, 0.12, 24]} />
          <meshStandardMaterial color="#2d2d30" roughness={0.5} metalness={0.6} />
          <mesh position={[0, 0.07, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
            <boxGeometry args={[0.02, 0.08, 0.02]} />
            <meshBasicMaterial color="#f472b6" />
          </mesh>
        </mesh>
      </group>

      {/* Sockets Panel Group (4 physical sockets at bottom) */}
      <group position={[0, -0.65, 0.06]}>
        {/* Labeled circles / Jack sockets */}
        {[-0.45, -0.15, 0.15, 0.45].map((xOffset, idx) => {
          const colors = ["#22d3ee", "#c084fc", "#f472b6", "#34d399"];
          return (
            <group key={idx} position={[xOffset, 0, 0]}>
              {/* Outer metal socket ring */}
              <mesh>
                <cylinderGeometry args={[0.09, 0.09, 0.04, 16]} rotation={[Math.PI / 2, 0, 0]} />
                <meshStandardMaterial color="#a1a1aa" metalness={0.9} roughness={0.2} />
              </mesh>
              {/* Inner jack hole */}
              <mesh position={[0, 0, 0.021]}>
                <cylinderGeometry args={[0.05, 0.05, 0.01, 16]} rotation={[Math.PI / 2, 0, 0]} />
                <meshBasicMaterial color="#000000" />
              </mesh>
              {/* LED status light right above */}
              <mesh position={[0, 0.14, 0.01]}>
                <sphereGeometry args={[0.022, 8, 8]} />
                <meshStandardMaterial 
                  color={colors[idx]} 
                  emissive={colors[idx]} 
                  emissiveIntensity={isPlaying ? 1.0 : 0.2} 
                />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}

export default function ThreeSynthModule() {
  return (
    <div className="w-full h-full min-h-[350px] relative select-none">
      <Canvas
        camera={{ position: [0, 0, 2.7], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 5, 4]} intensity={1.8} color="#ffffff" />
        <directionalLight position={[-4, 2, 3]} intensity={0.5} color="#e0f2fe" />
        <pointLight position={[0, 0, 1.0]} intensity={1.2} distance={3} color="#c084fc" />
        
        <SynthHardware />
      </Canvas>
    </div>
  );
}
