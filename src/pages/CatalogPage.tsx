import { AppIcon } from '../components/AppIcon'
import { Frame } from '../components/Frame'
import { Retype } from '../components/Retype'
import { SlideLink } from '../components/SlideLink'
import type { StoreApp } from '../lib/apps'
import { copy, pickText, type Lang } from '../lib/i18n'

type Status = 'loading' | 'error' | 'ready'

type CatalogPageProps = {
  lang: Lang
  onLangChange: (lang: Lang) => void
  apps: StoreApp[]
  status: Status
}

const tones = ['tone-0', 'tone-1', 'tone-2', 'tone-3', 'tone-4']

export function CatalogPage({ lang, onLangChange, apps, status }: CatalogPageProps) {
  const t = copy[lang]

  return (
    <Frame lang={lang} onLangChange={onLangChange}>
      <section className="hero">
        <h1>
          <Retype text={t.catalogTitle} />
        </h1>
        <p className="badge">
          <Retype text={t.badge} />
        </p>
      </section>

      {status === 'loading' && (
        <p className="banner" role="status">
          <Retype text={t.loading} />
        </p>
      )}
      {status === 'error' && (
        <p className="banner banner-error" role="alert">
          <Retype text={t.error} />
        </p>
      )}
      {status === 'ready' && apps.length === 0 && (
        <p className="banner">
          <Retype text={t.empty} />
        </p>
      )}
      {status === 'ready' && apps.length > 0 && (
        <ul className="cards">
          {apps.map((app, index) => (
            <li key={app.slug}>
              <SlideLink
                className={`card ${tones[index % tones.length]}${app.slug === 'gba-pocket' ? ' card-gba' : ''}`}
                to={`/${app.slug}`}
              >
                <AppIcon name={app.name} url={app.iconUrl} />
                <h2>{app.name}</h2>
                <p>
                  <Retype text={pickText(lang, app.summaryVi, app.summaryEn)} />
                </p>
                <span className="sticker">
                  <Retype text={t.open} />
                </span>
              </SlideLink>
            </li>
          ))}
        </ul>
      )}
    </Frame>
  )
}
