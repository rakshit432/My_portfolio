"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function WebGLShader({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene | null
    camera: THREE.OrthographicCamera | null
    renderer: THREE.WebGLRenderer | null
    mesh: THREE.Mesh | null
    uniforms: any
    animationId: number | null
  }>({
    scene: null,
    camera: null,
    renderer: null,
    mesh: null,
    uniforms: null,
    animationId: null,
  })

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const { current: refs } = sceneRef

    const vertexShader = `
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `

    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform float xScale;
      uniform float yScale;
      uniform float distortion;

      void main() {
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
        
        // Slower, organic movement
        float d = length(p) * distortion;
        
        float rx = p.x * (1.0 + d);
        float gx = p.x;
        float bx = p.x * (1.0 - d);

        // Elegant Wave Math
        // We use slightly different phases for r,g,b but blend them into a coherent palette
        
        float r = 0.02 / abs(p.y + sin((rx + time) * xScale) * yScale);
        float g = 0.02 / abs(p.y + sin((gx + time) * xScale) * yScale);
        float b = 0.02 / abs(p.y + sin((bx + time) * xScale) * yScale);
        
        // Ethereal Palette Mixing:
        // Instead of raw R, G, B, we map intensity to a specific color gradient.
        // Primary: Deep Blue / Purple / Cyan
        
        vec3 color = vec3(0.0);
        color += vec3(0.1, 0.4, 0.9) * r; // Blue-ish
        color += vec3(0.6, 0.1, 0.8) * g; // Purple-ish
        color += vec3(0.0, 0.8, 0.9) * b; // Cyan-ish
        
        // Soften the output
        gl_FragColor = vec4(color, 1.0);
      }
    `

    const initScene = () => {
      refs.scene = new THREE.Scene()
      refs.renderer = new THREE.WebGLRenderer({ canvas, alpha: true })
      refs.renderer.setPixelRatio(window.devicePixelRatio)
      // Transparent background so we can layer it if needed, or keep black
      refs.renderer.setClearColor(new THREE.Color(0x000000))

      refs.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1)

      refs.uniforms = {
        resolution: { value: [window.innerWidth, window.innerHeight] },
        time: { value: 0.0 },
        xScale: { value: 0.8 }, // Slightly stretched waves
        yScale: { value: 0.3 }, // Flatter waves
        distortion: { value: 0.03 }, // Subtler distortion
      }

      const position = [
        -1.0, -1.0, 0.0,
        1.0, -1.0, 0.0,
        -1.0, 1.0, 0.0,
        1.0, -1.0, 0.0,
        -1.0, 1.0, 0.0,
        1.0, 1.0, 0.0,
      ]

      const positions = new THREE.BufferAttribute(new Float32Array(position), 3)
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute("position", positions)

      const material = new THREE.RawShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: refs.uniforms,
        side: THREE.DoubleSide,
      })

      refs.mesh = new THREE.Mesh(geometry, material)
      refs.scene.add(refs.mesh)

      handleResize()
    }

    const animate = () => {
      // Much slower animation for elegance (was 0.01)
      if (refs.uniforms) refs.uniforms.time.value += 0.003
      if (refs.renderer && refs.scene && refs.camera) {
        refs.renderer.render(refs.scene, refs.camera)
      }
      refs.animationId = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      if (!refs.renderer || !refs.uniforms) return
      // We might want to use container size instead of window if it's absolute?
      // But shader relies on window res typically for full effect.
      // If we put it in Hero, we likely want it to fill Hero.
      // However, the shader uniforms use window.innerWidth/Height.
      const width = window.innerWidth
      const height = window.innerHeight
      refs.renderer.setSize(width, height, false)
      refs.uniforms.resolution.value = [width, height]
    }

    initScene()
    animate()
    window.addEventListener("resize", handleResize)

    return () => {
      if (refs.animationId) cancelAnimationFrame(refs.animationId)
      window.removeEventListener("resize", handleResize)
      if (refs.mesh) {
        refs.scene?.remove(refs.mesh)
        refs.mesh.geometry.dispose()
        if (refs.mesh.material instanceof THREE.Material) {
          refs.mesh.material.dispose()
        }
      }
      refs.renderer?.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className || "fixed top-0 left-0 w-full h-full block"}
    />
  )
}
