import { useTranslation } from 'react-i18next'

/** Small label for example projects — never let demo content pass as real work. */
export function DemoBadge({ className = '' }: { className?: string }) {
  const { t } = useTranslation()
  return (
    <span
      className={`meta inline-flex items-center gap-1.5 rounded-full border border-current px-2.5 py-0.5 ${className}`}
    >
      <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
      {t('work.demo')}
    </span>
  )
}
