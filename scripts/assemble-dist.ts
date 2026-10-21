import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  filterSafeSlugs,
  formatPolicyDate,
  policyTextOrFallback,
  resolveHomePolicy,
  routeOutputFiles,
} from '../src/lib/apps.ts'
import { renderHomePolicyHtml } from '../src/lib/render-policy.ts'
import { SITE_BASE } from '../src/lib/site.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

loadEnv(join(root, '.env'))

const fallbackEn = readFileSync(join(root, 'content/home-policy.en.md'), 'utf8')
const fallbackVi = readFileSync(join(root, 'content/home-policy.vi.md'), 'utf8')

const remote = await loadPublishedApps()
const home = resolveHomePolicy(remote)
const slugs = filterSafeSlugs(remote.map((app) => app.slug))
const routeSlugs = slugs.length > 0 ? slugs : ['gba-pocket']

const logoFile = readdirSync(join(root, 'dist/assets')).find(
  (name) => name.startsWith('gocify-logo-') && name.endsWith('.png'),
)
if (!logoFile) throw new Error('Missing GOCIFY logo in dist/assets')

const html = renderHomePolicyHtml({
  appName: home?.name || 'GBA Pocket',
  updatedOn: home ? formatPolicyDate(home.policyUpdatedOn) : 'August 11, 2026',
  enMarkdown: policyTextOrFallback(home?.privacyEn, fallbackEn),
  viMarkdown: policyTextOrFallback(home?.privacyVi, fallbackVi),
  appsHref: `${SITE_BASE}/`,
  cssHref: `${SITE_BASE}/assets/policy.css`,
  logoHref: `${SITE_BASE}/assets/${logoFile}`,
  faviconHref: `${SITE_BASE}/favicon.png`,
})

const spa = join(root, 'dist/index.html')
if (!existsSync(spa)) {
  throw new Error('Missing dist/index.html. Run vite build first.')
}

for (const relativePath of routeOutputFiles(routeSlugs)) {
  const target = join(root, 'dist', relativePath)
  mkdirSync(dirname(target), { recursive: true })
  copyFileSync(spa, target)
}

const homeSlug = filterSafeSlugs([home?.slug || 'gba-pocket'])[0] || 'gba-pocket'
const policyFile = join(root, 'dist', homeSlug, 'privacy-policy/index.html')
mkdirSync(dirname(policyFile), { recursive: true })
writeFileSync(policyFile, html)

for (const slug of routeSlugs) {
  const target = `${SITE_BASE}/${slug}/privacy-policy/`
  const redirectFile = join(root, 'dist', slug, 'privacy/index.html')
  mkdirSync(dirname(redirectFile), { recursive: true })
  writeFileSync(redirectFile, privacyRedirect(target))
}
mkdirSync(join(root, 'dist/assets'), { recursive: true })
writeFileSync(
  join(root, 'dist/assets/policy.css'),
  `${readFileSync(join(root, 'src/tokens.css'), 'utf8')}\n${readFileSync(join(root, 'policy/policy.css'), 'utf8')}`,
)

console.log(`Baked privacy policy for ${home?.name || 'GBA Pocket'} and ${routeSlugs.length} app route(s).`)

function privacyRedirect(target: string): string {
  const href = target.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="refresh" content="0; url=${href}" />
  <link rel="canonical" href="${href}" />
  <title>Privacy Policy</title>
  <script>location.replace(${JSON.stringify(target)})</script>
</head>
<body></body>
</html>
`
}

type RemoteApp = {
  slug: string
  name: string
  privacyEn: string
  privacyVi: string
  policyUpdatedOn: string
  isHomePolicy: boolean
}

function loadEnv(path: string) {
  if (!existsSync(path)) return
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const separator = trimmed.indexOf('=')
    if (separator < 0) continue
    const key = trimmed.slice(0, separator).trim()
    let value = trimmed.slice(separator + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = value
  }
}

async function loadPublishedApps(): Promise<RemoteApp[]> {
  const url = process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) return []

  const endpoint = new URL('/rest/v1/apps', url)
  endpoint.searchParams.set(
    'select',
    'slug,name,privacy_policy_vi,privacy_policy_en,policy_updated_on,is_home_policy',
  )
  endpoint.searchParams.set('is_published', 'eq.true')

  const response = await fetch(endpoint, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  })
  if (!response.ok) {
    console.warn(`Supabase responded ${response.status}. Using the bundled GBA Pocket policy.`)
    return []
  }

  const rows = (await response.json()) as Array<{
    slug: string
    name: string
    privacy_policy_vi: string
    privacy_policy_en: string
    policy_updated_on: string
    is_home_policy: boolean
  }>

  return rows.map((row) => ({
    slug: row.slug,
    name: row.name,
    privacyEn: row.privacy_policy_en,
    privacyVi: row.privacy_policy_vi,
    policyUpdatedOn: row.policy_updated_on,
    isHomePolicy: row.is_home_policy,
  }))
}
