import { Monogram } from '../../components/ui/Monogram'
import type { DisciplineId } from '../../data/expertise'

interface Props {
  id: DisciplineId
  active: boolean
}

/**
 * Stylised, decorative previews — one visual language per discipline.
 * All motion is tied to the `active` state (hover / focus / selection).
 */
export function DisciplinePreview({ id, active }: Props) {
  return (
    <div
      data-active={active}
      aria-hidden="true"
      className="group/p relative aspect-[4/3] w-full overflow-hidden bg-paper [container-type:inline-size] [perspective:1200px]"
    >
      {id === 'graphic' && <Posters />}
      {id === 'photography' && <Prints />}
      {id === 'video' && <VideoFrame />}
      {id === 'branding' && <BrandBox />}
      {id === 'digital' && <Screens />}
    </div>
  )
}

const ease = 'transition-transform duration-[900ms] ease-[var(--ease-editorial)]'

function Posters() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      {[
        { bg: 'bg-accent-soft', rot: 'group-data-[active=true]/p:-rotate-12 group-data-[active=true]/p:-translate-x-[46%]', shape: 'rounded-full bg-ink size-[45%]' },
        { bg: 'bg-accent-mist', rot: 'group-data-[active=true]/p:rotate-12 group-data-[active=true]/p:translate-x-[46%]', shape: 'bg-accent h-[30%] w-[70%]' },
        { bg: 'bg-accent', rot: 'group-data-[active=true]/p:-translate-y-[4%]', shape: 'rounded-t-full bg-canvas size-[55%]' },
      ].map((p, i) => (
        <div
          key={i}
          className={`${ease} ${p.bg} ${p.rot} absolute flex aspect-[3/4] h-[72%] flex-col justify-between p-[5%] shadow-[0_24px_40px_-24px_rgba(0,0,0,0.5)]`}
        >
          <span className="h-[3%] w-1/2 bg-ink" />
          <span className={`${p.shape} self-center`} />
          <span className="space-y-[6%]">
            <span className="block h-[3%] min-h-1 w-full bg-ink/70" />
            <span className="block h-[3%] min-h-1 w-2/3 bg-ink/70" />
          </span>
        </div>
      ))}
    </div>
  )
}

function Prints() {
  return (
    <div className="absolute inset-0 grid place-items-center [transform-style:preserve-3d]">
      <div className={`${ease} absolute aspect-[4/3] h-[56%] translate-x-[14%] -translate-y-[10%] rotate-6 bg-white p-[2.5%] shadow-lg group-data-[active=true]/p:translate-x-[26%] group-data-[active=true]/p:rotate-12`}>
        <div className="size-full bg-[linear-gradient(160deg,var(--color-accent-mist),var(--color-accent-deep))]" />
      </div>
      <div
        className={`${ease} relative aspect-[4/3] h-[62%] -translate-x-[8%] bg-white p-[2.5%] shadow-[0_30px_50px_-28px_rgba(0,0,0,0.6)] group-data-[active=true]/p:[transform:rotateX(14deg)_rotateY(-18deg)_translateZ(40px)]`}
      >
        <div className="relative size-full overflow-hidden bg-[linear-gradient(180deg,var(--color-accent-soft)_0%,var(--color-accent)_50%,var(--color-accent-deep)_100%)]">
          <span className="absolute bottom-0 left-0 h-[38%] w-full bg-ink/80 [clip-path:polygon(0_60%,22%_20%,40%_55%,62%_0,100%_50%,100%_100%,0_100%)]" />
          <span className="absolute right-[18%] top-[18%] size-[16%] rounded-full bg-canvas/90" />
        </div>
      </div>
    </div>
  )
}

function VideoFrame() {
  return (
    <div className="absolute inset-[12%_8%] flex flex-col gap-[4%]">
      <div className="relative flex-1 overflow-hidden bg-ink">
        <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_30%_60%,color-mix(in_srgb,var(--color-accent-mist)_70%,transparent),transparent),radial-gradient(50%_70%_at_75%_40%,color-mix(in_srgb,var(--color-accent)_80%,transparent),transparent)] transition-transform duration-[4s] ease-linear group-data-[active=true]/p:scale-125" />
        <span className="absolute left-1/2 top-1/2 grid size-[18%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-canvas/90">
          <span className="ml-[12%] h-0 w-0 border-y-[0.5rem] border-l-[0.85rem] border-y-transparent border-l-ink" />
        </span>
        <span className="absolute left-[4%] top-[6%] flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-accent group-data-[active=true]/p:animate-pulse" />
        </span>
      </div>
      <div className="relative h-1.5 bg-ink/15">
        <span className="absolute inset-y-0 left-0 w-[12%] bg-accent transition-[width] duration-[5s] ease-linear group-data-[active=true]/p:w-[88%]" />
      </div>
      <div className="flex gap-[2%]">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className={`h-6 flex-1 ${['bg-accent-soft', 'bg-accent-mist', 'bg-ink/80', 'bg-accent/80', 'bg-accent-soft'][i]}`} />
        ))}
      </div>
    </div>
  )
}

function BrandBox() {
  const face = 'absolute inset-0 grid place-items-center border border-ink/10'
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="relative size-[30cqw] [--half:15cqw] [transform-style:preserve-3d] [transform:rotateX(-18deg)_rotateY(32deg)] group-data-[active=true]/p:animate-[spin3d_7s_linear_infinite]">
        <div className={`${face} bg-accent-mist [transform:translateZ(var(--half))]`}>
          <Monogram className="w-1/2 text-ink" />
        </div>
        <div className={`${face} bg-accent [transform:rotateY(90deg)_translateZ(var(--half))]`} />
        <div className={`${face} bg-accent-soft [transform:rotateY(180deg)_translateZ(var(--half))]`}>
          <span className="font-display text-sm font-semibold">Luana Costa</span>
        </div>
        <div className={`${face} bg-ink [transform:rotateY(-90deg)_translateZ(var(--half))]`} />
        <div className={`${face} bg-canvas [transform:rotateX(90deg)_translateZ(var(--half))]`} />
        <div className={`${face} bg-canvas [transform:rotateX(-90deg)_translateZ(var(--half))]`} />
      </div>
      <div className="absolute bottom-[10%] left-[8%] flex gap-2">
        {['bg-ink', 'bg-accent-mist', 'bg-accent', 'bg-accent-soft'].map((c) => (
          <span key={c} className={`size-5 rounded-full ${c} ring-1 ring-ink/10`} />
        ))}
      </div>
    </div>
  )
}

function Screens() {
  const bar = 'block h-2 rounded-full bg-ink/15'
  return (
    <div className="absolute inset-0">
      <div className={`${ease} absolute left-[8%] top-[14%] h-[66%] w-[70%] overflow-hidden rounded-md bg-white shadow-[0_24px_50px_-28px_rgba(0,0,0,0.55)] group-data-[active=true]/p:-translate-x-[4%]`}>
        <div className="flex h-[10%] items-center gap-1.5 border-b border-ink/10 px-[3%]">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-1.5 rounded-full bg-ink/25" />
          ))}
        </div>
        <div className="grid h-[90%] grid-cols-5 gap-[4%] p-[5%]">
          <div className="col-span-3 space-y-[8%]">
            <span className="block h-[34%] bg-accent-mist" />
            <span className={`${bar} w-full`} />
            <span className={`${bar} w-4/5`} />
            <span className={`${bar} w-3/5`} />
          </div>
          <div className="col-span-2 space-y-[10%]">
            <span className="block aspect-square bg-accent/80" />
            <span className={`${bar} w-full`} />
          </div>
        </div>
      </div>
      <div className={`${ease} absolute bottom-[10%] right-[10%] h-[64%] w-[22%] overflow-hidden rounded-xl border-4 border-ink bg-white shadow-xl group-data-[active=true]/p:-translate-y-[8%] group-data-[active=true]/p:translate-x-[10%]`}>
        <div className="space-y-[10%] p-[10%]">
          <span className="block aspect-[4/3] bg-accent-soft" />
          <span className={`${bar} w-full`} />
          <span className={`${bar} w-2/3`} />
          <span className="block aspect-[4/3] bg-accent-mist" />
        </div>
      </div>
    </div>
  )
}
