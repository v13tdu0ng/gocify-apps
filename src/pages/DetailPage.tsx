import { SlideLink } from '../components/SlideLink'
import playLogo from '../assets/play-store.png'
import { AppIcon } from '../components/AppIcon'
import { Frame } from '../components/Frame'
import { Retype, RetypeHtml } from '../components/Retype'
import { formatPolicyDate, type StoreApp } from '../lib/apps'
import { gbaPocketPlayUrl } from '../lib/fallback'
import { copy, pickText, type Lang } from '../lib/i18n'
import { renderMarkdown } from '../lib/markdown'
import { SITE_BASE } from '../lib/site'

type Status = 'loading' | 'error' | 'ready'

type DetailPageProps = {
  lang: Lang
  onLangChange: (lang: Lang) => void
  status: Status
  app: StoreApp | null
}

export function DetailPage({ lang, onLangChange, status, app }: DetailPageProps) {
  const t = copy[lang]

  if (status === 'loading') {
    return (
      <Frame lang={lang} onLangChange={onLangChange}>
        <p className="banner" role="status">
          <Retype text={t.loading} />
        </p>
      </Frame>
    )
  }

  if (status === 'error') {
    return (
      <Frame lang={lang} onLangChange={onLangChange}>
        <p className="banner banner-error" role="alert">
          <Retype text={t.error} />
        </p>
      </Frame>
    )
  }

  if (!app) {
    return (
      <Frame lang={lang} onLangChange={onLangChange}>
        <h1>
          <Retype text={t.notFound} />
        </h1>
        <SlideLink className="sticker" to="/" direction="back">
          <Retype text={t.back} />
        </SlideLink>
      </Frame>
    )
  }

  const summary = pickText(lang, app.summaryVi, app.summaryEn)
  const description = pickText(lang, app.descriptionVi, app.descriptionEn)
  const playHref = app.slug === 'gba-pocket' ? app.playStoreUrl || gbaPocketPlayUrl : null

  return (
    <Frame lang={lang} onLangChange={onLangChange}>
      <SlideLink className="back" to="/" direction="back">
        <Retype text={t.back} />
      </SlideLink>
      <article className="detail">
        <AppIcon name={app.name} url={app.iconUrl} size="lg" />
        <div className="detail-copy">
          <h1>{app.name}</h1>
          <p className="lead">
            <Retype text={summary} />
          </p>
          {app.apkVersion && (
            <p className="pill">
              <Retype text={`${t.version} ${app.apkVersion}`} />
            </p>
          )}
          <div className="actions">
            {playHref ? (
              <a className="sticker sticker-play" href={playHref} target="_blank" rel="noreferrer">
                <img src={playLogo} alt="" />
                <Retype text={t.playDownload} />
              </a>
            ) : app.apkUrl ? (
              <a className="sticker sticker-yellow" href={app.apkUrl}>
                <Retype text={t.download} />
              </a>
            ) : (
              <button type="button" className="sticker sticker-yellow" disabled>
                <Retype text={t.download} />
              </button>
            )}
            {!playHref && app.playStoreUrl && (
              <a className="sticker sticker-teal" href={app.playStoreUrl} rel="noreferrer">
                <Retype text={t.playStore} />
              </a>
            )}
            <a className="sticker sticker-pink" href={`${SITE_BASE}/${app.slug}/privacy-policy/`}>
              <Retype text={t.privacyLong} />
            </a>
          </div>
          {!playHref && !app.apkUrl && (
            <p className="hint">
              <Retype text={t.noApk} />
            </p>
          )}
          <p className="meta">
            <Retype text={`${t.updated}: ${formatPolicyDate(app.policyUpdatedOn)}`} />
          </p>
        </div>
      </article>

      {app.screenshots.length > 0 && (
        <ul className="shots">
          {app.screenshots.map((src, index) => (
            <li key={src}>
              <img src={src} alt={`${app.name} screenshot ${index + 1}`} />
            </li>
          ))}
        </ul>
      )}

      <RetypeHtml className="prose" html={renderMarkdown(description)} />
    </Frame>
  )
}
