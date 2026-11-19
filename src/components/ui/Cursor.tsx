import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useFinePointer } from '../../hooks/useMediaQuery'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/**
 * A small ring that follows the mouse and grows into a label over project images.
 * The system cursor is never hidden; touch devices don't render it at all.
 */
export function Cursor() {
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')
  const [tone, setTone] = useState<'light' | 'dark'>('light')
  const [visible, setVisible] = useState(false)
  const enabled = fine && !reduced

  useEffect(() => {
    const el = ref.current
    if (!enabled || !el) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' })

    let shown = false
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      xTo(e.clientX)
      yTo(e.clientY)
      // Only touch React state when visibility actually changes, not on every mouse move
      if (!shown) {
        shown = true
        setVisible(true)
      }
    }
    const over = (e: PointerEvent) => {
      const target = e.target as Element | null
      const labelled = target?.closest<HTMLElement>('[data-cursor]')
      setLabel(labelled?.dataset.cursor ?? '')
      setTone(target?.closest('[data-tone="dark"]') ? 'dark' : 'light')
    }
    const leave = () => {
      shown = false
      setVisible(false)
    }

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <div
      ref={ref}
      className="cursor"
      data-state={label ? 'label' : 'dot'}
      data-tone={tone}
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden="true"
    >
      <span className="cursor__label">{label}</span>
    </div>
  )
}
