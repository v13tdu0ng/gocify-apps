import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SITE_BASE } from '../src/lib/site.ts'

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..', 'dist')
const port = 4173

const types: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.apk': 'application/vnd.android.package-archive',
  '.woff2': 'font/woff2',
}

function fileFor(urlPath: string): string | null {
  let pathname = decodeURIComponent(urlPath.split('?')[0] ?? '/')
  if (SITE_BASE) {
    if (!pathname.startsWith(SITE_BASE)) return null
    pathname = pathname.slice(SITE_BASE.length) || '/'
  }

  let relative = pathname.replace(/^\/+/, '')
  if (relative === '' || relative.endsWith('/')) relative += 'index.html'

  const full = normalize(join(root, relative))
  const rootPath = normalize(root)
  if (full !== rootPath && !full.startsWith(rootPath + sep)) return null

  if (existsSync(full) && statSync(full).isDirectory()) {
    const index = join(full, 'index.html')
    if (existsSync(index)) return index
  }
  if (existsSync(full) && statSync(full).isFile()) return full
  const fallback = join(root, '404.html')
  return existsSync(fallback) ? fallback : null
}

const legacyBase = '/gba-pocket-privacy-policy'

function legacyRedirect(urlPath: string): string | null {
  if (SITE_BASE) return null
  const [pathname, query] = urlPath.split('?')
  const path = pathname || '/'
  if (path !== legacyBase && !path.startsWith(`${legacyBase}/`)) return null
  const next = path.slice(legacyBase.length) || '/'
  return query ? `${next}?${query}` : next
}

createServer((request, response) => {
  const redirect = legacyRedirect(request.url ?? '/')
  if (redirect) {
    response.writeHead(302, { location: redirect })
    response.end()
    return
  }

  const target = fileFor(request.url ?? '/')
  if (!target) {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
    response.end('Not found')
    return
  }
  const type = types[extname(target)] ?? 'application/octet-stream'
  response.writeHead(200, { 'content-type': type })
  createReadStream(target).pipe(response)
}).listen(port, () => {
  console.log(`http://localhost:${port}${SITE_BASE}/`)
})
