import en from '../../content/home-policy.en.md?raw'
import vi from '../../content/home-policy.vi.md?raw'
import icon from '../assets/gba-pocket.png'
import type { StoreApp } from './apps'

export const gbaPocketPlayUrl =
  'https://play.google.com/store/apps/details?id=com.sopa.gbapocket&pcampaignid=web_share'

export function bundledApps(): StoreApp[] {
  return [
    {
      slug: 'gba-pocket',
      name: 'GBA Pocket',
      summaryVi: 'Trình chơi game cầm tay trên Android. Dữ liệu game nằm trên máy của bạn.',
      summaryEn: 'A handheld-game player for Android. Game files stay on your device.',
      descriptionVi:
        'GBA Pocket để bạn tự thêm file game và chơi trên máy. Thư viện, save và tùy chọn nằm trên thiết bị. App không có tài khoản và không bán dữ liệu cá nhân.',
      descriptionEn:
        'GBA Pocket lets you import your own game files and play them on your device. The library, saves, and settings stay on the device. The app has no account and does not sell personal data.',
      privacyVi: vi,
      privacyEn: en,
      playStoreUrl: gbaPocketPlayUrl,
      iconUrl: icon,
      apkUrl: null,
      apkVersion: null,
      policyUpdatedOn: '2026-08-11',
      screenshots: [],
      isHomePolicy: true,
    },
  ]
}
