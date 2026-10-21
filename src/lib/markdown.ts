import { marked } from 'marked'

export function renderMarkdown(source: string): string {
  const escaped = source.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return marked.parse(escaped, { async: false })
}
