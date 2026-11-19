import { useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useFinePointer } from '../../hooks/useMediaQuery'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface Props {
  children: ReactNode
  strength?: number
  className?: string
}

/**
 * Pulls its child toward the pointer. Purely visual — the child stays a normal,
 * keyboard-focusable link; touch and reduced-motion users get a static element.
 */
export function Magnetic({ children, strength = 0.35, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const enabled = fine && !reduced

  useGSAP(
    () => {
      const el = ref.current
      if (!el || !enabled) return
      const inner = el.firstElementChild as HTMLElement | null
      const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.4)' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.4)' })
      const ixTo = inner ? gsap.quickTo(inner, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.4)' }) : null
      const iyTo = inner ? gsap.quickTo(inner, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.4)' }) : null

      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        const dx = e.clientX - (r.left + r.width / 2)
        const dy = e.clientY - (r.top + r.height / 2)
        xTo(dx * strength)
        yTo(dy * strength)
        ixTo?.(dx * strength * 0.25)
        iyTo?.(dy * strength * 0.25)
      }
      const leave = () => {
        xTo(0)
        yTo(0)
        ixTo?.(0)
        iyTo?.(0)
      }
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerleave', leave)
      return () => {
        el.removeEventListener('pointermove', move)
        el.removeEventListener('pointerleave', leave)
      }
    },
    { dependencies: [enabled, strength], scope: ref },
  )

  return (
    <div ref={ref} className={`inline-block ${className}`}>
      {children}
    </div>
  )
}
