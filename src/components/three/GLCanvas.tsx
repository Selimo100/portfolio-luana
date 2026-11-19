import { Component, useEffect, useState, type ReactNode } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { PerformanceMonitor, View } from '@react-three/drei'
import gsap from 'gsap'
import * as THREE from 'three'
import { viewRegistry } from '../../lib/sceneState'
import { isLowPowerDevice } from '../../lib/webgl'

/**
 * Drives the render loop from the GSAP ticker — the same clock Lenis and
 * ScrollTrigger use — so WebGL views are drawn *after* the scroll position for
 * the frame is known. With two separate rAF loops the views trail the DOM by a
 * frame, which reads as jitter while scrolling. Sleeps when no view is visible.
 */
function FrameDriver() {
  const advance = useThree((s) => s.advance)
  const gl = useThree((s) => s.gl)
  useEffect(() => {
    let running = false
    const tick = (time: number) => advance(time)
    const unsubscribe = viewRegistry.subscribe((count) => {
      const next = count > 0
      if (next === running) return
      running = next
      if (next) gsap.ticker.add(tick)
      else {
        gsap.ticker.remove(tick)
        // Going to sleep: wipe the last frame so no image is left frozen on screen
        gl.setScissorTest(false)
        gl.clear()
      }
    })
    return () => {
      unsubscribe()
      gsap.ticker.remove(tick)
    }
  }, [advance, gl])
  return null
}

class GLErrorBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error: unknown) {
    console.warn('[webgl] disabled after renderer error', error)
    this.props.onError()
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

/**
 * One shared, transparent WebGL canvas fixed over the page.
 * Individual scenes render into it through drei <View> regions that track
 * DOM elements — one GL context for the whole site.
 */
export default function GLCanvas({ onError }: { onError: () => void }) {
  // A full-screen canvas at 2× is ~4× the pixels of 1× — 1.5 looks the same on the soft studio models
  const maxDpr = isLowPowerDevice() ? 1.25 : 1.5
  const [dpr, setDpr] = useState(Math.min(window.devicePixelRatio, maxDpr))

  return (
    <GLErrorBoundary onError={onError}>
      <Canvas
        aria-hidden="true"
        style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 20, pointerEvents: 'none' }}
        dpr={dpr}
        frameloop="never"
        resize={{ scroll: false, debounce: { scroll: 0, resize: 120 } }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.NeutralToneMapping
          gl.setClearColor(0x000000, 0)
          gl.domElement.addEventListener('webglcontextlost', (event) => {
            event.preventDefault()
            onError()
          })
        }}
      >
        <FrameDriver />
        {/* Settle after a few changes instead of re-allocating the framebuffer back and forth */}
        <PerformanceMonitor
          flipflops={3}
          onDecline={() => setDpr(1)}
          onIncline={() => setDpr(Math.min(window.devicePixelRatio, maxDpr))}
          onFallback={() => setDpr(1)}
        />
        <View.Port />
      </Canvas>
    </GLErrorBoundary>
  )
}
