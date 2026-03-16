/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";


import React, { useEffect, useRef } from 'react';

declare const gsap: any;
declare const THREE: any;

export function Component() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let cleanupFn: (() => void) | null = null;
        let isMounted = true;

        // --- DYNAMIC SCRIPT LOADING ---
        const loadScripts = async () => {
            const loadScript = (src: string, globalName: string) => new Promise<void>((res, rej) => {
                if ((window as any)[globalName]) { res(); return; }
                // Check if script already exists to avoid duplication
                if (document.querySelector(`script[src="${src}"]`)) {
                    const check = setInterval(() => {
                        if ((window as any)[globalName]) { clearInterval(check); res(); }
                    }, 50);
                    setTimeout(() => { clearInterval(check); rej(new Error(`Timeout waiting for ${globalName}`)); }, 10000);
                    return;
                }
                const s = document.createElement('script');
                s.src = src;
                s.onload = () => { setTimeout(() => res(), 100); };
                s.onerror = () => rej(new Error(`Failed to load ${src}`));
                document.head.appendChild(s);
            });

            try {
                await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', 'gsap');
                await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'THREE');

                if (isMounted) {
                    initApplication();
                }
            } catch (e) {
                console.error('Failed to load base scripts:', e);
            }
        };

        const initApplication = async () => {
            // --- CONFIG ---
            const SLIDER_CONFIG: any = {
                settings: {
                    transitionDuration: 2.5, autoSlideSpeed: 5000, currentEffect: "glass",
                    globalIntensity: 1.0, speedMultiplier: 1.0, distortionStrength: 1.0, colorEnhancement: 1.0,
                    glassRefractionStrength: 1.0, glassChromaticAberration: 1.0, glassBubbleClarity: 1.0, glassEdgeGlow: 1.0, glassLiquidFlow: 1.0,
                }
            };

            // --- GLOBAL STATE ---
            let currentSlideIndex = 0;
            let isTransitioning = false;
            let shaderMaterial: any, renderer: any, scene: any, camera: any;
            const slideTextures: any[] = [];
            let texturesLoaded = false;
            let autoSlideTimer: any = null;
            let progressAnimation: any = null;
            let sliderEnabled = false;

            const SLIDE_DURATION = () => SLIDER_CONFIG.settings.autoSlideSpeed;
            const PROGRESS_UPDATE_INTERVAL = 50;
            const TRANSITION_DURATION = () => SLIDER_CONFIG.settings.transitionDuration;

            // --- UPDATED SLIDES DATA ---
            const slides = [
                { title: "Smartchoice Homes", description: "Premium luxury real estate platform. Experience dynamic property filtration and seamless administrative management.", media: "/projects/smartchoice-homes.png", liveUrl: "https://smartchoicehomes.vercel.app", githubUrl: "https://github.com/rakshit432/Smart_choice_homes" },
                { title: "BlogOnSpot", description: "Minimalist, AI-driven full-stack blogging ecosystem. Engineered with JWT auth and powerful moderation tools.", media: "/projects/blogonspot.png", liveUrl: "https://blogonspot.vercel.app", githubUrl: "https://github.com/rakshit432/BlogOnSpot" },
                { title: "Mediversal", description: "The next generation of healthcare access. Featuring AI symptom analysis and dedicated multi-role dashboards.", media: "/projects/mediversal.png", liveUrl: "https://mediversal-tf2h.vercel.app", adminUrl: "https://mediversal-n29o.vercel.app", githubUrl: "https://github.com/rakshit432/Mediversal" },
                { title: "Future Meet", description: "Sleek, real-time video conferencing architecture engineered for the modern collaborative workflow.", media: "/projects/future-meet.png", liveUrl: "https://future-meet.vercel.app", githubUrl: "https://github.com/rakshit432/future-meet" }
            ];

            // --- SHADERS ---
            const vertexShader = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
            const fragmentShader = `
            uniform sampler2D uTexture1, uTexture2;
            uniform float uProgress;
            uniform vec2 uResolution, uTexture1Size, uTexture2Size;
            uniform float uGlobalIntensity, uSpeedMultiplier, uDistortionStrength;
            uniform float uGlassRefractionStrength, uGlassChromaticAberration, uGlassBubbleClarity, uGlassEdgeGlow, uGlassLiquidFlow;
            varying vec2 vUv;

            vec2 getCoverUV(vec2 uv, vec2 textureSize) {
                vec2 s = uResolution / textureSize;
                float scale = max(s.x, s.y);
                vec2 scaledSize = textureSize * scale;
                vec2 offset = (uResolution - scaledSize) * 0.5;
                return (uv * uResolution - offset) / scaledSize;
            }
            
            void main() {
                float time = uProgress * 5.0 * uSpeedMultiplier;
                vec2 uv1 = getCoverUV(vUv, uTexture1Size); vec2 uv2 = getCoverUV(vUv, uTexture2Size);
                float maxR = length(uResolution) * 0.85; float br = uProgress * maxR;
                vec2 p = vUv * uResolution; vec2 c = uResolution * 0.5;
                float d = length(p - c); float nd = d / max(br, 0.001);
                float param = smoothstep(br + 3.0, br - 3.0, d);
                vec4 img;
                if (param > 0.0) {
                     float ro = 0.08 * uGlassRefractionStrength * uDistortionStrength * uGlobalIntensity * pow(smoothstep(0.3 * uGlassBubbleClarity, 1.0, nd), 1.5);
                     vec2 dir = (d > 0.0) ? (p - c) / d : vec2(0.0);
                     vec2 distUV = uv2 - dir * ro;
                     distUV += vec2(sin(time + nd * 10.0), cos(time * 0.8 + nd * 8.0)) * 0.015 * uGlassLiquidFlow * uSpeedMultiplier * nd * param;
                     float ca = 0.02 * uGlassChromaticAberration * uGlobalIntensity * pow(smoothstep(0.3, 1.0, nd), 1.2);
                     img = vec4(texture2D(uTexture2, distUV + dir * ca * 1.2).r, texture2D(uTexture2, distUV + dir * ca * 0.2).g, texture2D(uTexture2, distUV - dir * ca * 0.8).b, 1.0);
                } else { img = texture2D(uTexture2, uv2); }
                vec4 oldImg = texture2D(uTexture1, uv1);
                if (uProgress > 0.95) img = mix(img, texture2D(uTexture2, uv2), (uProgress - 0.95) / 0.05);
                gl_FragColor = mix(oldImg, img, param);
            }
        `;

            const updateShaderUniforms = () => {
                if (!shaderMaterial) return;
                const s = SLIDER_CONFIG.settings, u = shaderMaterial.uniforms;
                if (u.uGlobalIntensity) u.uGlobalIntensity.value = s.globalIntensity;
            };

            const splitText = (text: string) => {
                return text.split('').map(char => `<span style="display: inline-block; opacity: 0;">${char === ' ' ? '&nbsp;' : char}</span>`).join('');
            };

            const updateContent = (idx: number) => {
                const titleEl = document.getElementById('mainTitle');
                const descEl = document.getElementById('mainDesc');
                const liveEl = document.getElementById('liveBtn');
                const adminEl = document.getElementById('adminBtn');
                const githubEl = document.getElementById('githubBtn');

                if (titleEl && descEl) {
                    gsap.to(titleEl.children, { y: -20, opacity: 0, duration: 0.5, stagger: 0.02, ease: "power2.in" });
                    gsap.to(descEl, { y: -10, opacity: 0, duration: 0.4, ease: "power2.in" });
                    if (liveEl) gsap.to(liveEl, { opacity: 0, y: 10, duration: 0.3 });
                    if (adminEl) gsap.to(adminEl, { opacity: 0, y: 10, duration: 0.3 });
                    if (githubEl) gsap.to(githubEl, { opacity: 0, y: 10, duration: 0.3 });

                    setTimeout(() => {
                        // Check if mounted
                        if (!isMounted) return;

                        titleEl.innerHTML = splitText(slides[idx].title);
                        descEl.textContent = slides[idx].description;

                        // UPDATE BUTTON URL
                        if (liveEl) {
                            const url = slides[idx].liveUrl || "#";
                            (liveEl as HTMLAnchorElement).href = url;
                            liveEl.style.display = (url && url !== "#") ? "inline-flex" : "none";
                        }
                        if (adminEl) {
                            const url = (slides[idx] as any).adminUrl || "#";
                            (adminEl as HTMLAnchorElement).href = url;
                            adminEl.style.display = (url && url !== "#") ? "inline-flex" : "none";
                        }
                        if (githubEl) {
                            const url = slides[idx].githubUrl || "#";
                            (githubEl as HTMLAnchorElement).href = url;
                            githubEl.style.display = (url && url !== "#") ? "inline-flex" : "none";
                        }

                        gsap.set(titleEl.children, { y: 20, opacity: 0 });
                        gsap.set(descEl, { y: 20, opacity: 0 });
                        if (liveEl) gsap.set(liveEl, { opacity: 0, y: 10 });
                        if (adminEl) gsap.set(adminEl, { opacity: 0, y: 10 });
                        if (githubEl) gsap.set(githubEl, { opacity: 0, y: 10 });

                        gsap.to(titleEl.children, { y: 0, opacity: 1, duration: 0.8, stagger: 0.03, ease: "power3.out" });
                        gsap.to(descEl, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out" });
                        if (liveEl) gsap.to(liveEl, { opacity: 1, y: 0, duration: 0.6, delay: 0.4, ease: "power2.out" });
                        if (adminEl) gsap.to(adminEl, { opacity: 1, y: 0, duration: 0.6, delay: 0.45, ease: "power2.out" });
                        if (githubEl) gsap.to(githubEl, { opacity: 1, y: 0, duration: 0.6, delay: 0.5, ease: "power2.out" });
                    }, 500);
                }
            };

            const navigateToSlide = (targetIndex: number) => {
                if (isTransitioning || targetIndex === currentSlideIndex) return;
                stopAutoSlideTimer();
                quickResetProgress(currentSlideIndex);

                const currentTexture = slideTextures[currentSlideIndex];
                const targetTexture = slideTextures[targetIndex];
                if (!currentTexture || !targetTexture) return;

                isTransitioning = true;
                shaderMaterial.uniforms.uTexture1.value = currentTexture;
                shaderMaterial.uniforms.uTexture2.value = targetTexture;
                shaderMaterial.uniforms.uTexture1Size.value = currentTexture.userData.size;
                shaderMaterial.uniforms.uTexture2Size.value = targetTexture.userData.size;

                updateContent(targetIndex);

                currentSlideIndex = targetIndex;
                updateCounter(currentSlideIndex);
                updateNavigationState(currentSlideIndex);

                gsap.fromTo(shaderMaterial.uniforms.uProgress,
                    { value: 0 },
                    {
                        value: 1,
                        duration: TRANSITION_DURATION(),
                        ease: "power2.inOut",
                        onComplete: () => {
                            shaderMaterial.uniforms.uProgress.value = 0;
                            shaderMaterial.uniforms.uTexture1.value = targetTexture;
                            shaderMaterial.uniforms.uTexture1Size.value = targetTexture.userData.size;
                            isTransitioning = false;
                            safeStartTimer(100);
                        }
                    }
                );
            };

            const handleSlideChange = () => {
                if (isTransitioning || !texturesLoaded || !sliderEnabled) return;
                navigateToSlide((currentSlideIndex + 1) % slides.length);
            };

            const createSlidesNavigation = () => {
                const nav = document.getElementById("slidesNav"); if (!nav) return;
                nav.innerHTML = "";
                slides.forEach((slide, i) => {
                    const item = document.createElement("div");
                    item.className = `slide-nav-item${i === 0 ? " active" : ""}`;
                    item.dataset.slideIndex = String(i);
                    item.innerHTML = `<div class="slide-progress-line"><div class="slide-progress-fill"></div></div><div class="slide-nav-title">${slide.title}</div>`;
                    item.addEventListener("click", (e) => {
                        e.stopPropagation();
                        if (!isTransitioning && i !== currentSlideIndex) {
                            stopAutoSlideTimer();
                            quickResetProgress(currentSlideIndex);
                            navigateToSlide(i);
                        }
                    });
                    nav.appendChild(item);
                });
            };

            const updateNavigationState = (idx: number) => document.querySelectorAll(".slide-nav-item").forEach((el, i) => el.classList.toggle("active", i === idx));
            const updateSlideProgress = (idx: number, prog: number) => { const el = document.querySelectorAll(".slide-nav-item")[idx]?.querySelector(".slide-progress-fill") as HTMLElement; if (el) { el.style.width = `${prog}%`; el.style.opacity = '1'; } };
            const fadeSlideProgress = (idx: number) => { const el = document.querySelectorAll(".slide-nav-item")[idx]?.querySelector(".slide-progress-fill") as HTMLElement; if (el) { el.style.opacity = '0'; setTimeout(() => el.style.width = "0%", 300); } };
            const quickResetProgress = (idx: number) => { const el = document.querySelectorAll(".slide-nav-item")[idx]?.querySelector(".slide-progress-fill") as HTMLElement; if (el) { el.style.transition = "width 0.2s ease-out"; el.style.width = "0%"; setTimeout(() => el.style.transition = "width 0.1s ease, opacity 0.3s ease", 200); } };
            const updateCounter = (idx: number) => {
                const sn = document.getElementById("slideNumber"); if (sn) sn.textContent = String(idx + 1).padStart(2, "0");
                const st = document.getElementById("slideTotal"); if (st) st.textContent = String(slides.length).padStart(2, "0");
            };

            const startAutoSlideTimer = () => {
                if (!texturesLoaded || !sliderEnabled) return;
                stopAutoSlideTimer();
                let progress = 0;
                const increment = (100 / SLIDE_DURATION()) * PROGRESS_UPDATE_INTERVAL;
                progressAnimation = setInterval(() => {
                    if (!sliderEnabled) { stopAutoSlideTimer(); return; }
                    progress += increment;
                    updateSlideProgress(currentSlideIndex, progress);
                    if (progress >= 100) {
                        clearInterval(progressAnimation); progressAnimation = null;
                        fadeSlideProgress(currentSlideIndex);
                        if (!isTransitioning) handleSlideChange();
                    }
                }, PROGRESS_UPDATE_INTERVAL);
            };
            const stopAutoSlideTimer = () => { if (progressAnimation) clearInterval(progressAnimation); if (autoSlideTimer) clearTimeout(autoSlideTimer); progressAnimation = null; autoSlideTimer = null; };
            const safeStartTimer = (delay = 0) => { stopAutoSlideTimer(); if (sliderEnabled && texturesLoaded) { if (delay > 0) autoSlideTimer = setTimeout(startAutoSlideTimer, delay); else startAutoSlideTimer(); } };

            const loadImageTexture = (src: string) => new Promise<any>((resolve, reject) => {
                const l = new THREE.TextureLoader();
                l.setCrossOrigin('anonymous');
                l.load(src, (t: any) => { t.minFilter = t.magFilter = THREE.LinearFilter; t.userData = { size: new THREE.Vector2(t.image.width, t.image.height) }; resolve(t); }, undefined, reject);
            });

            const initRenderer = async () => {
                const canvas = document.querySelector(".webgl-canvas") as HTMLCanvasElement; if (!canvas) return;
                // Dispose existing scene if any is attached to this canvas? 
                // Better to assume we are fresh.
                scene = new THREE.Scene(); camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
                renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true }); // alpha: true for transparency
                renderer.setSize(window.innerWidth, window.innerHeight); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

                shaderMaterial = new THREE.ShaderMaterial({
                    uniforms: {
                        uTexture1: { value: null }, uTexture2: { value: null }, uProgress: { value: 0 },
                        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
                        uTexture1Size: { value: new THREE.Vector2(1, 1) }, uTexture2Size: { value: new THREE.Vector2(1, 1) },
                        uGlobalIntensity: { value: 1.0 }, uSpeedMultiplier: { value: 1.0 }, uDistortionStrength: { value: 1.0 },
                        uGlassRefractionStrength: { value: 1.0 }, uGlassChromaticAberration: { value: 1.0 }, uGlassBubbleClarity: { value: 1.0 }, uGlassEdgeGlow: { value: 1.0 }, uGlassLiquidFlow: { value: 1.0 },
                    },
                    vertexShader, fragmentShader
                });
                scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shaderMaterial));

                for (const s of slides) { try { slideTextures.push(await loadImageTexture(s.media)); } catch { console.warn("Failed texture"); } }
                if (slideTextures.length >= 2) {
                    shaderMaterial.uniforms.uTexture1.value = slideTextures[0];
                    shaderMaterial.uniforms.uTexture2.value = slideTextures[1];
                    shaderMaterial.uniforms.uTexture1Size.value = slideTextures[0].userData.size;
                    shaderMaterial.uniforms.uTexture2Size.value = slideTextures[1].userData.size;
                    texturesLoaded = true; sliderEnabled = true;
                    updateShaderUniforms();
                    document.querySelector(".slider-wrapper")?.classList.add("loaded");
                    safeStartTimer(500);
                }

                const render = () => {
                    if (!isMounted) return;
                    requestAnimationFrame(render);
                    renderer.render(scene, camera);
                };
                render();
            };

            createSlidesNavigation(); updateCounter(0);

            // Init text and BUTTON
            const tEl = document.getElementById('mainTitle');
            const dEl = document.getElementById('mainDesc');
            const liveEl = document.getElementById('liveBtn') as HTMLAnchorElement;
            const adminEl = document.getElementById('adminBtn') as HTMLAnchorElement;
            const githubEl = document.getElementById('githubBtn') as HTMLAnchorElement;

            if (tEl && dEl) {
                tEl.innerHTML = splitText(slides[0].title);
                dEl.textContent = slides[0].description;
                if (liveEl) {
                    liveEl.href = slides[0].liveUrl || "#";
                    liveEl.style.display = (slides[0].liveUrl && slides[0].liveUrl !== "#") ? "inline-flex" : "none";
                }
                if (adminEl) {
                    adminEl.href = (slides[0] as any).adminUrl || "#";
                    adminEl.style.display = ((slides[0] as any).adminUrl && (slides[0] as any).adminUrl !== "#") ? "inline-flex" : "none";
                }
                if (githubEl) {
                    githubEl.href = slides[0].githubUrl || "#";
                    githubEl.style.display = (slides[0].githubUrl && slides[0].githubUrl !== "#") ? "inline-flex" : "none";
                }
                // animate initial in
                gsap.fromTo(tEl.children, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.03, ease: "power3.out", delay: 0.5 });
                gsap.fromTo(dEl, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.8 });
                if (liveEl) gsap.fromTo(liveEl, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 1 });
                if (adminEl) gsap.fromTo(adminEl, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 1.05 });
                if (githubEl) gsap.fromTo(githubEl, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 1.1 });
            }

            initRenderer();

            // Listeners managed inside init but we need to track them to remove?
            // Simplifying for stability: We mainly care about stopping the loop and timer.
            const resizeHandler = () => { if (renderer) { renderer.setSize(window.innerWidth, window.innerHeight); shaderMaterial.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight); } };
            window.addEventListener("resize", resizeHandler);

            // Expose cleanup
            cleanupFn = () => {
                window.removeEventListener("resize", resizeHandler);
                stopAutoSlideTimer();
                if (renderer) {
                    renderer.dispose();
                    // We should also dispose textures/geometries if strict
                }
            };
        };

        loadScripts();
        return () => {
            isMounted = false;
            if (cleanupFn) cleanupFn();
        };
    }, []);

    return (
        <>
            <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600&family=Inter:wght@700;800;900&display=swap');

        .slider-wrapper {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: transparent;
        }
        
        .slider-wrapper::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.7) 100%);
          z-index: 5;
          pointer-events: none;
        }

        .webgl-canvas {
          display: block;
          width: 100%;
          height: 100%;
          opacity: 1; /* Vibrant background */
        }
        .slide-content {
          position: absolute;
          top: 50%;
          left: 8%;
          transform: translateY(-50%);
          z-index: 10;
          color: #fff;
          max-width: 650px;
          pointer-events: none;
        }
        .slide-title {
          font-family: 'Inter', sans-serif;
          font-size: clamp(3rem, 7vw, 6.5rem);
          font-weight: 800;
          line-height: 1;
          margin-bottom: 1.2rem;
          letter-spacing: -0.04em;
          text-shadow: 0 4px 20px rgba(0,0,0,0.4);
        }
        .slide-description {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(1rem, 1.2vw, 1.25rem);
          font-weight: 300;
          opacity: 0.85;
          margin-bottom: 2rem;
          line-height: 1.6;
          text-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }
        /* PROJECT BUTTON STYLE */
        .project-btn-container {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .project-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          pointer-events: auto; /* Enable clicks */
          padding: 0.8rem 1.8rem;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 9999px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: white;
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          opacity: 0;
          background: rgba(0,0,0,0.3);
          backdrop-filter: blur(8px);
        }
        .project-btn:hover {
          background: white;
          color: black;
          border-color: white;
        }
        
        .slides-navigation {
          position: absolute;
          bottom: 40px;
          right: 40px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          z-index: 20;
        }
        .slide-nav-item {
          display: flex;
          align-items: center;
          gap: 15px;
          cursor: pointer;
          opacity: 0.5;
          transition: opacity 0.3s;
        }
        .slide-nav-item.active {
          opacity: 1;
        }
        .slide-progress-line {
          width: 40px;
          height: 2px;
          background: rgba(255,255,255,0.2);
          position: relative;
        }
        .slide-progress-fill {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          background: #fff;
          width: 0%;
        }
        .slide-nav-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }
        .slide-number {
          position: absolute;
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          font-size: clamp(8rem, 15vw, 14rem);
          color: rgba(255,255,255,0.03);
          z-index: 10;
          top: 50%;
          right: 5%;
          transform: translateY(-50%);
          line-height: 0.8;
          letter-spacing: -0.05em;
          pointer-events: none;
        }
        .slide-total { 
          display: none; 
        }

        /* --- MOBILE RESPONSIVE --- */
        @media (max-width: 768px) {
           .slide-content {
              left: 5%;
              width: 90%;
              max-width: none;
              text-align: left;
           }
           .slide-title {
              font-size: clamp(2.2rem, 8vw, 3.5rem); 
           }
           .slide-description {
              font-size: clamp(0.95rem, 4vw, 1.1rem);
              max-width: 100%;
           }
           .slides-navigation {
              right: 20px;
              bottom: 30px;
              gap: 15px;
           }
           .slide-nav-title {
              display: none; /* Hide text label on mobile, keep lines */
           }
           .slide-progress-line {
              width: 30px;
           }
           .slide-number { top: 20px; left: 20px; font-size: 1.2rem; }
           .slide-total { bottom: 20px; left: 20px; font-size: 0.9rem; }
        }
      `}</style>
            <main className="slider-wrapper" ref={containerRef}>
                <canvas className="webgl-canvas"></canvas>
                <span className="slide-number" id="slideNumber">01</span>
                <span className="slide-total" id="slideTotal">04</span>

                <div className="slide-content">
                    <h1 className="slide-title" id="mainTitle"></h1>
                    <p className="slide-description" id="mainDesc"></p>
                    {/* BUTTON ADDED */}
                    <div className="project-btn-container">
                        <a id="liveBtn" target="_blank" rel="noopener noreferrer" className="project-btn">
                           <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                           Live Demo
                        </a>
                        <a id="adminBtn" target="_blank" rel="noopener noreferrer" className="project-btn" style={{display: 'none'}}>
                           <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                           Admin Demo
                        </a>
                        <a id="githubBtn" target="_blank" rel="noopener noreferrer" className="project-btn">
                           <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                           GitHub
                        </a>
                    </div>
                </div>

                <nav className="slides-navigation" id="slidesNav"></nav>
            </main>
        </>
    );
}
