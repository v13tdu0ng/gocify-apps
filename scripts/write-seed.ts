import { readFileSync, writeFileSync } from 'node:fs'

const en = readFileSync('content/home-policy.en.md', 'utf8').trim()
const vi = readFileSync('content/home-policy.vi.md', 'utf8').trim()

const sql = `insert into public.apps (
  slug,
  name,
  summary_vi,
  summary_en,
  description_vi,
  description_en,
  privacy_policy_vi,
  privacy_policy_en,
  play_store_url,
  policy_updated_on,
  is_published,
  is_home_policy,
  sort_order
) values (
  'gba-pocket',
  'GBA Pocket',
  'Trình chơi game cầm tay trên Android. Dữ liệu game nằm trên máy của bạn.',
  'A handheld-game player for Android. Game files stay on your device.',
  'GBA Pocket để bạn tự thêm file game và chơi trên máy. Thư viện, save và tùy chọn nằm trên thiết bị. App không có tài khoản và không bán dữ liệu cá nhân.',
  'GBA Pocket lets you import your own game files and play them on your device. The library, saves, and settings stay on the device. The app has no account and does not sell personal data.',
  $policy_vi$
${vi}
$policy_vi$,
  $policy_en$
${en}
$policy_en$,
  'https://play.google.com/store/apps/details?id=com.sopa.gbapocket&pcampaignid=web_share',
  '2026-08-11',
  true,
  true,
  0
)
on conflict (slug) do nothing;
`

writeFileSync('supabase/seed.sql', sql)
