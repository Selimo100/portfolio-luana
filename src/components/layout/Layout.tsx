import { lazy, Suspense, useEffect, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Nav } from '../navigation/Nav'
import { Cursor } from '../ui/Cursor'
import { ScrollManager } from './ScrollManager'
import { GLProvider, useGL } from '../three/GLContext'
import { useSmoothScroll } from '../../hooks/useSmoothScroll'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { pointer } from '../../lib/sceneState'

const GLCanvas = lazy(() => import('../three/GLCanvas'))

function GLLayer() {
  const { enabled, disable } = useGL()
  if (!enabled) return null
  return (
    <Suspense fallback={null}>
      <GLCanvas onError={disable} />
    </Suspense>
  )
}

function usePointerTracking() {
  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (e.pointerType === 'touch') {
        pointer.active = false
        return
      }
      pointer.active = true
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])
}

export function Layout({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  const reduced = useReducedMotion()
  useSmoothScroll(!reduced)
  usePointerTracking()

  return (
    <GLProvider>
      <a
        href="#main"
        className="fixed left-4 top-4 z-[70] -translate-y-24 rounded-full bg-ink px-5 py-3 font-semibold text-canvas transition-transform focus:translate-y-0"
      >
        {t('a11y.skip')}
      </a>
      <ScrollManager />
      <Nav />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Cursor />
      <GLLayer />
    </GLProvider>
  )
}
