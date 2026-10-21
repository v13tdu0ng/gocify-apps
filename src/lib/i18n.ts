export type Lang = 'vi' | 'en'

const vietnamTimeZones = new Set(['Asia/Ho_Chi_Minh', 'Asia/Saigon'])

export function resolveLang(stored: string | null, timeZone: string): Lang {
  if (stored === 'vi' || stored === 'en') return stored
  return vietnamTimeZones.has(timeZone) ? 'vi' : 'en'
}

export function pickText(lang: Lang, vi: string, en: string): string {
  return lang === 'en' ? en : vi
}

export const copy = {
  vi: {
    catalogTitle: 'Ứng dụng',
    badge: 'Xin chào',
    open: 'Xem',
    download: 'Tải về',
    playDownload: 'Tải trên Google Play',
    playStore: 'Play Store',
    privacyLong: 'Privacy policy',
    back: 'Tất cả app',
    loading: 'Đang tải',
    error: 'Không tải được danh sách app.',
    empty: 'Chưa có ứng dụng nào được xuất bản.',
    notFound: 'Không thấy app này.',
    noApk: 'Chưa có file cài đặt.',
    version: 'Phiên bản',
    updated: 'Cập nhật',
    language: 'Ngôn ngữ',
  },
  en: {
    catalogTitle: 'Apps',
    badge: 'Hello',
    open: 'Open',
    download: 'Download',
    playDownload: 'Download on Google Play',
    playStore: 'Play Store',
    privacyLong: 'Privacy policy',
    back: 'All apps',
    loading: 'Loading',
    error: 'Could not load the app list.',
    empty: 'No published apps yet.',
    notFound: 'This app is not here.',
    noApk: 'No install file yet.',
    version: 'Version',
    updated: 'Updated',
    language: 'Language',
  },
} as const
