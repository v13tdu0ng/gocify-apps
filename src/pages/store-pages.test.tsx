import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState, type ReactNode } from 'react'
import { MemoryRouter } from 'react-router'
import { describe, expect, test } from 'vitest'
import type { StoreApp } from '../lib/apps'
import { gbaPocketPlayUrl } from '../lib/fallback'
import type { Lang } from '../lib/i18n'
import { CatalogPage } from './CatalogPage'
import { DetailPage } from './DetailPage'
import { PrivacyPage } from './PrivacyPage'

const app: StoreApp = {
  slug: 'gba-pocket',
  name: 'GBA Pocket',
  summaryVi: 'Tóm tắt tiếng Việt',
  summaryEn: 'English summary',
  descriptionVi: 'Mô tả tiếng Việt',
  descriptionEn: 'English description',
  privacyVi: 'Chính sách tiếng Việt',
  privacyEn: 'English policy body',
  playStoreUrl: 'https://play.google.com/store/apps/details?id=com.sopa.gbapocket',
  iconUrl: null,
  apkUrl: 'https://example.supabase.co/storage/v1/object/public/app-apks/gba-pocket/latest.apk',
  apkVersion: '1.2.0',
  policyUpdatedOn: '2026-08-11',
  screenshots: ['https://example.supabase.co/shot.png'],
  isHomePolicy: true,
}

function renderAt(ui: ReactNode) {
  return render(
    <MemoryRouter initialEntries={['/']}>
      {ui}
    </MemoryRouter>,
  )
}

describe('CatalogPage', () => {
  test('links the app card into the store', () => {
    renderAt(<CatalogPage lang="en" onLangChange={() => {}} apps={[app]} status="ready" />)

    expect(screen.getByRole('link', { name: /GBA Pocket/ })).toHaveAttribute(
      'href',
      '/gba-pocket',
    )
    expect(screen.getByText('English summary')).toBeInTheDocument()
  })

  test('switches the visible summary to Vietnamese', async () => {
    function Harness() {
      const [lang, setLang] = useState<Lang>('en')
      return <CatalogPage lang={lang} onLangChange={setLang} apps={[app]} status="ready" />
    }

    renderAt(<Harness />)
    await userEvent.click(screen.getByRole('button', { name: 'VI' }))

    expect(screen.getByRole('group', { name: 'Ngôn ngữ' })).toHaveAttribute('data-lang', 'vi')
    expect(screen.getByText('English summary')).toBeInTheDocument()
    expect(document.querySelector('.board')).toHaveClass('is-collapsed')
    expect(await screen.findByText('Tóm tắt tiếng Việt', {}, { timeout: 2000 })).toBeInTheDocument()
    expect(document.querySelector('.board')).not.toHaveClass('is-collapsed')
  })
})

describe('DetailPage', () => {
  test('links the latest apk and the Play Store listing', () => {
    renderAt(
      <DetailPage
        lang="en"
        onLangChange={() => {}}
        status="ready"
        app={{ ...app, slug: 'field-notes' }}
      />,
    )

    expect(screen.getByRole('link', { name: 'Download' })).toHaveAttribute('href', app.apkUrl)
    expect(screen.getByRole('link', { name: 'Play Store' })).toHaveAttribute('href', app.playStoreUrl)
    expect(screen.getByRole('img', { name: 'GBA Pocket screenshot 1' })).toBeInTheDocument()
  })

  test('replaces the apk download with Google Play for GBA Pocket', () => {
    renderAt(
      <DetailPage
        lang="en"
        onLangChange={() => {}}
        status="ready"
        app={{ ...app, apkUrl: null, playStoreUrl: null }}
      />,
    )

    expect(screen.getByRole('link', { name: 'Download on Google Play' })).toHaveAttribute(
      'href',
      gbaPocketPlayUrl,
    )
    expect(screen.getByRole('link', { name: 'Download on Google Play' })).toHaveAttribute(
      'target',
      '_blank',
    )
    expect(screen.queryByRole('link', { name: 'Download' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Download' })).not.toBeInTheDocument()
    expect(screen.queryByText('No install file yet.')).not.toBeInTheDocument()
  })

  test('shows a disabled download sticker when the app has no apk', () => {
    renderAt(
      <DetailPage
        lang="vi"
        onLangChange={() => {}}
        status="ready"
        app={{ ...app, slug: 'field-notes', apkUrl: null, playStoreUrl: null, screenshots: [] }}
      />,
    )

    expect(screen.getByRole('button', { name: 'Tải về' })).toBeDisabled()
    expect(screen.queryByRole('link', { name: 'Play Store' })).not.toBeInTheDocument()
  })
})

describe('PrivacyPage', () => {
  test('shows the policy language that is selected', () => {
    renderAt(<PrivacyPage lang="en" onLangChange={() => {}} status="ready" app={app} />)

    expect(screen.getByText('English policy body')).toBeInTheDocument()
    expect(screen.queryByText('Chính sách tiếng Việt')).not.toBeInTheDocument()
  })
})
