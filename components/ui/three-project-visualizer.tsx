"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const LineComponent = "line" as any;

// ─── SHARED PULSE HOOK ───────────────────────────────────────────────────────
function usePianoImpulse() {
  const scaleRef = useRef(1.0);
  useEffect(() => {
    const h = () => { scaleRef.current = 1.28; };
    window.addEventListener("pianoNotePlayed", h);
    return () => window.removeEventListener("pianoNotePlayed", h);
  }, []);
  return scaleRef;
}

// ─── PROJECT 1: FUTURE MEET — Floating video-call panel cluster ──────────────
function FutureMeetVisual() {
  const groupRef = useRef<THREE.Group>(null!);
  const impulse  = usePianoImpulse();

  const panels = useMemo(() => [
    { pos: [-0.55, 0.20, 0] as [number,number,number], rot: [0.05, 0.35, -0.06] as [number,number,number] },
    { pos: [ 0.55, 0.20, 0] as [number,number,number], rot: [0.05,-0.35,  0.06] as [number,number,number] },
    { pos: [ 0.00,-0.52, 0.25] as [number,number,number], rot: [-0.08, 0.0,  0.0] as [number,number,number] },
  ], []);

  useFrame((state) => {
    const t  = state.clock.getElapsedTime();
    const mx = state.pointer.x * 0.35;
    const my = state.pointer.y * 0.35;

    impulse.current = THREE.MathUtils.lerp(impulse.current, 1.0, 0.08);
    groupRef.current.scale.setScalar(impulse.current);

    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, t * 0.18 + mx, 0.06);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, Math.sin(t * 0.5) * 0.12 + my, 0.06);
    groupRef.current.position.y = Math.sin(t * 1.2) * 0.065;
  });

  return (
    <group ref={groupRef}>
      {panels.map((p, i) => (
        <group key={i} position={p.pos} rotation={p.rot}>
          <mesh>
            <planeGeometry args={[0.54, 0.36]} />
            <meshPhysicalMaterial
              color="#1e0a3c"
              transmission={0.7}
              roughness={0.1}
              thickness={0.5}
              clearcoat={1.0}
              transparent
              opacity={0.75}
            />
          </mesh>
          <mesh>
            <edgesGeometry args={[new THREE.PlaneGeometry(0.54, 0.36)]} />
            <lineBasicMaterial color="#a855f7" />
          </mesh>
          <mesh position={[0, 0, 0.001]}>
            <planeGeometry args={[0.50, 0.32]} />
            <meshBasicMaterial color="#4c1d95" transparent opacity={0.18} />
          </mesh>
          <mesh position={[0, 0.04, 0.01]}>
            <circleGeometry args={[0.07, 24]} />
            <meshBasicMaterial color="#7c3aed" transparent opacity={0.65} />
          </mesh>
          <mesh position={[0.22, 0.14, 0.01]}>
            <circleGeometry args={[0.018, 12]} />
            <meshBasicMaterial color="#4ade80" />
          </mesh>
        </group>
      ))}

      <mesh position={[0, 0, 0.05]}>
        <sphereGeometry args={[0.09, 24, 24]} />
        <meshStandardMaterial color="#6d28d9" emissive="#a855f7" emissiveIntensity={0.9} />
      </mesh>

      {panels.map((_, i) => {
        const next = panels[(i + 1) % 3];
        return (
          <PanelLine key={i} from={_.pos} to={next.pos} />
        );
      })}
    </group>
  );
}

function PanelLine({ from, to }: { from: [number,number,number]; to: [number,number,number] }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current && ref.current.material instanceof THREE.MeshBasicMaterial) {
      ref.current.material.opacity = 0.25 + Math.sin(t * 2.5) * 0.12;
    }
  });

  const points = useMemo(() => {
    const v1 = new THREE.Vector3(...from);
    const v2 = new THREE.Vector3(...to);
    const mid = v1.clone().lerp(v2, 0.5).multiplyScalar(0.7);
    const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
    return curve.getPoints(20);
  }, [from, to]);

  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints(points);
    return g;
  }, [points]);

  return (
    <LineComponent geometry={lineGeo} ref={ref}>
      <lineBasicMaterial color="#7c3aed" transparent opacity={0.3} />
    </LineComponent>
  );
}

// ─── PROJECT 2: SQL AI AGENT — Inference pipeline ────────────────────────────
function NexusDBVisual() {
  const groupRef    = useRef<THREE.Group>(null!);
  const streamRef   = useRef<THREE.Points>(null!);
  const impulse     = usePianoImpulse();

  const count = 120;
  const [pos, speeds] = useMemo(() => {
    const p = new Float32Array(count * 3);
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      p[i*3]   = (Math.random() - 0.5) * 0.55;
      p[i*3+1] = (Math.random() - 0.5) * 1.4;
      p[i*3+2] = (Math.random() - 0.5) * 0.55;
      s[i] = 0.4 + Math.random() * 0.9;
    }
    return [p, s];
  }, []);

  useFrame((state) => {
    const t  = state.clock.getElapsedTime();
    const mx = state.pointer.x * 0.3;
    const my = state.pointer.y * 0.3;

    impulse.current = THREE.MathUtils.lerp(impulse.current, 1.0, 0.08);
    groupRef.current.scale.setScalar(impulse.current);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, t * 0.25 + mx, 0.07);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -0.22 + my, 0.07);
    groupRef.current.position.y = Math.sin(t * 0.9) * 0.06;

    if (streamRef.current) {
      const attr = streamRef.current.geometry.attributes.position;
      for (let i = 0; i < count; i++) {
        let y = attr.getY(i) + speeds[i] * 0.012;
        if (y > 0.7) y = -0.7;
        attr.setY(i, y);
      }
      attr.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, -0.42, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.22, 40]} />
        <meshPhysicalMaterial
          color="#1e1240"
          transmission={0.7}
          roughness={0.15}
          thickness={0.8}
          clearcoat={0.8}
        />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.22, 40]} />
        <meshPhysicalMaterial
          color="#1e1240"
          transmission={0.7}
          roughness={0.15}
          thickness={0.8}
          clearcoat={0.8}
        />
      </mesh>

      {[-0.42, 0.42].map((y, i) => (
        <mesh key={i} position={[0, y + (i === 0 ? 0.112 : -0.112), 0]}>
          <torusGeometry args={[0.38, 0.01, 8, 40]} />
          <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.9} />
        </mesh>
      ))}

      <points ref={streamRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pos, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          color="#c084fc"
          transparent
          opacity={0.75}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      <mesh>
        <cylinderGeometry args={[0.02, 0.02, 0.8, 16]} />
        <meshStandardMaterial color="#6d28d9" emissive="#a855f7" emissiveIntensity={0.5} transparent opacity={0.6} />
      </mesh>

      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial color="#67e8f9" emissive="#22d3ee" emissiveIntensity={0.7} />
      </mesh>
    </group>
  );
}

// ─── PROJECT 3: SMARTFIN — AI Financial Analytics chart bars ──────────────────
function SmartFinVisual() {
  const groupRef = useRef<THREE.Group>(null!);
  const impulse  = usePianoImpulse();

  const bars = useMemo(() => [
    { x: -0.4, h: 0.32, color: "#7c3aed" },
    { x: -0.2, h: 0.48, color: "#a855f7" },
    { x: 0.0,  h: 0.40, color: "#22d3ee" }, // cyan highlight bar
    { x: 0.2,  h: 0.65, color: "#a855f7" },
    { x: 0.4,  h: 0.78, color: "#7c3aed" },
  ], []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const mx = state.pointer.x * 0.35;
    const my = state.pointer.y * 0.35;

    impulse.current = THREE.MathUtils.lerp(impulse.current, 1.0, 0.08);
    groupRef.current.scale.setScalar(impulse.current);
    
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, t * 0.2 + mx, 0.07);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -0.15 + my, 0.07);
    groupRef.current.position.y = Math.sin(t * 1.3) * 0.06;

    bars.forEach((bar, idx) => {
      const mesh = groupRef.current.children[idx] as THREE.Mesh;
      if (mesh) {
        const pulse = 1.0 + Math.sin(t * 2.0 + idx * 1.5) * 0.08;
        mesh.scale.y = pulse;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {bars.map((b, i) => (
        <mesh key={i} position={[b.x, -0.25 + b.h / 2, 0]}>
          <boxGeometry args={[0.08, b.h, 0.08]} />
          <meshStandardMaterial color={b.color} roughness={0.2} metalness={0.1} />
        </mesh>
      ))}

      {/* Grid base plane */}
      <mesh position={[0, -0.27, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.1, 0.5]} />
        <meshStandardMaterial color="#0c0c0f" roughness={0.8} />
      </mesh>

      {/* Grid border line */}
      <mesh position={[0, -0.268, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(1.1, 0.5)]} />
        <lineBasicMaterial color="#a855f7" transparent opacity={0.3} />
      </mesh>

      {/* Floating vector projection node */}
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#ccfbf1" emissive="#22d3ee" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

// ─── PROJECT 4: MEDIVERSAL — Medical cross + orbit ───────────────────────────
function MediversalVisual() {
  const groupRef  = useRef<THREE.Group>(null!);
  const orbitRef  = useRef<THREE.Group>(null!);
  const impulse   = usePianoImpulse();

  const apptCount = 8;
  const apptPositions = useMemo(() => {
    return Array.from({ length: apptCount }, (_, i) => {
      const a = (i / apptCount) * Math.PI * 2;
      return [Math.cos(a) * 0.72, 0, Math.sin(a) * 0.72] as [number,number,number];
    });
  }, []);

  useFrame((state) => {
    const t  = state.clock.getElapsedTime();
    const mx = state.pointer.x * 0.35;
    const my = state.pointer.y * 0.35;

    impulse.current = THREE.MathUtils.lerp(impulse.current, 1.0, 0.08);
    groupRef.current.scale.setScalar(impulse.current);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, t * 0.22 + mx, 0.07);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, Math.sin(t * 0.4) * 0.18 + my, 0.07);
    groupRef.current.position.y = Math.sin(t * 1.1) * 0.07;

    const pulse = 1.0 + Math.sin(t * 1.8) * 0.035;
    groupRef.current.children[0]?.scale?.setScalar(pulse);

    if (orbitRef.current) orbitRef.current.rotation.y = t * 0.65;
  });

  return (
    <group ref={groupRef}>
      <group>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.72, 0.22, 0.14]} />
          <meshPhysicalMaterial color="#f1f5f9" roughness={0.4} clearcoat={0.5} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.22, 0.72, 0.14]} />
          <meshPhysicalMaterial color="#f1f5f9" roughness={0.4} clearcoat={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.07]}>
          <boxGeometry args={[0.68, 0.18, 0.01]} />
          <meshBasicMaterial color="#7c3aed" transparent opacity={0.22} />
        </mesh>
        <mesh position={[0, 0, 0.07]}>
          <boxGeometry args={[0.18, 0.68, 0.01]} />
          <meshBasicMaterial color="#7c3aed" transparent opacity={0.22} />
        </mesh>
      </group>

      <mesh>
        <torusGeometry args={[0.72, 0.018, 8, 56]} />
        <meshStandardMaterial color="#a855f7" emissive="#6d28d9" emissiveIntensity={0.5} />
      </mesh>

      <group ref={orbitRef}>
        {apptPositions.map((pos, i) => (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.048, 12, 12]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? "#22d3ee" : "#a855f7"}
              emissive={i % 3 === 0 ? "#22d3ee" : "#a855f7"}
              emissiveIntensity={0.7}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ─── CANVAS WRAPPER ──────────────────────────────────────────────────────────
export default function ThreeProjectVisualizer({ projectId }: { projectId: string }) {
  return (
    <div className="w-full h-full min-h-[220px] relative select-none">
      <Canvas
        camera={{ position: [0, 0, 2.0], fov: 44 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 3]} intensity={1.4} color="#fff8f0" />
        <directionalLight position={[-2, -1, 2]} intensity={0.4} color="#ddd6fe" />
        <pointLight position={[0, 0, -1.5]} intensity={3.5} distance={4} color="#7c3aed" />

        {projectId === "futuremeet"  && <FutureMeetVisual />}
        {projectId === "nexusdb"     && <NexusDBVisual />}
        {projectId === "smartfin"    && <SmartFinVisual />}
        {projectId === "mediversal"  && <MediversalVisual />}
      </Canvas>
    </div>
  );
}
