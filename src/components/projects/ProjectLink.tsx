import type { MouseEvent, ReactNode, FocusEventHandler } from 'react'
import { Link, useNavigate } from 'react-router'
import { projectPath } from '../../lib/routes'
import { expandImageTransition } from '../../lib/transition'
import { useLanguage } from '../../hooks/useLanguage'
import { prefersReducedMotion } from '../../hooks/useReducedMotion'

interface Props {
  slug: string
  children: ReactNode
  className?: string
  /** Element that contains the image to expand into the project hero */
  transitionFrom?: () => HTMLElement | null
  tabIndex?: number
  'aria-hidden'?: boolean
  'data-cursor'?: string
  onFocus?: FocusEventHandler
  onBlur?: FocusEventHandler
}

/** Link to a project; plain clicks play the image-expand transition first. */
export function ProjectLink({ slug, children, transitionFrom, ...rest }: Props) {
  const lang = useLanguage()
  const navigate = useNavigate()
  const to = projectPath(lang, slug)

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    const source = transitionFrom?.()?.querySelector<HTMLElement>('[data-transition-image]')
    if (!source || prefersReducedMotion()) return
    e.preventDefault()
    expandImageTransition(source, () => navigate(to))
  }

  return (
    <Link to={to} onClick={onClick} {...rest}>
      {children}
    </Link>
  )
}
