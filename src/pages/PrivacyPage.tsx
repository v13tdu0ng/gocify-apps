import { SlideLink } from '../components/SlideLink'
import { Frame } from '../components/Frame'
import { Retype, RetypeHtml } from '../components/Retype'
import { formatPolicyDate, type StoreApp } from '../lib/apps'
import { copy, pickText, type Lang } from '../lib/i18n'
import { renderMarkdown } from '../lib/markdown'

type Status = 'loading' | 'error' | 'ready'

type PrivacyPageProps = {
  lang: Lang
  onLangChange: (lang: Lang) => void
  status: Status
  app: StoreApp | null
}

export function PrivacyPage({ lang, onLangChange, status, app }: PrivacyPageProps) {
  const t = copy[lang]

  if (status !== 'ready') {
    return (
      <Frame lang={lang} onLangChange={onLangChange}>
        <p className={status === 'error' ? 'banner banner-error' : 'banner'} role={status === 'error' ? 'alert' : 'status'}>
          <Retype text={status === 'error' ? t.error : t.loading} />
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

  const policy = pickText(lang, app.privacyVi, app.privacyEn)

  return (
    <Frame lang={lang} onLangChange={onLangChange}>
      <SlideLink className="back" to={`/${app.slug}`} direction="back">
        {app.name}
      </SlideLink>
      <h1>Privacy Policy — {app.name}</h1>
      <p className="meta">
        <Retype text={`${t.updated}: ${formatPolicyDate(app.policyUpdatedOn)}`} />
      </p>
      <RetypeHtml className="prose" html={renderMarkdown(policy)} />
    </Frame>
  )
}
