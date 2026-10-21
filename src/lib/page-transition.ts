import { flushSync } from 'react-dom'

const directionKey = 'nav-direction'

export type NavDirection = 'forward' | 'back'

type SlideTransition = {
  types?: { add: (type: string) => void }
}

type SlideDocument = Document & {
  startViewTransition?: (callback: () => void) => SlideTransition
}

function rememberDirection(direction: NavDirection) {
  try {
    sessionStorage.setItem(directionKey, direction)
  } catch {
    // Private mode can block storage. The click still navigates.
  }
}

function storedDirection(): NavDirection {
  try {
    return sessionStorage.getItem(directionKey) === 'back' ? 'back' : 'forward'
  } catch {
    return 'forward'
  }
}

export function startSlide(direction: NavDirection, update: () => void) {
  rememberDirection(direction)
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const start = (document as SlideDocument).startViewTransition
  if (reduced || !start) {
    update()
    return
  }
  const transition = start.call(document, () => {
    flushSync(update)
  })
  transition.types?.add(direction)
}

export function installPageTransitions() {
  document.addEventListener(
    'click',
    (event) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const link = target.closest('a[href]')
      if (!(link instanceof HTMLAnchorElement) || link.target === '_blank') return
      let url: URL
      try {
        url = new URL(link.href, location.href)
      } catch {
        return
      }
      if (url.origin !== location.origin) return
      rememberDirection(link.getAttribute('data-nav') === 'back' ? 'back' : 'forward')
    },
    true,
  )

  const tag = (event: Event) => {
    const transition = (event as Event & { viewTransition?: SlideTransition | null }).viewTransition
    if (!transition) return
    transition.types?.add(storedDirection())
  }

  window.addEventListener('pageswap', tag)
  window.addEventListener('pagereveal', tag)
}
