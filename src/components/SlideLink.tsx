import { type MouseEvent } from 'react'
import { Link, useLocation, useNavigate, type LinkProps } from 'react-router'
import { startSlide, type NavDirection } from '../lib/page-transition'

type SlideLinkProps = LinkProps & {
  direction?: NavDirection
}

export function SlideLink({ direction = 'forward', onClick, to, ...props }: SlideLinkProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const path = typeof to === 'string' ? to : (to.pathname ?? location.pathname)

  return (
    <Link
      {...props}
      to={to}
      data-nav={direction}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event)
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          path === location.pathname
        ) {
          return
        }
        event.preventDefault()
        startSlide(direction, () => navigate(path))
      }}
    />
  )
}
