import { describe, expect, test } from 'vitest'
import { renderMarkdown } from './markdown'

describe('renderMarkdown', () => {
  test('renders emphasis and links', () => {
    const html = renderMarkdown('See **GBA Pocket** at [email](mailto:code.with.dobby@gmail.com).')

    expect(html).toContain('<strong>GBA Pocket</strong>')
    expect(html).toContain('href="mailto:code.with.dobby@gmail.com"')
  })

  test('keeps pasted script tags as text', () => {
    const html = renderMarkdown('Hello <script>alert(1)</script>')

    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;')
  })
})
