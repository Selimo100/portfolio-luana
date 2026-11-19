/**
 * Static stand-in for the 3D camera when WebGL is unavailable:
 * the same photo camera, drawn as a flat SVG illustration in the studio palette.
 */
export function CameraFallback({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 flex items-center justify-center md:justify-end md:pr-[12vw] ${className}`}>
      <svg viewBox="0 0 420 300" className="w-[80vw] max-w-[36rem] md:w-[40vw]" aria-hidden="true">
        <defs>
          <radialGradient id="fallback-glass" cx="0.38" cy="0.35" r="0.7">
            <stop offset="0" style={{ stopColor: 'var(--color-accent-mist)' }} />
            <stop offset="0.35" style={{ stopColor: 'var(--color-accent-deep)' }} />
            <stop offset="1" style={{ stopColor: 'var(--color-ink)' }} />
          </radialGradient>
        </defs>
        {/* top plate, viewfinder hump, dials */}
        <rect x="150" y="34" width="120" height="50" rx="14" className="fill-canvas" />
        <rect x="296" y="52" width="58" height="22" rx="8" className="fill-accent-soft" />
        <rect x="84" y="48" width="36" height="22" rx="6" className="fill-accent-deep" />
        {/* body */}
        <rect x="40" y="66" width="340" height="200" rx="28" className="fill-accent" />
        <rect x="40" y="66" width="340" height="44" rx="20" className="fill-canvas" />
        <rect x="40" y="132" width="340" height="104" className="fill-ink" />
        <rect x="40" y="96" width="58" height="170" rx="24" className="fill-ink" />
        {/* lens */}
        <circle cx="200" cy="170" r="96" className="fill-canvas" />
        <circle cx="200" cy="170" r="84" className="fill-ink" />
        <circle cx="200" cy="170" r="66" fill="none" className="stroke-accent" strokeWidth="5" />
        <circle cx="200" cy="170" r="58" fill="url(#fallback-glass)" />
        <ellipse cx="178" cy="148" rx="16" ry="10" fill="#ffffff" opacity="0.35" transform="rotate(-30 178 148)" />
      </svg>
    </div>
  )
}
