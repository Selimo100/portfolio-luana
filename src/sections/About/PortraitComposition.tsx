import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Monogram } from '../../components/ui/Monogram'
import { profile } from '../../data/profile'
import { useFinePointer } from '../../hooks/useMediaQuery'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/**
 * A layered editorial portrait: paper, colour fields and a sticker that shift
 * at different depths under the pointer, like a collage on a desk.
 * Shows a designed placeholder until `profile.portrait` is set.
 */
export function PortraitComposition() {
  const { t } = useTranslation()
  const root = useRef<HTMLDivElement>(null)
  const fine = useFinePointer()
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      const el = root.current
      if (!el || !fine || reduced) return
      const layers = [...el.querySelectorAll<HTMLElement>('[data-depth]')].map((layer) => ({
        depth: Number(layer.dataset.depth),
        x: gsap.quickTo(layer, 'x', { duration: 1.1, ease: 'power3.out' }),
        y: gsap.quickTo(layer, 'y', { duration: 1.1, ease: 'power3.out' }),
        r: gsap.quickTo(layer, 'rotation', { duration: 1.4, ease: 'power3.out' }),
      }))
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        const nx = (e.clientX - r.left) / r.width - 0.5
        const ny = (e.clientY - r.top) / r.height - 0.5
        for (const l of layers) {
          l.x(nx * 28 * l.depth)
          l.y(ny * 28 * l.depth)
          l.r(nx * 3 * l.depth)
        }
      }
      const leave = () => layers.forEach((l) => (l.x(0), l.y(0), l.r(0)))
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerleave', leave)
      return () => {
        el.removeEventListener('pointermove', move)
        el.removeEventListener('pointerleave', leave)
      }
    },
    { scope: root, dependencies: [fine, reduced] },
  )

  return (
    <div ref={root} className="relative mx-auto aspect-[4/5] w-[86%] md:w-full">
      <div data-depth="0.35" aria-hidden="true" className="absolute -left-[7%] top-[9%] h-[78%] w-[70%] bg-accent-soft" />
      <div data-depth="0.7" aria-hidden="true" className="absolute -right-[6%] -top-[4%] size-[34%] rounded-full bg-accent-deep" />

      <figure data-depth="0.15" className="absolute inset-[6%_4%_4%_10%] overflow-hidden bg-paper shadow-[0_30px_60px_-30px_rgba(0,0,0,0.3)]">
        {profile.portrait ? (
          <img src={profile.portrait} alt={t('about.portraitAlt')} loading="lazy" className="size-full object-cover" />
        ) : (
          <div role="img" aria-label={t('about.portraitAlt')} className="flex size-full flex-col items-center justify-center gap-5 text-ink">
            <Monogram className="w-1/3 opacity-90" />
            <span className="meta text-muted-strong">{t('about.portraitPlaceholder')}</span>
          </div>
        )}
      </figure>

      <div
        data-depth="1"
        aria-hidden="true"
        className="absolute -bottom-[5%] right-[2%] grid size-[30%] rotate-[-8deg] place-items-center rounded-full bg-accent text-white"
      >
        <span className="text-center font-display text-[clamp(0.9rem,1.6vw,1.2rem)] font-semibold leading-tight whitespace-pre-line" style={{ fontStretch: '80%' }}>
          {t('about.sticker')}
        </span>
      </div>
    </div>
  )
}
