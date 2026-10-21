import { useEffect, useState } from 'react'
import { Route, Routes, useParams } from 'react-router'
import { createClient } from '@supabase/supabase-js'
import { isSupabaseConfigured, mapAppRow, type AppRow, type StoreApp } from './lib/apps'
import { bundledApps } from './lib/fallback'
import { resolveLang, type Lang } from './lib/i18n'
import { CatalogPage } from './pages/CatalogPage'
import { DetailPage } from './pages/DetailPage'
import { PrivacyPage } from './pages/PrivacyPage'

type Status = 'loading' | 'error' | 'ready'

function rememberLang(lang: Lang) {
  localStorage.setItem('lang', lang)
}

export function App() {
  const [lang, setLang] = useState<Lang>(() =>
    resolveLang(localStorage.getItem('lang'), Intl.DateTimeFormat().resolvedOptions().timeZone),
  )
  const [status, setStatus] = useState<Status>('loading')
  const [apps, setApps] = useState<StoreApp[]>([])

  function onLangChange(next: Lang) {
    rememberLang(next)
    setLang(next)
  }

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches) return

    const onMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 14
      const y = (event.clientY / window.innerHeight - 0.5) * 14
      document.documentElement.style.setProperty('--wallpaper-x', `${x.toFixed(1)}px`)
      document.documentElement.style.setProperty('--wallpaper-y', `${y.toFixed(1)}px`)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useEffect(() => {
    const url = import.meta.env.VITE_SUPABASE_URL
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY
    if (!isSupabaseConfigured(url, key)) {
      setApps(bundledApps())
      setStatus('ready')
      return
    }

    const client = createClient(url, key)
    client
      .from('apps')
      .select(
        'slug,name,summary_vi,summary_en,description_vi,description_en,privacy_policy_vi,privacy_policy_en,play_store_url,icon_path,apk_path,apk_version,policy_updated_on,is_home_policy,app_screenshots(storage_path,sort_order)',
      )
      .eq('is_published', true)
      .order('sort_order')
      .then(({ data, error }) => {
        if (error || !data) {
          setStatus('error')
          return
        }
        setApps((data as AppRow[]).map((row) => mapAppRow(row, url)))
        setStatus('ready')
      })
  }, [])

  return (
    <Routes>
      <Route path="/" element={<CatalogPage lang={lang} onLangChange={onLangChange} apps={apps} status={status} />} />
      <Route path="/:slug" element={<AppRoute lang={lang} onLangChange={onLangChange} apps={apps} status={status} page="detail" />} />
      <Route
        path="/:slug/privacy"
        element={<AppRoute lang={lang} onLangChange={onLangChange} apps={apps} status={status} page="privacy" />}
      />
    </Routes>
  )
}

function AppRoute({
  lang,
  onLangChange,
  apps,
  status,
  page,
}: {
  lang: Lang
  onLangChange: (lang: Lang) => void
  apps: StoreApp[]
  status: Status
  page: 'detail' | 'privacy'
}) {
  const { slug } = useParams()
  const app = status === 'ready' ? (apps.find((item) => item.slug === slug) ?? null) : null
  if (page === 'privacy') {
    return <PrivacyPage lang={lang} onLangChange={onLangChange} status={status} app={app} />
  }
  return <DetailPage lang={lang} onLangChange={onLangChange} status={status} app={app} />
}
