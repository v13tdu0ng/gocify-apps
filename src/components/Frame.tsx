import { useEffect, useRef, useState, type ReactNode } from 'react'
import logo from '../assets/gocify-logo.png'
import { SlideLink } from './SlideLink'
import { copy, type Lang } from '../lib/i18n'

const BOARD_SWAP_MS = 300

type FrameProps = {
  lang: Lang
  onLangChange: (lang: Lang) => void
  children: ReactNode
}

function motionOff(): boolean {
  if (typeof window.matchMedia !== 'function') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function Frame({ lang, onLangChange, children }: FrameProps) {
  const t = copy[lang]
  const shownLang = useRef(lang)
  const childrenRef = useRef(children)
  childrenRef.current = children
  const [board, setBoard] = useState(children)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    if (!collapsed && lang === shownLang.current) setBoard(children)
  }, [children, lang, collapsed])

  useEffect(() => {
    if (lang === shownLang.current) {
      setCollapsed(false)
      return
    }

    if (motionOff()) {
      shownLang.current = lang
      setBoard(childrenRef.current)
      setCollapsed(false)
      return
    }

    setCollapsed(true)
    const id = window.setTimeout(() => {
      shownLang.current = lang
      setBoard(childrenRef.current)
      setCollapsed(false)
    }, BOARD_SWAP_MS)

    return () => window.clearTimeout(id)
  }, [lang])

  return (
    <div className="page">
      <div className="shell">
        <header className="topbar">
          <SlideLink className="brand" to="/">
            <img className="brand-logo" src={logo} alt="GOCIFY" />
          </SlideLink>
          <nav className="top-actions">
            <div className="langs" role="group" aria-label={t.language} data-lang={lang}>
              <button type="button" aria-pressed={lang === 'vi'} onClick={() => onLangChange('vi')}>
                VI
              </button>
              <button type="button" aria-pressed={lang === 'en'} onClick={() => onLangChange('en')}>
                EN
              </button>
            </div>
          </nav>
        </header>
        <div className={collapsed ? 'board is-collapsed' : 'board'} aria-busy={collapsed}>
          <div className="board-clip">
            <div className="board-inner">
              <div className="board-pad">{board}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
