export type ScreenshotRow = {
  storage_path: string
  sort_order: number
}

export type AppRow = {
  slug: string
  name: string
  summary_vi: string
  summary_en: string
  description_vi: string
  description_en: string
  privacy_policy_vi: string
  privacy_policy_en: string
  play_store_url: string | null
  icon_path: string | null
  apk_path: string | null
  apk_version: string | null
  policy_updated_on: string
  is_home_policy: boolean
  app_screenshots: ScreenshotRow[] | null
}

export type StoreApp = {
  slug: string
  name: string
  summaryVi: string
  summaryEn: string
  descriptionVi: string
  descriptionEn: string
  privacyVi: string
  privacyEn: string
  playStoreUrl: string | null
  iconUrl: string | null
  apkUrl: string | null
  apkVersion: string | null
  policyUpdatedOn: string
  screenshots: string[]
  isHomePolicy: boolean
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const MIN_POLICY_LENGTH = 40

export function safeHttpUrl(value: string | null): string | null {
  if (!value) return null
  try {
    const url = new URL(value)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    return value
  } catch {
    return null
  }
}

export function publicObjectUrl(supabaseUrl: string, bucket: string, path: string | null): string | null {
  if (!path) return null
  if (/^https?:\/\//i.test(path)) return safeHttpUrl(path)
  const base = supabaseUrl.replace(/\/$/, '')
  const encoded = path.split('/').map((part) => encodeURIComponent(part)).join('/')
  return `${base}/storage/v1/object/public/${bucket}/${encoded}`
}

export function mapAppRow(row: AppRow, supabaseUrl: string): StoreApp {
  const shots = [...(row.app_screenshots ?? [])].sort((a, b) => a.sort_order - b.sort_order)
  return {
    slug: row.slug,
    name: row.name,
    summaryVi: row.summary_vi,
    summaryEn: row.summary_en,
    descriptionVi: row.description_vi,
    descriptionEn: row.description_en,
    privacyVi: row.privacy_policy_vi,
    privacyEn: row.privacy_policy_en,
    playStoreUrl: safeHttpUrl(row.play_store_url),
    iconUrl: publicObjectUrl(supabaseUrl, 'app-media', row.icon_path),
    apkUrl: publicObjectUrl(supabaseUrl, 'app-apks', row.apk_path),
    apkVersion: row.apk_version,
    policyUpdatedOn: row.policy_updated_on,
    screenshots: shots.map((shot) => publicObjectUrl(supabaseUrl, 'app-media', shot.storage_path)!),
    isHomePolicy: row.is_home_policy,
  }
}

export function resolveHomePolicy<T extends { slug: string; isHomePolicy: boolean }>(apps: T[]): T | null {
  return apps.find((app) => app.isHomePolicy) ?? apps.find((app) => app.slug === 'gba-pocket') ?? null
}

export function formatPolicyDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(isoDate)
  if (!match) return isoDate
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)))
}

export function filterSafeSlugs(slugs: string[]): string[] {
  return slugs.filter((slug) => SLUG.test(slug))
}

export function routeOutputFiles(slugs: string[]): string[] {
  return ['404.html', ...slugs.flatMap((slug) => [`${slug}/index.html`, `${slug}/privacy-policy/index.html`])]
}

export function isSupabaseConfigured(url?: string, key?: string): boolean {
  return Boolean(url && key)
}

export function policyTextOrFallback(remote: string | null | undefined, fallback: string): string {
  const text = remote?.trim() ?? ''
  if (text.length < MIN_POLICY_LENGTH) return fallback
  return text
}
