function configuredBase(): string {
  const fromNode = typeof process !== 'undefined' ? process.env.VITE_SITE_BASE : undefined
  const fromVite =
    typeof import.meta !== 'undefined' && import.meta.env
      ? import.meta.env.VITE_SITE_BASE
      : undefined
  return (fromNode || fromVite || '').trim()
}

export function normalizeSiteBase(value: string | undefined): string {
  const raw = (value ?? '').trim().replace(/\/$/, '')
  return raw === '/' ? '' : raw
}

export const SITE_BASE = normalizeSiteBase(configuredBase())

export function routerBasename(): string {
  return SITE_BASE || '/'
}
