"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function GatewayAnomaly() {
  const meshRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  
  const [isUpsideDown, setIsUpsideDown] = useState(false);

  useEffect(() => {
    const handleDimensionChange = (e: Event) => {
      setIsUpsideDown((e as CustomEvent).detail);
    };
    window.addEventListener("dimensionShiftState", handleDimensionChange);
    if (document.body.classList.contains("alternate-dimension")) {
      setIsUpsideDown(true);
    }
    return () => window.removeEventListener("dimensionShiftState", handleDimensionChange);
  }, []);

  // Particle positions
  const count = 120;
  const positions = new Float32Array(count * 3);
  const speeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    const dist = 0.2 + Math.random() * 0.9;
    
    positions[i * 3] = dist * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = dist * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = dist * Math.cos(phi);
    
    speeds[i] = 0.2 + Math.random() * 0.8;
  }

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const mx = state.pointer.x;
    const my = state.pointer.y;
    
    // Rotate central anomaly mesh
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.35;
      meshRef.current.rotation.x = t * 0.2;
      
      const scale = isUpsideDown 
        ? 1.05 + Math.sin(t * 3.5) * 0.08 + Math.abs(mx) * 0.1
        : 0.9 + Math.sin(t * 1.5) * 0.04;
      meshRef.current.scale.set(scale, scale, scale);
    }
    
    // Rotate outer telemetry ring
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = -t * 0.18;
      outerRingRef.current.rotation.x = Math.PI / 3 + my * 0.1;
      outerRingRef.current.rotation.y = mx * 0.1;
    }
    
    // Rotate particles and drift them outward
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.05;
      const geom = particlesRef.current.geometry;
      const posAttr = geom.attributes.position;
      
      for (let i = 0; i < count; i++) {
        let x = posAttr.getX(i);
        let y = posAttr.getY(i);
        let z = posAttr.getZ(i);
        
        let r = Math.sqrt(x*x + y*y + z*z);
        if (r > 1.8) {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos((Math.random() * 2) - 1);
          const dist = 0.1 + Math.random() * 0.2;
          posAttr.setXYZ(i, 
            dist * Math.sin(phi) * Math.cos(theta),
            dist * Math.sin(phi) * Math.sin(theta),
            dist * Math.cos(phi)
          );
        } else {
          const speed = speeds[i] * delta * (isUpsideDown ? 1.4 : 0.6);
          posAttr.setXYZ(i, x + (x/r)*speed, y + (y/r)*speed, z + (z/r)*speed);
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* 1. Core Anomaly (Warping Spooky Portal / Radar Sphere) */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial
          color={isUpsideDown ? "#ef4444" : "#ccfbf1"}
          wireframe={!isUpsideDown}
          emissive={isUpsideDown ? "#7f1d1d" : "#042f2e"}
          emissiveIntensity={2.5}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* 2. Outer Rotating Telemetry Radar Rings */}
      <mesh ref={outerRingRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.78, 0.015, 8, 64]} />
        <meshBasicMaterial 
          color={isUpsideDown ? "#ef4444" : "#14b8a6"} 
          transparent 
          opacity={isUpsideDown ? 0.65 : 0.3} 
        />
      </mesh>
      
      {/* Secondary ring perpendicular */}
      <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <torusGeometry args={[0.9, 0.008, 8, 48]} />
        <meshBasicMaterial 
          color={isUpsideDown ? "#ef4444" : "#06b6d4"} 
          transparent 
          opacity={isUpsideDown ? 0.4 : 0.15} 
        />
      </mesh>

      {/* 3. Floating Spores / Radar Pulse Particle Cloud */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isUpsideDown ? 0.038 : 0.02}
          color={isUpsideDown ? "#ef4444" : "#99f6e4"}
          transparent
          opacity={isUpsideDown ? 0.8 : 0.4}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function ThreeCharacterAvatar() {
  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        camera={{ position: [0, 0, 2.0], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        
        {/* Warm key light */}
        <directionalLight position={[2, 3, 2]} intensity={2.0} color="#ffedd5" />
        
        {/* Intense Crimson back light for Upside Down bleed */}
        <pointLight position={[0, 0.5, -2.5]} intensity={6.0} color="#ef4444" />
        
        <Suspense fallback={null}>
          <GatewayAnomaly />
        </Suspense>
      </Canvas>
    </div>
  );
}
