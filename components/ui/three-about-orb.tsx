"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ─────────────────────────────────────────────────────────────
   ThreeAboutOrb — Floating Fresnel-shaded tech form for About
   Same rim-light shader as the Hero figure: crimson warm side,
   violet cool side. Idle rotation + subtle breathing scale.
   Mouse position passed as NDC uniforms for parallax tilt.
───────────────────────────────────────────────────────────── */

const vertShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  uniform float uTime;
  uniform float uBreath;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec3 pos = position * (1.0 + uBreath * 0.04);
    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    vViewPosition = -mvPos.xyz;
    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  uniform float uTime;
  uniform float uGlitch;

  void main() {
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = pow(1.0 - max(dot(normalize(vNormal), viewDir), 0.0), 2.8);

    // Crimson warm rim (top-right), violet cool rim (bottom-left)
    vec3 rimWarm = vec3(0.769, 0.094, 0.235); // #C4183C
    vec3 rimCool = vec3(0.486, 0.227, 0.929); // #7C3AED
    vec3 rim = mix(rimCool, rimWarm, vNormal.y * 0.5 + 0.5);

    vec3 base = vec3(0.03, 0.02, 0.05);
    vec3 color = base + rim * fresnel * 2.6;

    // Subtle signal pulse
    float pulse = sin(uTime * 2.0) * 0.5 + 0.5;
    color += rim * pulse * 0.06;

    // Optional glitch RGB shift
    color.r += uGlitch * fresnel * 0.5;
    color.b += uGlitch * fresnel * 0.35;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function OrbMesh({ mouseX, mouseY }: { mouseX: React.MutableRefObject<number>; mouseY: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const breathRef = useRef(0);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uBreath: { value: 0 },
    uGlitch: { value: 0 },
  }), []);

  // Outer ring torus
  const torusUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uBreath: { value: 0 },
    uGlitch: { value: 0 },
  }), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const breath = Math.sin(t * 0.8) * 0.5 + 0.5;

    if (groupRef.current) {
      // Idle slow rotation
      groupRef.current.rotation.y = t * 0.18;
      groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.15;
      // Mouse parallax tilt
      groupRef.current.rotation.y += mouseX.current * 0.4;
      groupRef.current.rotation.x += mouseY.current * 0.2;
      // Breathing float
      groupRef.current.position.y = Math.sin(t * 0.6) * 0.08;
    }

    // Update uniforms
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = t;
      matRef.current.uniforms.uBreath.value = breath;
    }
    torusUniforms.uTime.value = t;
    torusUniforms.uBreath.value = breath;
    uniforms.uTime.value = t;
    uniforms.uBreath.value = breath;
  });

  return (
    <group ref={groupRef}>
      {/* Core icosahedron — the "signal orb" */}
      <mesh>
        <icosahedronGeometry args={[1.1, 2]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={vertShader}
          fragmentShader={fragShader}
          uniforms={uniforms}
        />
      </mesh>

      {/* Inner wireframe ghost */}
      <mesh>
        <icosahedronGeometry args={[1.12, 1]} />
        <meshBasicMaterial
          color={0x7c3aed}
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>

      {/* Outer orbit ring */}
      <mesh rotation={[Math.PI / 3, 0, Math.PI / 5]}>
        <torusGeometry args={[1.7, 0.012, 8, 80]} />
        <shaderMaterial
          vertexShader={vertShader}
          fragmentShader={fragShader}
          uniforms={torusUniforms}
        />
      </mesh>

      {/* Second orbit ring — offset angle */}
      <mesh rotation={[Math.PI / 6, Math.PI / 4, 0]}>
        <torusGeometry args={[1.9, 0.008, 6, 80]} />
        <meshBasicMaterial color={0xc4183c} transparent opacity={0.18} />
      </mesh>

      {/* Floating code "nodes" — small spheres orbiting */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2;
        const r = 1.6;
        return (
          <mesh key={i} position={[Math.cos(angle) * r, Math.sin(angle * 0.7) * 0.4, Math.sin(angle) * r]}>
            <sphereGeometry args={[0.055, 8, 8]} />
            <meshBasicMaterial color={i % 2 === 0 ? 0xc4183c : 0x7c3aed} />
          </mesh>
        );
      })}
    </group>
  );
}

export function ThreeAboutOrb() {
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  return (
    <div
      className="w-full h-full"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.current = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY.current = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.05} />
        <OrbMesh mouseX={mouseX} mouseY={mouseY} />
      </Canvas>
    </div>
  );
}
