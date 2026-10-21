import type { ReactNode } from 'react'
import logo from '../assets/gocify-logo.png'
import { SlideLink } from './SlideLink'
import { copy, type Lang } from '../lib/i18n'

type FrameProps = {
  lang: Lang
  onLangChange: (lang: Lang) => void
  children: ReactNode
}

export function Frame({ lang, onLangChange, children }: FrameProps) {
  const t = copy[lang]

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
        <div className="board">{children}</div>
      </div>
    </div>
  )
}
