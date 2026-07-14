"use client";

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * Stranger-Things-inspired interactive scroll-driven cinematic hero section.
 *
 * Merges scroll-driven progression, manual sticky viewports, and custom shader transitions
 * with rich user interactions:
 *  - camera parallax and cursor-drag look-around with inertia
 *  - proximity/glitch RGB splits & vertex jittering
 *  - foreground spores parting away from cursor in screen space
 *  - shockwave rings expanding through the spore field on click
 *  - auto-signal loss glitches after inactivity
 *  - background nebula particle layer for deep scroll parallax
 *  - custom trailing cursor dot that scales/glows with the glitch state
 *  - glitch-text RGB channel shift hover effects on CTAs
 */

const ROLE_TEXT = 'Aspiring Software Engineer · Full Stack Developer';
const TAGS = ['Java', 'C++', 'React/Next.js', 'Node.js', 'MongoDB'];

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  
  // Refs for narrative panels & overlays
  const scene1Ref = useRef<HTMLDivElement>(null);
  const scene2Ref = useRef<HTMLDivElement>(null);
  const scene3Ref = useRef<HTMLDivElement>(null);
  const scene4Ref = useRef<HTMLDivElement>(null);
  const glitchRef = useRef<HTMLDivElement>(null);

  const [typedRole, setTypedRole] = useState('');

  // Typing effect for Scene 1
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTypedRole(ROLE_TEXT.slice(0, i));
      if (i >= ROLE_TEXT.length) clearInterval(id);
    }, 45);
    return () => clearInterval(id);
  }, []);

  // Load Google Fonts once
  useEffect(() => {
    const id = 'hero-fonts-link';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  // Three.js scene lifecycle
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const mount = mountRef.current;
    const cursorDot = cursorDotRef.current;
    if (!canvas || !mount || !container) return;

    let width = mount.clientWidth;
    let height = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0812, 0.045);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 9);

    // ---------- Transition Shader Material ----------
    const rimVert = `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      uniform float jitter;
      uniform float time;
      void main(){
        vNormal = normalize(normalMatrix * normal);
        vec3 pos = position;
        pos += normal * sin(time*40.0 + position.y*10.0) * jitter * 0.025;
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `;
    const rimFrag = `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      uniform vec3 colorA;
      uniform vec3 colorB;
      uniform vec3 rimA;
      uniform vec3 rimB;
      uniform float flicker;
      uniform float progress;
      uniform float glitch;

      void main(){
        vec3 viewDir = normalize(vViewPosition);
        float fresnel = pow(1.0 - max(dot(normalize(vNormal), viewDir), 0.0), 2.6);
        
        // 1. Normal world coloring: diffuse blue/cyan lighting
        vec3 normalRim = mix(colorB, colorA, vNormal.y * 0.5 + 0.5);
        float diffuseWeight = 1.0 - progress * 0.95;
        float diffuse = max(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 0.0);
        vec3 normalDiffuse = normalRim * (diffuse * 0.7 + 0.3) * diffuseWeight;
        
        // 2. Upside Down coloring: crimson/purple rim glow
        vec3 udRim = mix(rimB, rimA, vNormal.y * 0.5 + 0.5);
        vec3 base = vec3(0.01, 0.009, 0.014);
        
        // Blend based on scroll progress
        vec3 normalColor = normalDiffuse + normalRim * fresnel * 0.6;
        vec3 udColor = base + udRim * fresnel * 2.8 * flicker;
        
        vec3 finalColor = mix(normalColor, udColor, progress);
        
        // RGB split when glitching (mouse proximity or signals loss)
        finalColor.r += glitch * fresnel * 0.95;
        finalColor.b += glitch * fresnel * 0.65;
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const mat = new THREE.ShaderMaterial({
      vertexShader: rimVert,
      fragmentShader: rimFrag,
      uniforms: {
        colorA: { value: new THREE.Color(0x22d3ee) },
        colorB: { value: new THREE.Color(0x0ea5e9) },
        rimA: { value: new THREE.Color(0xc4183c) },
        rimB: { value: new THREE.Color(0x7c3aed) },
        flicker: { value: 1.0 },
        progress: { value: 0.0 },
        glitch: { value: 0.0 },
        jitter: { value: 0.0 },
        time: { value: 0.0 },
      },
    });

    // ---------- Stylized figure ----------
    const figure = new THREE.Group();

    // 1. Head Group (supports looking at cursor)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.45, 0);

    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.38, 32, 32), mat);
    headGroup.add(skull);

    // Glowing Visor
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.08, 0.35), mat);
    visor.position.set(0, 0.05, 0.24);
    headGroup.add(visor);

    // Neck Connector (Bridges the gap between head and torso)
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.22, 12), mat);
    neck.position.set(0, -0.28, 0);
    headGroup.add(neck);

    // Wireframe neck skin overlay
    const neckWire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.125, 0.145, 0.23, 8, 2, true),
      new THREE.MeshBasicMaterial({
        color: 0x7c3aed,
        wireframe: true,
        transparent: true,
        opacity: 0.15
      })
    );
    neckWire.position.copy(neck.position);
    headGroup.add(neckWire);

    // Wireframe skull skin overlay
    const skullWire = new THREE.Mesh(
      new THREE.SphereGeometry(0.385, 12, 12),
      new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        wireframe: true,
        transparent: true,
        opacity: 0.12
      })
    );
    headGroup.add(skullWire);
    figure.add(headGroup);

    // 2. Segmented Torso Group
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 0.45, 0);

    const ring1 = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.52, 0.25, 16), mat);
    ring1.position.set(0, 0.35, 0);
    torsoGroup.add(ring1);

    const torsoWire1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.485, 0.525, 0.26, 8, 2, true),
      new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        wireframe: true,
        transparent: true,
        opacity: 0.15
      })
    );
    torsoWire1.position.copy(ring1.position);
    torsoGroup.add(torsoWire1);

    const ring2 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.22, 16), mat);
    ring2.position.set(0, 0, 0);
    torsoGroup.add(ring2);

    const ring3 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.45, 0.25, 16), mat);
    ring3.position.set(0, -0.35, 0);
    torsoGroup.add(ring3);

    const torsoWire3 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.505, 0.455, 0.26, 8, 2, true),
      new THREE.MeshBasicMaterial({
        color: 0x7c3aed,
        wireframe: true,
        transparent: true,
        opacity: 0.15
      })
    );
    torsoWire3.position.copy(ring3.position);
    torsoGroup.add(torsoWire3);

    // Pulsing core inside torso
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xc4183c,
      transparent: true,
      opacity: 0.95
    });
    const energyCore = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 16, 16),
      coreMat
    );
    energyCore.position.set(0, 0, 0.12);
    torsoGroup.add(energyCore);
    figure.add(torsoGroup);

    // 3. Gyroscopic Stabilizer Rings (surround the chest core)
    const gyroGroup = new THREE.Group();
    gyroGroup.position.set(0, 0.45, 0);

    const gyroRing1 = new THREE.Mesh(
      new THREE.TorusGeometry(0.72, 0.015, 8, 48),
      new THREE.MeshBasicMaterial({
        color: 0x7c3aed,
        transparent: true,
        opacity: 0.45
      })
    );
    gyroRing1.rotation.x = Math.PI / 2;
    gyroGroup.add(gyroRing1);

    const gyroRing2 = new THREE.Mesh(
      new THREE.TorusGeometry(0.85, 0.015, 8, 48),
      new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        transparent: true,
        opacity: 0.45
      })
    );
    gyroRing2.rotation.y = Math.PI / 3;
    gyroGroup.add(gyroRing2);
    figure.add(gyroGroup);

    // 4. Floating shoulders & arms
    const armParts: THREE.Object3D[] = [];
    function buildFloatingArm(sign: number) {
      const armGroup = new THREE.Group();
      armGroup.position.set(sign * 0.72, 0.8, 0);

      const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), mat);
      shoulder.scale.set(1, 0.75, 1);
      armGroup.add(shoulder);

      const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.52, 12), mat);
      forearm.position.set(0, -0.42, 0);
      armGroup.add(forearm);

      const handConnector = new THREE.Mesh(
        new THREE.TorusGeometry(0.095, 0.015, 6, 16),
        mat
      );
      handConnector.position.set(0, -0.75, 0);
      handConnector.rotation.x = Math.PI / 2;
      armGroup.add(handConnector);

      figure.add(armGroup);
      armParts.push(armGroup);
    }
    buildFloatingArm(1);
    buildFloatingArm(-1);

    // 5. Floating legs & feet
    const legParts: THREE.Object3D[] = [];
    function buildFloatingLeg(sign: number) {
      const legGroup = new THREE.Group();
      legGroup.position.set(sign * 0.28, -0.1, 0);

      const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.12, 0.65, 12), mat);
      legGroup.add(thigh);

      const calf = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.1, 0.6, 12), mat);
      calf.position.set(0, -0.75, 0);
      legGroup.add(calf);

      const footConnector = new THREE.Mesh(
        new THREE.TorusGeometry(0.11, 0.016, 6, 16),
        mat
      );
      footConnector.position.set(0, -1.15, 0.04);
      footConnector.rotation.x = Math.PI / 2;
      legGroup.add(footConnector);

      figure.add(legGroup);
      legParts.push(legGroup);
    }
    buildFloatingLeg(1);
    buildFloatingLeg(-1);

    // 6. Orbital Satellites
    const satellites: THREE.Mesh[] = [];
    const satCount = 4;
    const satGeo = new THREE.DodecahedronGeometry(0.08, 0);
    const satMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      wireframe: true
    });
    for (let i = 0; i < satCount; i++) {
      const sat = new THREE.Mesh(satGeo, satMat);
      figure.add(sat);
      satellites.push(sat);
    }

    figure.position.set(2.1, -0.4, 0);
    figure.scale.setScalar(1.35);
    scene.add(figure);

    // ---------- Spore Sprite Canvas Texture ----------
    function makeSpriteTexture() {
      const size = 64;
      const c = document.createElement('canvas');
      c.width = c.height = size;
      const ctx = c.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        grad.addColorStop(0, 'rgba(255,255,255,1)');
        grad.addColorStop(0.4, 'rgba(255,255,255,0.5)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);
      }
      return new THREE.CanvasTexture(c);
    }
    const spriteTex = makeSpriteTexture();

    // ---------- Background Nebula Particle Layer ----------
    const NEBULA_COUNT = 40;
    const nebulaPos = new Float32Array(NEBULA_COUNT * 3);
    const nebulaColors = new Float32Array(NEBULA_COUNT * 3);
    const colorCrimson = new THREE.Color(0xc4183c);
    const colorViolet = new THREE.Color(0x7c3aed);
    const colorDeep = new THREE.Color(0x241a3d);
    
    for (let i = 0; i < NEBULA_COUNT; i++) {
      const i3 = i * 3;
      nebulaPos[i3] = (Math.random() - 0.5) * 24;
      nebulaPos[i3 + 1] = (Math.random() - 0.5) * 12;
      nebulaPos[i3 + 2] = -6 - Math.random() * 10;
      
      const c = colorDeep.clone().lerp(Math.random() > 0.5 ? colorCrimson : colorViolet, 0.35);
      nebulaColors[i3] = c.r;
      nebulaColors[i3 + 1] = c.g;
      nebulaColors[i3 + 2] = c.b;
    }
    const nebulaGeo = new THREE.BufferGeometry();
    nebulaGeo.setAttribute('position', new THREE.BufferAttribute(nebulaPos, 3));
    nebulaGeo.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));
    const nebulaMat = new THREE.PointsMaterial({
      size: 3.2,
      map: spriteTex,
      transparent: true,
      opacity: 0.16,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const nebula = new THREE.Points(nebulaGeo, nebulaMat);
    scene.add(nebula);

    // ---------- Foreground Spore Particles ----------
    const PARTICLE_COUNT = 500;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const basePositions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const speeds = new Float32Array(PARTICLE_COUNT);
    const randomFactors = new Float32Array(PARTICLE_COUNT);

    const colorCyan = new THREE.Color(0x22d3ee);
    const colorBlue = new THREE.Color(0x0ea5e9);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const x = (Math.random() - 0.5) * 14;
      const y = (Math.random() - 0.5) * 8;
      const z = (Math.random() - 0.5) * 10;
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
      basePositions[i3] = x;
      basePositions[i3 + 1] = y;
      basePositions[i3 + 2] = z;

      const rf = Math.random();
      randomFactors[i] = rf;

      const c = colorBlue.clone().lerp(colorCyan, rf);
      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;

      speeds[i] = 0.15 + Math.random() * 0.35;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.09,
      map: spriteTex,
      transparent: true,
      opacity: 0.6,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ---------- Ground Fog Plane ----------
    const fogPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 6),
      new THREE.MeshBasicMaterial({ color: 0x4c3a66, transparent: true, opacity: 0.12, depthWrite: false })
    );
    fogPlane.position.set(0, -2.6, -1);
    fogPlane.rotation.x = (-Math.PI / 2) * 0.15;
    scene.add(fogPlane);

    // ---------- Interaction & Scroll States ----------
    const ndcMouse = new THREE.Vector2(2, 2);
    let mouseX = 0;
    let mouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0;
    let proximity = 0; // mouse screen-space proximity to the figure
    let lastInputTime = performance.now();
    let shockwaves: { start: number }[] = [];

    function onPointerMove(e: PointerEvent) {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = (e.clientY / window.innerHeight) * 2 - 1;
      ndcMouse.set(mouseX, -mouseY);
      lastInputTime = performance.now();
      
      // Update trailing cursor dot custom variables
      if (cursorDot) {
        cursorDot.style.setProperty('--x', `${e.clientX}px`);
        cursorDot.style.setProperty('--y', `${e.clientY}px`);
      }
    }
    window.addEventListener('pointermove', onPointerMove);

    function onPointerDown() {
      shockwaves.push({ start: performance.now() });
      lastInputTime = performance.now();
    }
    window.addEventListener('pointerdown', onPointerDown);

    function onAvatarShockwave() {
      shockwaves.push({ start: performance.now() });
      shockwaves.push({ start: performance.now() - 150 });
      lastInputTime = performance.now();
      burstFrames = 30;
    }
    window.addEventListener('avatarShockwave', onAvatarShockwave);

    function onResize() {
      if (!mount) return;
      width = mount.clientWidth;
      height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener('resize', onResize);

    // IntersectionObserver to suspend animation frames when scrolled offscreen
    let inView = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
      },
      { threshold: 0.01 }
    );
    observer.observe(container);

    // Smoothstep helper
    function smoothstep(edge0: number, edge1: number, x: number) {
      const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
      return t * t * (3.0 - 2.0 * t);
    }

    let flickerTimer = 0;
    let nextFlicker = 3 + Math.random() * 4;
    let flickerTimeoutId: any = null;
    let lastBoundaryIndex = -1;
    let burstFrames = 0;

    const clock = new THREE.Clock();
    let rafId: any = null;
    const figureScreenPos = new THREE.Vector3();

    function animate() {
      if (!container) return;
      if (!inView) {
        rafId = requestAnimationFrame(animate);
        return;
      }

      const t = clock.getElapsedTime();
      const dt = Math.min(clock.getDelta(), 0.05);
      mat.uniforms.time.value = t;

      const idleMs = performance.now() - lastInputTime;
      const idleGlitch = idleMs > 3500 ? Math.min(1, (idleMs - 3500) / 800) : 0;

      // ---------- Scroll Progress Estimation ----------
      const rect = container.getBoundingClientRect();
      const totalScrollable = container.clientHeight - window.innerHeight;
      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));

      // ---------- Manual Sticky Viewer Simulation ----------
      const viewer = mountRef.current;
      if (viewer) {
        if (progress <= 0) {
          viewer.style.position = 'absolute';
          viewer.style.top = '0';
          viewer.style.bottom = 'auto';
        } else if (progress >= 1) {
          viewer.style.position = 'absolute';
          viewer.style.top = 'auto';
          viewer.style.bottom = '0';
        } else {
          viewer.style.position = 'fixed';
          viewer.style.top = '0';
          viewer.style.bottom = 'auto';
        }
      }

      // Update shader scroll progress uniform
      mat.uniforms.progress.value = progress;

      // ---------- Proximity Detection (Cursor to Figure) ----------
      figureScreenPos.set(figure.position.x, figure.position.y + 1.2, figure.position.z);
      figureScreenPos.project(camera);
      const dx = ndcMouse.x - figureScreenPos.x;
      const dy = ndcMouse.y - figureScreenPos.y;
      const mouseDist = Math.sqrt(dx * dx + dy * dy);
      const targetProximity = Math.max(0, 1 - mouseDist / 0.55);
      proximity += (targetProximity - proximity) * 0.08;

      // ---------- Glitch Uniform Updates ----------
      const isBoundaryCrossing = burstFrames > 0;
      if (isBoundaryCrossing) {
        burstFrames--;
      }
      
      const glitchBase = Math.min(1, proximity * 1.3 + idleGlitch + progress * 0.4 + (isBoundaryCrossing ? 0.8 : 0));
      mat.uniforms.glitch.value = glitchBase * (0.4 + 0.6 * Math.abs(Math.sin(t * 30)));
      mat.uniforms.jitter.value = glitchBase;
      mat.uniforms.flicker.value = 1.0 - glitchBase * 0.35 * Math.abs(Math.sin(t * 50));

      // ---------- Trailing Cursor Glow Scale Properties ----------
      if (cursorDot) {
        const scale = 1 + glitchBase * 1.8;
        cursorDot.style.setProperty('--scale', scale.toFixed(2));
        cursorDot.style.setProperty('--glow', (0.4 + glitchBase * 0.6).toFixed(2));
      }

      // ---------- Visual Transitions (Fog & Opacity) ----------
      const fogColorNormal = new THREE.Color(0x0a0812);
      const fogColorUD = new THREE.Color(0x070104);
      const currentFogColor = fogColorNormal.clone().lerp(fogColorUD, progress);
      if (scene.fog) {
        scene.fog.color.copy(currentFogColor);
        (scene.fog as THREE.FogExp2).density = 0.045 + progress * 0.05;
      }

      (fogPlane.material as THREE.MeshBasicMaterial).opacity = 0.12 + progress * 0.28;
      (fogPlane.material as THREE.MeshBasicMaterial).color.copy(currentFogColor);

      // Rotate deep background nebula slowly
      nebula.rotation.y = t * 0.005;

      // ---------- Particle System Behavior (Repulsion & Shockwaves) ----------
      pMat.opacity = 0.6 + progress * 0.3;
      pMat.size = 0.09 + progress * 0.07;

      const colAttr = pGeo.attributes.color as any;
      const posAttr = pGeo.attributes.position as any;
      const now = performance.now();

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        const rf = randomFactors[i];
        const speedMult = 0.3 + progress * 0.9;

        let px = basePositions[i3] + Math.sin(t * 0.3 + i) * 0.15;
        let py = ((basePositions[i3 + 1] + t * speeds[i] * speedMult + 4.2) % 8.4) - 4.2;
        let pz = basePositions[i3 + 2];

        // Screen space cursor repulsion
        const rdx = px - mouseX * 7;
        const rdy = py - -mouseY * 4;
        const rd = Math.sqrt(rdx * rdx + rdy * rdy);
        if (rd < 2.2) {
          const force = (1 - rd / 2.2) * 0.65;
          px += (rdx / (rd || 1)) * force;
          py += (rdy / (rd || 1)) * force;
        }

        // Shockwaves
        for (let s = 0; s < shockwaves.length; s++) {
          const age = (now - shockwaves[s].start) / 1000;
          const ringR = age * 6;
          const d2 = Math.sqrt(px * px + py * py + pz * pz);
          const band = Math.abs(d2 - ringR);
          if (band < 0.6 && age < 1.2) {
            const push = (1 - band / 0.6) * (1 - age / 1.2) * 1.5;
            const n = d2 || 1;
            px += (px / n) * push;
            py += (py / n) * push;
            pz += (pz / n) * push;
          }
        }

        posAttr.array[i3] = px;
        posAttr.array[i3 + 1] = py;
        posAttr.array[i3 + 2] = pz;

        // Particle colors shift
        const normalCol = colorBlue.clone().lerp(colorCyan, rf);
        const udCol = colorCrimson.clone().lerp(colorViolet, rf);
        const finalCol = normalCol.lerp(udCol, progress);
        colAttr.array[i3] = finalCol.r;
        colAttr.array[i3 + 1] = finalCol.g;
        colAttr.array[i3 + 2] = finalCol.b;
      }
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
      particles.rotation.y = t * 0.02;

      shockwaves = shockwaves.filter((s) => now - s.start < 1200);

      // ---------- Figure Breathing & Parallax Rotation ----------
      figure.position.y = -0.4 + Math.sin(t * 0.9) * 0.05;
      const rotationLock = 1.0 - smoothstep(0.75, 1.0, progress);
      
      // Interactive mouse camera drag targets
      targetRotY += (mouseX * 0.6 - targetRotY) * 0.04;
      targetRotX += (mouseY * 0.3 - targetRotX) * 0.04;

      figure.rotation.y = Math.sin(t * 0.25) * 0.08 * rotationLock + targetRotY * 0.2 * rotationLock;

      // 1. Separate head look-at mouse tracking
      headGroup.rotation.y += (targetRotY * 1.1 - headGroup.rotation.y) * 0.08;
      headGroup.rotation.x += (-targetRotX * 0.6 - headGroup.rotation.x) * 0.08;

      // 2. Gyro stabilization rings rotation
      gyroRing1.rotation.x += dt * 0.45;
      gyroRing1.rotation.y += dt * 0.2;
      gyroRing2.rotation.y -= dt * 0.55;
      gyroRing2.rotation.z += dt * 0.3;

      // 3. Central energy core pulsing scale & color shift
      energyCore.scale.setScalar(1.0 + Math.sin(t * 6.0) * 0.12 + glitchBase * 0.25);
      coreMat.color.copy(colorCrimson.clone().lerp(colorViolet, progress));

      // 4. Floating satellite nodes
      satellites.forEach((sat, idx) => {
        const angle = t * 0.75 + (idx * Math.PI * 2) / satCount;
        const radius = 1.25 + Math.sin(t * 1.8 + idx) * 0.12;
        sat.position.set(
          Math.cos(angle) * radius,
          0.45 + Math.sin(t * 1.2 + idx) * 0.25,
          Math.sin(angle) * radius
        );
        sat.rotation.x += dt * 0.6;
        sat.rotation.y += dt * 0.9;
      });

      // 5. Floating magnetic shoulders/arms & legs
      armParts.forEach((arm, idx) => {
        const sideFactor = idx === 0 ? 1 : -1;
        arm.position.y = 0.8 + Math.sin(t * 1.4 + idx * Math.PI) * 0.05;
        arm.rotation.y = sideFactor * Math.sin(t * 0.4) * 0.06;
      });
      legParts.forEach((leg, idx) => {
        leg.position.y = -0.1 + Math.sin(t * 1.1 + idx * Math.PI) * 0.035;
      });

      // ---------- Scroll-Driven Camera Path with Inertial Mouse Parallax ----------
      const baseCamX = mix(0.0, 1.1, progress);
      const baseCamY = mix(0.4, -0.9, progress);
      const baseCamZ = mix(9.0, 6.3, progress);

      const lookAtX = mix(1.4, 2.0, progress);
      const lookAtY = mix(0.6, 0.0, progress);

      camera.position.x += (baseCamX + Math.sin(targetRotY) * baseCamZ * 0.22 - camera.position.x) * 0.05;
      camera.position.y += (baseCamY - targetRotX * 1.4 - camera.position.y) * 0.05;
      camera.position.z += (baseCamZ - camera.position.z) * 0.05;
      camera.lookAt(lookAtX + targetRotY * 0.4 * rotationLock, lookAtY, 0);

      // ---------- CSS Glitch Overlay Class Triggering ----------
      const boundaries = [0.25, 0.50, 0.75];
      let crossedIndex = -1;
      for (let i = 0; i < boundaries.length; i++) {
        if (progress >= boundaries[i]) {
          crossedIndex = i;
        }
      }
      if (crossedIndex !== lastBoundaryIndex) {
        if (lastBoundaryIndex !== -1) {
          burstFrames = 22; // cross-boundary shock glitch
        }
        lastBoundaryIndex = crossedIndex;
      }

      const isGlitchingNow = isBoundaryCrossing || Math.random() < (glitchBase * 0.12);
      const glitchEl = glitchRef.current;
      if (glitchEl) {
        if (isGlitchingNow) {
          glitchEl.classList.add('glitch-active');
          glitchEl.style.transform = `translate(${(Math.random() - 0.5) * 8}px, ${(Math.random() - 0.5) * 4}px)`;
        } else {
          glitchEl.classList.remove('glitch-active');
          glitchEl.style.transform = '';
        }
      }

      // ---------- Chromatic Aberration Text Shadows ----------
      const chromShift = progress * 4.5 + glitchBase * 3.0;
      const textShadow = `-${chromShift}px 0 rgba(34,211,238,0.5), ${chromShift}px 0 rgba(196,24,60,0.5)`;
      const glitchTexts = container.querySelectorAll('.glitch-text');
      glitchTexts.forEach((el) => {
        (el as HTMLElement).style.textShadow = textShadow;
      });

      // ---------- Narrative Panels Opacity Fades ----------
      const opacity1 = 1.0 - smoothstep(0.18, 0.25, progress);
      const opacity2 = smoothstep(0.24, 0.30, progress) * (1.0 - smoothstep(0.44, 0.50, progress));
      const opacity3 = smoothstep(0.49, 0.55, progress) * (1.0 - smoothstep(0.69, 0.75, progress));
      const opacity4 = smoothstep(0.74, 0.80, progress);

      updatePanelStyle(scene1Ref.current, opacity1);
      updatePanelStyle(scene2Ref.current, opacity2);
      updatePanelStyle(scene3Ref.current, opacity3);
      updatePanelStyle(scene4Ref.current, opacity4);

      if (opacity2 > 0.05) {
        const hud = scene2Ref.current?.querySelector('.warning-hud');
        if (hud) {
          hud.textContent = `CONTAINMENT INTEGRITY // ${(100 - progress * 100).toFixed(1)}%`;
        }
      }

      // ---------- Shader Rim Flicker ----------
      flickerTimer += dt;
      if (flickerTimer > nextFlicker) {
        mat.uniforms.flicker.value = 0.25 + Math.random() * 0.2;
        flickerTimeoutId = setTimeout(() => {
          mat.uniforms.flicker.value = 1.0;
        }, 90);
        flickerTimer = 0;
        nextFlicker = 4 + Math.random() * 5;
      }

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    }

    function mix(start: number, end: number, amt: number) {
      return start + (end - start) * amt;
    }

    function updatePanelStyle(el: HTMLDivElement | null, opacity: number) {
      if (!el) return;
      el.style.opacity = `${opacity}`;
      el.style.pointerEvents = opacity > 0.05 ? 'auto' : 'none';
      el.style.visibility = opacity > 0.001 ? 'visible' : 'hidden';
    }

    animate();

    return () => {
      observer.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (flickerTimeoutId !== null) clearTimeout(flickerTimeoutId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('resize', onResize);
      pGeo.dispose();
      pMat.dispose();
      nebulaGeo.dispose();
      nebulaMat.dispose();
      mat.dispose();
      spriteTex.dispose();
      figure.traverse((obj) => {
        if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[400vh] bg-[#08070C] text-[#F1EDE4] cursor-none"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
        @keyframes blink { 50% { opacity: 0; } }
        @keyframes scrollpulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
        
        .hero-title {
          font-family: 'Unbounded', sans-serif;
          background: linear-gradient(115deg, #F1EDE4 28%, #C4183C 62%, #7C3AED 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 0 70px rgba(124,58,237,0.28);
          letter-spacing: -0.02em;
        }

        .mono { font-family: 'JetBrains Mono', monospace; }
        
        @media (prefers-reduced-motion: reduce) {
          .cursor-blink, .scroll-line { animation: none !important; }
        }

        /* Glitch Animation Layering */
        .glitch-active {
          animation: glitch-anim 0.25s steps(2, start) infinite;
          opacity: 0.12 !important;
        }
        
        @keyframes glitch-anim {
          0% { clip-path: inset(20% 0 50% 0); }
          20% { clip-path: inset(80% 0 5% 0); }
          40% { clip-path: inset(5% 0 85% 0); }
          60% { clip-path: inset(60% 0 30% 0); }
          80% { clip-path: inset(30% 0 60% 0); }
          100% { clip-path: inset(45% 0 25% 0); }
        }

        .glitch-overlay::before,
        .glitch-overlay::after {
          content: '';
          position: absolute;
          inset: 0;
          background: inherit;
          opacity: 0;
        }

        .glitch-active::before {
          left: 3px;
          box-shadow: -2px 0 rgba(34, 211, 238, 0.5);
          clip-path: inset(15% 0 75% 0);
          animation: glitch-anim-2 0.3s infinite linear alternate-reverse;
          opacity: 1;
        }

        .glitch-active::after {
          left: -3px;
          box-shadow: 2px 0 rgba(196, 24, 60, 0.5);
          clip-path: inset(65% 0 15% 0);
          animation: glitch-anim-3 0.25s infinite linear alternate-reverse;
          opacity: 1;
        }

        @keyframes glitch-anim-2 {
          0% { clip-path: inset(10% 0 80% 0); }
          100% { clip-path: inset(35% 0 45% 0); }
        }

        @keyframes glitch-anim-3 {
          0% { clip-path: inset(55% 0 20% 0); }
          100% { clip-path: inset(15% 0 70% 0); }
        }

        /* Trailing custom cursor styling */
        .cursor-dot {
          position: fixed; top: 0; left: 0; z-index: 100;
          width: 18px; height: 18px; margin-left: -9px; margin-top: -9px;
          border-radius: 9999px;
          border: 1.5px solid rgba(196,24,60,0.8);
          box-shadow: 0 0 calc(10px * var(--glow, 0.4)) calc(2px * var(--glow, 0.4)) rgba(124,58,237,0.7);
          pointer-events: none;
          transform: translate(var(--x, -100px), var(--y, -100px)) scale(var(--scale, 1));
          transition: border-color 0.2s ease, transform 0.05s ease-out;
          mix-blend-mode: screen;
        }

        /* Skill Chips styling */
        .tag-chip {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          padding: 5px 11px;
          border: 1px solid rgba(241,237,228,0.15);
          border-radius: 3px;
          color: #B8B3C4;
          letter-spacing: 0.3px;
          background: rgba(8, 7, 12, 0.4);
        }

        /* Glitch Button hover overlay */
        .glitch-btn { position: relative; overflow: hidden; }
        .glitch-btn::before, .glitch-btn::after {
          content: attr(data-text);
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          opacity: 0; mix-blend-mode: screen;
          transition: opacity 0.15s ease, transform 0.15s ease;
        }
        .glitch-btn::before { color: #C4183C; }
        .glitch-btn::after { color: #7C3AED; }
        .glitch-btn:hover::before { opacity: 0.7; transform: translate(-2.5px, 0); }
        .glitch-btn:hover::after { opacity: 0.7; transform: translate(2.5px, 0); }
        @media (prefers-reduced-motion: reduce) {
          .cursor-blink, .scroll-line { animation: none !important; }
          .glitch-btn::before, .glitch-btn::after { display: none; }
        }
        @media (hover: none) {
          .cursor-dot { display: none; }
        }
      `}</style>

      {/* Trailing Custom Cursor */}
      <div ref={cursorDotRef} className="cursor-dot hidden md:block" />

      {/* Sticky Viewport Container (Manual sticky viewport simulation) */}
      <div ref={mountRef} className="absolute top-0 left-0 w-full h-screen overflow-hidden">
        
        {/* Ambient background gradient */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(65% 60% at 78% 42%, rgba(124,58,237,0.22), transparent 65%), radial-gradient(48% 42% at 85% 72%, rgba(196,24,60,0.17), transparent 65%), linear-gradient(165deg, #08070C 0%, #120D1E 55%, #17101F 100%)',
          }}
        />

        {/* WebGL Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 z-[1] w-full h-full" />

        {/* Cinematic Glitch Overlay */}
        <div ref={glitchRef} className="glitch-overlay absolute inset-0 z-[5] pointer-events-none bg-transparent opacity-0" />

        {/* Vignette */}
        <div
          className="absolute inset-0 z-[6] pointer-events-none"
          style={{ background: 'radial-gradient(125% 95% at 50% 50%, transparent 50%, rgba(0,0,0,0.7) 100%)' }}
        />
        {/* Scanlines */}
        <div
          className="absolute inset-0 z-[7] pointer-events-none opacity-[0.04]"
          style={{
            background:
              'repeating-linear-gradient(to bottom, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 3px)',
          }}
        />

        {/* Fixed Navigation & HUD */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between pointer-events-none">
          <nav className="flex items-center justify-between px-6 md:px-12 pt-14 pb-6 md:pt-16 pointer-events-auto">
            <div className="mono text-sm text-[#8B8698] tracking-wide select-none">
              ~/<span className="text-[#4ADE80]">rakshit</span>
            </div>
          </nav>

          <div className="hidden md:block absolute top-14 md:top-16 right-12 mono text-[11px] text-[#8B8698] text-right leading-relaxed tracking-wide select-none">
            LOC // MESRA, IN
            <br />
            SIGNAL <span className="text-[#C4183C] animate-[blink_1s_steps(1)_infinite]">●</span> STABLE
          </div>

          {/* Stacked full-screen narrative panels */}
          <div className="absolute left-6 md:left-24 top-1/2 -translate-y-1/2 w-[calc(100%-3rem)] md:w-[600px] h-[450px] sm:h-[400px] md:h-[360px] pointer-events-none">
            
            {/* SCENE 1: The Normal World */}
            <div
              ref={scene1Ref}
              className="absolute inset-0 flex flex-col justify-center transition-all duration-75 select-none pointer-events-auto"
            >
              <div className="mono text-sm text-[#22d3ee] flex items-center gap-2.5 mb-5 tracking-wide flex-shrink-0">
                <span className="w-6 h-px bg-[#22d3ee]" />
                &gt; whoami
              </div>

              <h1 className="glitch-text hero-title font-extrabold uppercase leading-[0.96] mb-4 text-[36px] sm:text-[60px] lg:text-[76px] select-text flex-shrink-0">
                Rakshit
                <br />
                Kumar
              </h1>

              <div className="mono text-lg mb-4 min-h-[26px] flex-shrink-0">
                {typedRole}
                <span
                  className="cursor-blink inline-block w-[9px] h-[18px] bg-[#4ADE80] ml-1 align-middle"
                  style={{ animation: 'blink 1s steps(1) infinite' }}
                />
              </div>

              <p className="text-[15px] sm:text-[17px] leading-relaxed text-[#8B8698] max-w-[460px] mb-6 flex-shrink-0">
                B.Tech CSE @ BIT Mesra. I build full-stack systems — Next.js and MERN applications, REST APIs, and interactive experiments. 800+ DSA problems solved. Currently open to opportunities.
              </p>

              {/* Quick Skill Tags Section */}
              <div className="flex flex-wrap gap-2 mb-8 select-none flex-shrink-0">
                {TAGS.map((tag) => (
                  <span key={tag} className="tag-chip">
                    {tag}
                  </span>
                ))}
              </div>
              
              <p className="mono text-[10px] text-[#8B8698]/70 mt-2 tracking-wide uppercase select-none flex-shrink-0">
                move cursor near figure · click to fire shockwave · scroll to shift dimensions
              </p>
            </div>

            {/* SCENE 2: Stack Boot / System Online */}
            <div
              ref={scene2Ref}
              className="absolute inset-0 flex flex-col justify-center transition-all duration-75 select-none opacity-0 pointer-events-none"
            >
              <div className="mono text-sm text-[#f59e0b] flex items-center gap-2.5 mb-5 tracking-wide flex-shrink-0">
                <span className="w-6 h-px bg-[#f59e0b]" />
                &gt; stack.boot
              </div>

              <h1 className="glitch-text font-extrabold uppercase leading-[0.98] tracking-tight mb-4 text-[36px] sm:text-[60px] lg:text-[76px] text-white flex-shrink-0">
                STACK
                <br />
                ONLINE
              </h1>

              <div className="warning-hud mono text-[13px] text-[#f59e0b] mb-4.5 font-bold tracking-widest uppercase flex-shrink-0">
                CONTAINMENT SHIELD INTEGRITY // 100.0%
              </div>

              <p className="text-[15px] sm:text-[17px] leading-relaxed text-[#8B8698] max-w-[460px] flex-shrink-0">
                Runtime initialised. MERN stack boot sequence complete. Node.js API layer active. MongoDB connected. React renderer online. Awaiting signal.
              </p>
            </div>


            {/* SCENE 3: The Gateway Crossed */}
            <div
              ref={scene3Ref}
              className="absolute inset-0 flex flex-col justify-center transition-all duration-75 select-none opacity-0 pointer-events-none"
            >
              <div className="mono text-sm text-[#C4183C] flex items-center gap-2.5 mb-5 tracking-wide flex-shrink-0">
                <span className="w-6 h-px bg-[#C4183C]" />
                &gt; inside_gate
              </div>

              <h1 className="glitch-text font-extrabold uppercase leading-[0.98] tracking-tight mb-4 text-[36px] sm:text-[60px] lg:text-[76px] text-[#C4183C] flex-shrink-0">
                THE UPSIDE
                <br />
                DOWN
              </h1>

              <div className="mono text-sm text-[#7C3AED] mb-4.5 tracking-wider uppercase font-bold flex-shrink-0">
                DIAGNOSTIC: SECURE DATABASES & WEBGL HOOKS ONLY
              </div>

              <p className="text-[15px] sm:text-[17px] leading-relaxed text-[#8B8698] max-w-[460px] mb-8 select-text flex-shrink-0">
                On this side: low-latency APIs, WebRTC video mesh, SQL inference agents, and real-time sockets. Five live deployments. Production-grade engineering.
              </p>

              <div className="flex-shrink-0">
                <button
                  onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                  data-text="Inspect my creations"
                  className="glitch-btn font-semibold text-xs px-6 py-[13px] rounded-sm text-white transition-transform hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(124,58,237,0.35)] cursor-pointer"
                  style={{ background: 'linear-gradient(100deg, #C4183C, #7C3AED)' }}
                >
                  Inspect my creations
                </button>
              </div>
            </div>

            {/* SCENE 4: The Core / Contact CTA */}
            <div
              ref={scene4Ref}
              className="absolute inset-0 flex flex-col justify-center transition-all duration-75 select-none opacity-0 pointer-events-none"
            >
              <div className="mono text-sm text-[#7C3AED] flex items-center gap-2.5 mb-5 tracking-wide flex-shrink-0">
                <span className="w-6 h-px bg-[#7C3AED]" />
                &gt; terminal_broadcast
              </div>

              <h1 className="glitch-text font-extrabold uppercase leading-[0.98] tracking-tight mb-4 text-[36px] sm:text-[60px] lg:text-[76px] text-white flex-shrink-0">
                STAY
                <br />
                CONNECTED
              </h1>

              <p className="text-[15px] sm:text-[17px] leading-relaxed text-[#8B8698] max-w-[460px] mb-8 select-text flex-shrink-0">
                The gateway remains open. Transmission coordinates to Patna and Mesra are online. Broadcast a carrier packet straight to my signal.
              </p>

              <div className="flex gap-3.5 items-center flex-wrap pointer-events-auto flex-shrink-0">
                <button
                  onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                  data-text="View my work"
                  className="glitch-btn font-semibold text-xs px-6 py-[13px] rounded-sm text-white transition-transform hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(124,58,237,0.35)] cursor-pointer"
                  style={{ background: 'linear-gradient(100deg, #C4183C, #7C3AED)' }}
                >
                  View my work
                </button>
                <a
                  href="mailto:rakshitkumar.5905@gmail.com"
                  data-text="Email Me"
                  className="glitch-btn font-semibold text-xs px-6 py-[13px] rounded-sm border border-white/20 hover:border-white/50 transition-all hover:-translate-y-0.5 flex items-center justify-center cursor-pointer text-[#F1EDE4]"
                >
                  Email Me
                </a>
                <button
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                  data-text="Get in touch"
                  className="glitch-btn font-semibold text-xs px-6 py-[13px] rounded-sm border border-white/20 hover:border-white/50 transition-all hover:-translate-y-0.5 cursor-pointer text-[#F1EDE4]"
                >
                  Get in touch
                </button>
              </div>
            </div>

          </div>

          {/* Floating Scroll Indicator */}
          <div className="absolute bottom-9 left-6 md:left-12 z-10 flex items-center gap-2.5 mono text-[11px] text-[#8B8698] tracking-widest uppercase select-none">
            <div
              className="scroll-line w-px h-8"
              style={{
                background: 'linear-gradient(to bottom, #8B8698, transparent)',
                animation: 'scrollpulse 2s ease-in-out infinite',
              }}
            />
            Scroll down to explore
          </div>
        </div>

      </div>
    </div>
  );
}