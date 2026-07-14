"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ─────────────────────────────────────────────────────────────
   ThreeAchievementCrystal
   A slow-spinning octahedron "data crystal" with the same
   Fresnel rim shader. Represents verified data / achievement.
   Floating rings + pulsing inner glow sphere.
───────────────────────────────────────────────────────────── */

const vertShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  uniform float uTime;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPos.xyz;
    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  uniform float uTime;
  uniform vec3  uColorA;
  uniform vec3  uColorB;

  void main() {
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = pow(1.0 - max(dot(normalize(vNormal), viewDir), 0.0), 2.6);

    vec3 rim = mix(uColorB, uColorA, vNormal.y * 0.5 + 0.5);
    vec3 base = vec3(0.025, 0.015, 0.04);
    float pulse = sin(uTime * 1.8) * 0.5 + 0.5;
    vec3 color = base + rim * fresnel * (2.4 + pulse * 0.5);

    gl_FragColor = vec4(color, 1.0);
  }
`;

function CrystalMesh() {
  const groupRef = useRef<THREE.Group>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColorA: { value: new THREE.Color(0xc4183c) }, // crimson warm
    uColorB: { value: new THREE.Color(0x7c3aed) }, // violet cool
  }), []);

  const ringUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColorA: { value: new THREE.Color(0x7c3aed) },
    uColorB: { value: new THREE.Color(0xc4183c) },
  }), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    uniforms.uTime.value = t;
    ringUniforms.uTime.value = t;

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.22;
      groupRef.current.rotation.z = Math.sin(t * 0.4) * 0.12;
      groupRef.current.position.y = Math.sin(t * 0.7) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Core octahedron */}
      <mesh>
        <octahedronGeometry args={[1.0, 2]} />
        <shaderMaterial
          vertexShader={vertShader}
          fragmentShader={fragShader}
          uniforms={uniforms}
        />
      </mesh>

      {/* Inner ghost wireframe */}
      <mesh scale={[1.04, 1.04, 1.04]}>
        <octahedronGeometry args={[1.0, 0]} />
        <meshBasicMaterial color={0xc4183c} wireframe transparent opacity={0.12} />
      </mesh>

      {/* Floating equatorial ring */}
      <mesh>
        <torusGeometry args={[1.5, 0.015, 8, 90]} />
        <shaderMaterial
          vertexShader={vertShader}
          fragmentShader={fragShader}
          uniforms={ringUniforms}
        />
      </mesh>

      {/* Tilted second ring */}
      <mesh rotation={[Math.PI / 3, 0, Math.PI / 6]}>
        <torusGeometry args={[1.75, 0.009, 6, 80]} />
        <meshBasicMaterial color={0x7c3aed} transparent opacity={0.22} />
      </mesh>

      {/* Inner pulse glow sphere */}
      <mesh>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial color={0xc4183c} transparent opacity={0.4} />
      </mesh>

      {/* Orbit nodes */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2;
        const r = 1.45;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * r, Math.sin(i * 0.8) * 0.3, Math.sin(angle) * r]}
          >
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color={i % 2 === 0 ? 0xc4183c : 0x7c3aed} />
          </mesh>
        );
      })}
    </group>
  );
}

export function ThreeAchievementCrystal() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 36 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent", width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.04} />
      <CrystalMesh />
    </Canvas>
  );
}
