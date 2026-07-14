"use client";

import { useRef, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ─── NEBULA BACKGROUND SHADER ───────────────────────────────────────────────
// Deep space purple atmosphere with FBM noise, star field, light shafts
const nebulaMaterial = {
  uniforms: {
    uTime:         { value: 0 },
    uScrollY:      { value: 0 },
    uMouse:        { value: new THREE.Vector2(0.5, 0.5) },
    uRedDimension: { value: 1.0 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform float uTime;
    uniform float uScrollY;
    uniform vec2  uMouse;
    uniform float uRedDimension;
    varying vec2  vUv;

    // ── Noise primitives ──────────────────────────────────────────
    float hash(vec2 p) {
      p = fract(p * vec2(234.34, 435.345));
      p += dot(p, p + 34.23);
      return fract(p.x * p.y);
    }

    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i),             hash(i + vec2(1,0)), u.x),
        mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y);
    }

    // 5-octave FBM for volumetric cloud/fog density
    float fbm(vec2 p) {
      float v = 0.0, a = 0.5;
      mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
      for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p  = rot * p * 2.1 + vec2(1.7, 9.2);
        a *= 0.5;
      }
      return v;
    }

    // ── Star field ────────────────────────────────────────────────
    float starField(vec2 uv, float seed) {
      vec2 gv = fract(uv * 70.0) - 0.5;
      vec2 id = floor(uv * 70.0);
      float n = hash(id + seed);
      if (n < 0.93) return 0.0;
      float twinkle = 0.5 + 0.5 * sin(uTime * (1.5 + n * 4.0) + n * 6.28);
      float d = length(gv);
      return (0.0009 / (d * d + 0.0003)) * twinkle * fract(n * 17.3);
    }

    // ── Volumetric light shaft ────────────────────────────────────
    float lightShaft(vec2 uv, vec2 origin, float angle, float width) {
      vec2 dir = uv - origin;
      vec2 ax  = vec2(cos(angle), sin(angle));
      float proj = dot(dir, ax);
      float perp = abs(dot(dir, vec2(-ax.y, ax.x)));
      if (proj < 0.0) return 0.0;
      return smoothstep(width, 0.0, perp) * (0.6 / (proj + 0.4));
    }

    // ── Shooting Stars ────────────────────────────────────────────
    float shootingStar(vec2 uv, float tVal, float seed) {
      // Periodic timing for shooting star: check if active
      float cycle = fract(tVal * 0.08 + seed);
      if (cycle > 0.12) return 0.0; // only visible in short burst
      
      float progress = cycle / 0.12; // 0.0 to 1.0
      
      // Angle and direction of the shooting star
      vec2 start = vec2(-0.2, 0.9) + vec2(seed * 0.4, -seed * 0.3);
      vec2 dir = vec2(1.4, -0.6);
      vec2 pos = start + dir * progress;
      
      vec2 lineDir = normalize(dir);
      vec2 p = uv - pos;
      float proj = dot(p, lineDir);
      float perp = length(p - proj * lineDir);
      
      // Streak shape: thin line along direction
      float streak = smoothstep(0.006, 0.0, perp);
      
      // Fade along length
      float tail = smoothstep(-0.22, 0.0, proj) * smoothstep(0.02, -0.01, proj);
      
      return streak * tail * (1.0 - progress) * 8.0;
    }

    void main() {
      vec2 uv = vUv;

      // Parallax offset from scroll
      float scrollOff = uScrollY * 0.18;
      vec2 uvP = uv + vec2(0.0, scrollOff);

      // Mouse interactive coordinate in texture space
      vec2 mPos = uMouse;
      vec2 mOff = (mPos - 0.5) * 0.08;

      // ── 1. Base Dark Void (Charcoal-black background) ─────────
      vec3 col = mix(vec3(0.006, 0.004, 0.012), vec3(0.006, 0.001, 0.001), uRedDimension); // dark violet vs dark red void

      // ── 2. Nebula Cloud Layer 1 (Drifting Purple/Red) ──────────
      vec2 nc = uvP * 1.5 + mOff + vec2(uTime * 0.012, uTime * 0.006);
      float n1 = fbm(nc);
      float n2 = fbm(nc * 1.3 - vec2(0.0, uTime * 0.008) + n1 * 0.45);
      float nebula = pow(n1 * n2, 1.5);

      vec3 purpleColor = mix(vec3(0.02, 0.008, 0.05), vec3(0.18, 0.03, 0.32), n1);
      purpleColor = mix(purpleColor, vec3(0.38, 0.08, 0.58), nebula * 0.5);
      
      vec3 redColor = mix(vec3(0.02, 0.001, 0.002), vec3(0.32, 0.006, 0.002), n1);
      redColor = mix(redColor, vec3(0.55, 0.012, 0.004), nebula * 0.5);

      vec3 purpleNebula = mix(purpleColor, redColor, uRedDimension);
      col = mix(col, purpleNebula, clamp(nebula * 1.3, 0.0, 0.85));

      // ── 3. Nebula Cloud Layer 2 (Drifting Violet/Red) ──────────
      vec2 nc2 = uvP * 0.9 - mOff * 0.4 + vec2(-uTime * 0.008, uTime * 0.004);
      float n3 = fbm(nc2);
      float n4 = fbm(nc2 * 1.2 + n3 * 0.35);
      
      vec3 violetColor = mix(vec3(0.01, 0.004, 0.03), vec3(0.10, 0.02, 0.22), n4);
      vec3 redColor2 = mix(vec3(0.01, 0.001, 0.001), vec3(0.18, 0.003, 0.002), n4);
      vec3 violetNebula = mix(violetColor, redColor2, uRedDimension);
      col = mix(col, violetNebula, clamp(pow(n3 * n4, 1.6) * 0.5, 0.0, 0.45));

      // ── 4. Cursor Reactive Spotlight (Interactive Purple/Red) ──
      float mouseDist = length(uv - mPos);
      float mouseGlow = smoothstep(0.48, 0.0, mouseDist);
      
      vec3 cursorNormal = mix(vec3(0.12, 0.02, 0.28), vec3(0.08, 0.01, 0.18), smoothstep(0.18, 0.0, mouseDist));
      vec3 cursorRed = mix(vec3(0.28, 0.01, 0.01), vec3(0.38, 0.06, 0.002), smoothstep(0.18, 0.0, mouseDist));
      vec3 cursorLight = mix(cursorNormal, cursorRed, uRedDimension);
      col += cursorLight * mouseGlow * 0.26;

      // ── 5. Volumetric Highlight Clouds (Accent/Red) ────────
      float accentDensity = fbm(uvP * 2.2 + vec2(uTime * 0.005, -uTime * 0.008));
      vec3 violetAccentVal = vec3(0.12, 0.03, 0.24);
      vec3 crimsonAccentVal = vec3(0.24, 0.02, 0.04);
      vec3 highlightAccent = mix(violetAccentVal, crimsonAccentVal, uRedDimension) * smoothstep(0.68, 0.85, accentDensity);
      col += highlightAccent * 0.45;

      // ── 6. Stars Field ──────────────────────────────────────────
      vec2 uvStar = uv + vec2(0.0, scrollOff * 0.25);
      col += vec3(0.85, 0.78, 0.95) * starField(uvStar, 0.0);
      col += vec3(0.70, 0.88, 0.95) * starField(uvStar * 1.4 + 0.4, 3.1) * 0.65;

      // ── 7. Shooting Stars ───────────────────────────────────────
      float shoot = shootingStar(uv, uTime, 1.25);
      shoot += shootingStar(uv, uTime + 4.2, 5.72);
      col += vec3(0.75, 0.85, 1.0) * shoot;

      // ── 8. Volumetric Light Shafts (Deep Violet/Red) ───────────
      float shaftIntensity = 0.0;
      float baseAngle = -1.5708; // facing down
      for (int i = 0; i < 3; i++) {
        float a = baseAngle + float(i - 1) * 0.20 + sin(uTime * 0.05 + float(i)) * 0.05;
        shaftIntensity += lightShaft(uv, vec2(0.5 + mOff.x, -0.05), a, 0.05) * (0.35 + float(i) * 0.08);
      }
      vec3 shaftColor = mix(vec3(0.24, 0.05, 0.42), vec3(0.48, 0.015, 0.002), uRedDimension);
      col += shaftColor * shaftIntensity * 0.22;

      // ── 9. Grain / Film Noise (Organic feel) ───────────────────
      float grain = (hash(uv * 382.4 + uTime * 0.06) - 0.5) * 0.015;
      col += grain;

      // ── 10. Vignette ───────────────────────────────────────────
      float vig = uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);
      vig = pow(16.0 * vig, 0.35);
      col *= vig;

      gl_FragColor = vec4(max(col, vec3(0.0)), 1.0);
    }
  `,
};

// ─── FULLSCREEN NEBULA QUAD ──────────────────────────────────────────────────
function NebulaBg({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  const matRef  = useRef<THREE.ShaderMaterial>(null!);
  const quadRef = useRef<THREE.Mesh>(null!);
  const uniforms = useMemo(() => THREE.UniformsUtils.clone(nebulaMaterial.uniforms), []);

  const [isRedDimension, setIsRedDimension] = useState(false);
  useEffect(() => {
    const h = (e: Event) => setIsRedDimension((e as CustomEvent).detail);
    window.addEventListener("dimensionShiftState", h);
    return () => window.removeEventListener("dimensionShiftState", h);
  }, []);

  useFrame((state) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value    = state.clock.getElapsedTime();
    matRef.current.uniforms.uScrollY.value = scrollRef.current * 0.00045;

    // Lerp red dimension morph factor smoothly (default 1.0 = red, shifted 0.0 = purple)
    const targetRed = isRedDimension ? 1.0 : 0.0;
    matRef.current.uniforms.uRedDimension.value = THREE.MathUtils.lerp(
      matRef.current.uniforms.uRedDimension.value,
      targetRed,
      0.045
    );
    
    const target = new THREE.Vector2(
      (state.pointer.x + 1) * 0.5,
      (state.pointer.y + 1) * 0.5,
    );
    matRef.current.uniforms.uMouse.value.lerp(target, 0.035);

    // Dynamic Camera Fly-through Parallax: Shift camera down based on page scroll
    const centerY = -scrollRef.current * 0.0018;
    state.camera.position.y = centerY;
    
    // Pin background quad mesh to camera Y
    if (quadRef.current) {
      quadRef.current.position.y = centerY;
    }
  });

  return (
    <mesh ref={quadRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={nebulaMaterial.vertexShader}
        fragmentShader={nebulaMaterial.fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── LAYERED PARALLAX PARTICLES (3 depths) ──────────────────────────────────
function ParallaxParticles({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  // Layer configuration: [count, z, speed, size, color]
  const layers = useMemo<Array<{
    count: number; z: number; scrollFactor: number;
    size: number; colors: THREE.Color[];
  }>>(() => [
    {
      count: 120, z: -1.5, scrollFactor: 0.0012, size: 0.035,
      colors: [new THREE.Color("#7C3AED"), new THREE.Color("#C4183C"), new THREE.Color("#800c22")], // Violet, Crimson, Dark Crimson accent
    },
    {
      count: 80,  z: -2.5, scrollFactor: 0.0006, size: 0.025,
      colors: [new THREE.Color("#7C3AED"), new THREE.Color("#5B21B6")], // Muted Purples
    },
    {
      count: 50,  z: -4.0, scrollFactor: 0.0002, size: 0.02,
      colors: [new THREE.Color("#4C1D95"), new THREE.Color("#120D1E")], // Deep dark violet
    },
  ], []);

  const layerData = useMemo(() => layers.map((layer) => {
    const pos  = new Float32Array(layer.count * 3);
    const initY = new Float32Array(layer.count);
    const cols  = new Float32Array(layer.count * 3);

    for (let i = 0; i < layer.count; i++) {
      const x = (Math.random() - 0.5) * 14;
      const y = (Math.random() - 0.5) * 16;
      const z = layer.z + (Math.random() - 0.5) * 0.5;
      pos[i*3]   = x;
      pos[i*3+1] = y;
      pos[i*3+2] = z;
      initY[i] = y;

      const c = layer.colors[Math.floor(Math.random() * layer.colors.length)];
      cols[i*3]   = c.r;
      cols[i*3+1] = c.g;
      cols[i*3+2] = c.b;
    }
    return { pos, initY, cols, count: layer.count };
  }), [layers]);

  const pointRefs = [
    useRef<THREE.Points>(null!),
    useRef<THREE.Points>(null!),
    useRef<THREE.Points>(null!),
  ];

  const [isRedDimension, setIsRedDimension] = useState(false);
  useEffect(() => {
    const h = (e: Event) => setIsRedDimension((e as CustomEvent).detail);
    window.addEventListener("dimensionShiftState", h);
    return () => window.removeEventListener("dimensionShiftState", h);
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const centerY = state.camera.position.y;
    const mx = state.pointer.x * 4.5;
    const my = state.pointer.y * 4.5 + centerY;
    const L = THREE.MathUtils.lerp;

    layers.forEach((layer, li) => {
      const pts  = pointRefs[li].current;
      if (!pts) return;
      const { pos, initY, count } = layerData[li];
      const attr = pts.geometry.attributes.position;
      const colorAttr = pts.geometry.attributes.color;

      // Slow global drift rotation
      pts.rotation.y = t * (0.006 + li * 0.002);

      for (let i = 0; i < count; i++) {
        let x = pos[i*3];
        let y = initY[i];

        // Gentle drift turbulence
        const drift = t * 0.25 + i * 0.11;
        x += Math.sin(drift) * 0.12;

        // Wrap particle Y coordinates around camera Y to keep particles floating infinitely
        const boxH = 16.0;
        y = ((y - centerY + boxH / 2) % boxH + boxH) % boxH - boxH / 2 + centerY;

        let z = pos[i*3+2];
        z += Math.cos(drift * 0.7) * 0.12;

        // Mouse repulsion (stronger for near layer)
        const repScale = 3.0 - li * 0.8;
        const dx = mx - x, dy = my - y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < repScale) {
          const f = (repScale - dist) * 0.1;
          x -= (dx / dist) * f;
          y -= (dy / dist) * f;
        }

        attr.setXYZ(i, x, y, z);

        // Smoothly morph color attribute on dimension shift (Violet/Purple/Cyan to Crimson/Orange)
        const baseR = layerData[li].cols[i*3];
        const baseG = layerData[li].cols[i*3+1];
        const baseB = layerData[li].cols[i*3+2];

        // Stranger Things red spores / crimson particles
        const targetR = 0.85 + Math.random() * 0.15;
        const targetG = 0.12 + Math.random() * 0.1;
        const targetB = 0.02;

        const currentR = colorAttr.getX(i);
        const currentG = colorAttr.getY(i);
        const currentB = colorAttr.getZ(i);

        colorAttr.setXYZ(
          i,
          L(currentR, isRedDimension ? targetR : baseR, 0.06),
          L(currentG, isRedDimension ? targetG : baseG, 0.06),
          L(currentB, isRedDimension ? targetB : baseB, 0.06)
        );
      }
      attr.needsUpdate = true;
      colorAttr.needsUpdate = true;
    });
  });

  return (
    <>
      {layers.map((layer, li) => (
        <points key={li} ref={pointRefs[li]}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[layerData[li].pos, 3]} />
            <bufferAttribute attach="attributes-color"    args={[layerData[li].cols, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={layer.size}
            vertexColors
            transparent
            opacity={0.65 - li * 0.12}
            sizeAttenuation
            depthWrite={false}
          />
        </points>
      ))}
    </>
  );
}

// ─── DRIFTING NEBULA ORBS (mid-ground) ──────────────────────────────────────
function NebulaOrbs({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  type OrbRef = React.MutableRefObject<THREE.Mesh>;
  const orbs: OrbRef[] = [useRef<THREE.Mesh>(null!), useRef<THREE.Mesh>(null!), useRef<THREE.Mesh>(null!)];

  const orbConfig = [
    { base: [-3.2,  2.2, -4.5], color: "#7C3AED", emit: "#4c1d95", r: 1.8, redColor: "#C4183C", redEmit: "#800c22" },
    { base: [ 3.6, -1.4, -5.0], color: "#C4183C", emit: "#800c22", r: 2.2, redColor: "#7C3AED", redEmit: "#4c1d95" },
    { base: [-1.4, -4.8, -5.5], color: "#7C3AED", emit: "#4c1d95", r: 1.5, redColor: "#C4183C", redEmit: "#800c22" },
  ];

  const [isRedDimension, setIsRedDimension] = useState(false);
  useEffect(() => {
    const h = (e: Event) => setIsRedDimension((e as CustomEvent).detail);
    window.addEventListener("dimensionShiftState", h);
    return () => window.removeEventListener("dimensionShiftState", h);
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const centerY = state.camera.position.y;

    orbConfig.forEach((cfg, i) => {
      const ref = orbs[i].current;
      if (!ref) return;
      ref.position.x = cfg.base[0] + Math.sin(t * (0.14 + i * 0.05)) * 0.7;
      
      // Floating offset relative to camera Y so the midground orbs scroll together
      ref.position.y = cfg.base[1] + Math.cos(t * (0.18 + i * 0.04)) * 0.5 + centerY;
      
      const pulse = 1.0 + Math.sin(t * 0.4 + i * 2.1) * 0.04;
      ref.scale.setScalar(pulse);

      // Smoothly transition orb materials colors
      if (ref.material && !(ref.material instanceof Array)) {
        const mat = ref.material as THREE.MeshStandardMaterial;
        const targetColor = new THREE.Color(isRedDimension ? cfg.redColor : cfg.color);
        const targetEmit = new THREE.Color(isRedDimension ? cfg.redEmit : cfg.emit);
        mat.color.lerp(targetColor, 0.045);
        mat.emissive.lerp(targetEmit, 0.045);
      }
    });
  });

  return (
    <>
      {orbConfig.map((cfg, i) => (
        <mesh key={i} ref={orbs[i]} position={cfg.base as [number,number,number]}>
          <sphereGeometry args={[cfg.r, 24, 24]} />
          <meshStandardMaterial
            color={cfg.color}
            emissive={cfg.emit}
            emissiveIntensity={0.08}
            transparent
            opacity={0.06}
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  );
}

// ─── EXPORT ──────────────────────────────────────────────────────────────────
export default function ThreeGlobalBg() {
  const scrollY = useRef(0);

  useEffect(() => {
    const handler = () => { scrollY.current = window.scrollY; };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div
      className="fixed inset-0 -z-50 w-screen h-screen overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false, depth: false, stencil: false }}
      >
        {/* Fullscreen nebula shader quad — always at back */}
        <NebulaBg scrollRef={scrollY} />

        {/* Three parallax particle depths */}
        <ParallaxParticles scrollRef={scrollY} />

        {/* Large drifting translucent nebula orbs */}
        <NebulaOrbs scrollRef={scrollY} />
      </Canvas>
    </div>
  );
}
