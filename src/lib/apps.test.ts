import { describe, expect, test } from 'vitest'
import {
  filterSafeSlugs,
  formatPolicyDate,
  isSupabaseConfigured,
  mapAppRow,
  resolveHomePolicy,
  routeOutputFiles,
  policyTextOrFallback,
  safeHttpUrl,
} from './apps'
import { resolveLang } from './i18n'

const row = {
  slug: 'gba-pocket',
  name: 'GBA Pocket',
  summary_vi: 'Tóm tắt',
  summary_en: 'Summary',
  description_vi: 'Mô tả',
  description_en: 'Description',
  privacy_policy_vi: 'Chính sách',
  privacy_policy_en: 'Policy',
  play_store_url: 'https://play.google.com/store/apps/details?id=com.sopa.gbapocket',
  icon_path: 'icons/gba pocket.png',
  apk_path: 'gba-pocket/latest.apk',
  apk_version: '1.0.0',
  policy_updated_on: '2026-08-11',
  is_home_policy: true,
  app_screenshots: [
    { storage_path: 'shots/b.png', sort_order: 2 },
    { storage_path: 'shots/a.png', sort_order: 1 },
  ],
}

describe('mapAppRow', () => {
  test('builds public file urls and sorts screenshots', () => {
    const app = mapAppRow(row, 'https://example.supabase.co')

    expect(app.slug).toBe('gba-pocket')
    expect(app.iconUrl).toBe(
      'https://example.supabase.co/storage/v1/object/public/app-media/icons/gba%20pocket.png',
    )
    expect(app.apkUrl).toBe(
      'https://example.supabase.co/storage/v1/object/public/app-apks/gba-pocket/latest.apk',
    )
    expect(app.screenshots).toEqual([
      'https://example.supabase.co/storage/v1/object/public/app-media/shots/a.png',
      'https://example.supabase.co/storage/v1/object/public/app-media/shots/b.png',
    ])
    expect(app.playStoreUrl).toBe(row.play_store_url)
    expect(app.policyUpdatedOn).toBe('2026-08-11')
  })

  test('leaves file links empty when storage paths are empty', () => {
    const app = mapAppRow(
      { ...row, icon_path: null, apk_path: null, play_store_url: null, app_screenshots: [] },
      'https://example.supabase.co',
    )

    expect(app.iconUrl).toBeNull()
    expect(app.apkUrl).toBeNull()
    expect(app.playStoreUrl).toBeNull()
    expect(app.screenshots).toEqual([])
  })
})

describe('safeHttpUrl', () => {
  test('rejects non-http links', () => {
    expect(safeHttpUrl('javascript:alert(1)')).toBeNull()
    expect(safeHttpUrl('https://play.google.com/store')).toBe('https://play.google.com/store')
  })
})

describe('resolveHomePolicy', () => {
  test('prefers the published home app, then gba-pocket, then null', () => {
    const home = { slug: 'other', isHomePolicy: true }
    const pocket = { slug: 'gba-pocket', isHomePolicy: false }

    expect(resolveHomePolicy([pocket, home])?.slug).toBe('other')
    expect(resolveHomePolicy([pocket])?.slug).toBe('gba-pocket')
    expect(resolveHomePolicy([])).toBeNull()
  })
})

describe('formatPolicyDate', () => {
  test('formats a calendar date in UTC', () => {
    expect(formatPolicyDate('2026-08-11')).toBe('August 11, 2026')
  })
})

describe('filterSafeSlugs', () => {
  test('keeps lowercase slugs and drops paths', () => {
    expect(filterSafeSlugs(['gba-pocket', '../evil', 'GBA', 'my app'])).toEqual(['gba-pocket'])
  })
})

describe('routeOutputFiles', () => {
  test('adds a detail page and a privacy page for each slug', () => {
    expect(routeOutputFiles(['gba-pocket'])).toEqual([
      '404.html',
      'gba-pocket/index.html',
      'gba-pocket/privacy-policy/index.html',
    ])
  })
})

describe('policyTextOrFallback', () => {
  test('keeps the bundled policy when the remote text is too short to publish', () => {
    expect(policyTextOrFallback('  ', 'Full policy')).toBe('Full policy')
    expect(policyTextOrFallback('Short', 'Full policy')).toBe('Full policy')
    expect(
      policyTextOrFallback(
        'This privacy policy is long enough to replace the bundled page.',
        'Full policy',
      ),
    ).toBe('This privacy policy is long enough to replace the bundled page.')
  })
})

describe('isSupabaseConfigured', () => {
  test('requires both url and anon key', () => {
    expect(isSupabaseConfigured('', 'key')).toBe(false)
    expect(isSupabaseConfigured('https://example.supabase.co', 'key')).toBe(true)
  })
})

describe('resolveLang', () => {
  test('uses Vietnamese in Vietnam and English elsewhere when nothing is saved', () => {
    expect(resolveLang(null, 'Asia/Ho_Chi_Minh')).toBe('vi')
    expect(resolveLang(null, 'Asia/Saigon')).toBe('vi')
    expect(resolveLang(null, 'America/New_York')).toBe('en')
  })

  test('keeps a language the visitor already chose', () => {
    expect(resolveLang('en', 'Asia/Ho_Chi_Minh')).toBe('en')
    expect(resolveLang('vi', 'Europe/Paris')).toBe('vi')
  })
})
