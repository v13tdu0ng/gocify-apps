import { readFileSync } from 'node:fs'
import { describe, expect, test } from 'vitest'
import { renderHomePolicyHtml } from './render-policy'

describe('renderHomePolicyHtml', () => {
  test('prints both languages, the app name, and a link to the store', () => {
    const html = renderHomePolicyHtml({
      appName: 'GBA Pocket',
      updatedOn: 'August 11, 2026',
      enMarkdown: 'English policy for **GBA Pocket**.',
      viMarkdown: 'Chính sách tiếng Việt.',
      appsHref: '/gocify-apps/',
      cssHref: '/gocify-apps/assets/policy.css',
      logoHref: '/gocify-apps/assets/gocify-logo.png',
      faviconHref: '/gocify-apps/favicon.png',
    })

    expect(html).toContain('Privacy Policy — GBA Pocket')
    expect(html).toContain('Chính sách quyền riêng tư — GBA Pocket')
    expect(html).toContain('August 11, 2026')
    expect(html).toContain('<section id="policy-en" lang="en">')
    expect(html).toContain('<section id="policy-vi" lang="vi">')
    expect(html).toContain('<strong>GBA Pocket</strong>')
    expect(html).toContain('Chính sách tiếng Việt.')
    expect(html).toContain('href="/gocify-apps/"')
    expect(html).toContain('href="/gocify-apps/assets/policy.css"')
    expect(html).toContain('class="topbar"')
    expect(html).toContain('alt="GOCIFY"')
    expect(html).toContain('src="/gocify-apps/assets/gocify-logo.png"')
    expect(html).toContain('href="/gocify-apps/favicon.png"')
    expect(html).toContain('>VI</button>')
    expect(html).toContain('>EN</button>')
  })
})

describe('bundled GBA Pocket policy', () => {
  test('keeps the contact email and package name from the Play policy', () => {
    const en = readFileSync('content/home-policy.en.md', 'utf8')
    const vi = readFileSync('content/home-policy.vi.md', 'utf8')

    const headings = (text: string) => text.match(/^## /gm)?.length ?? 0

    expect(en).toContain('code.with.dobby@gmail.com')
    expect(en).toContain('com.sopa.gbapocket')
    expect(vi).toContain('GBA Pocket')
    expect(vi).toContain('code.with.dobby@gmail.com')
    expect(vi).toContain('com.sopa.gbapocket')
    expect(headings(en)).toBe(11)
    expect(headings(vi)).toBe(headings(en))
  })
})
