interface Props {
  className?: string
  title?: string
}

/** LC monogram: an L drawn through an open C, like a ribbon passing through a loop. */
export function Monogram({ className, title }: Props) {
  return (
    <svg viewBox="0 0 48 48" className={className} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <path d="M35.5 15.2A14 14 0 1 0 35.5 32.8" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M19.5 9.5V36.5H31" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="35.6" cy="15.2" r="2.6" fill="var(--color-accent)" />
    </svg>
  )
}
