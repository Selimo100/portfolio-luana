import { Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { useGL } from './GLContext'
import { viewRegistry } from '../../lib/sceneState'

interface Props {
  className?: string
  /** Lazily loaded scene component that renders a drei <View> */
  children: ReactNode
  /** Rendered when WebGL is unavailable */
  fallback?: ReactNode
  /** Margin around the viewport in which the view counts as visible (keeps the render loop awake) */
  rootMargin?: string
}

/** Scenes are mounted well before they scroll into view, so loading and shader compilation don't hitch the scroll. */
const MOUNT_MARGIN = '150% 0px'

/**
 * Reserves an area of the page for a WebGL view.
 * The scene mounts once it comes near and then stays mounted — remounting would
 * recompile shaders and re-upload textures, which stalls scrolling every time.
 * drei skips views that are off screen, and the shared render loop sleeps when
 * no view is visible.
 */
export function SceneView({ className, children, fallback = null, rootMargin = '20% 0px' }: Props) {
  const { enabled } = useGL()
  const ref = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || !enabled || mounted) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setMounted(true)
      },
      { rootMargin: MOUNT_MARGIN },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [enabled, mounted])

  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin })
    observer.observe(el)
    return () => observer.disconnect()
  }, [enabled, rootMargin])

  const active = enabled && mounted && visible
  useEffect(() => {
    if (!active) return
    viewRegistry.add()
    return () => viewRegistry.remove()
  }, [active])

  return (
    <div ref={ref} className={className} aria-hidden="true">
      {enabled ? mounted && <Suspense fallback={null}>{children}</Suspense> : fallback}
    </div>
  )
}
