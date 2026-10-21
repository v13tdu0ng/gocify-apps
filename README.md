# App shelf

Cửa hàng app cá nhân, theo kiểu Play Store, kèm privacy policy cho Google Play.

**Trang chủ:** https://v13tdu0ng.github.io/gocify-apps/

**Game:** https://v13tdu0ng.github.io/gocify-apps/gba-pocket

**Policy của GBA Pocket:** https://v13tdu0ng.github.io/gocify-apps/gba-pocket/privacy-policy

Trang chủ là cửa hàng app. Chọn một game thì địa chỉ thêm `/{tên-game}`. Privacy policy của game đó nằm ở `/{tên-game}/privacy-policy`. Policy của GBA Pocket được ghi thành HTML lúc build, để dán vào Play Console. Sửa policy xong thì chạy lại GitHub Action. Thêm app hoặc đổi APK thì cửa hàng thấy ngay.

## Chạy local

```bash
npm install
npm test
npm run dev
```

Cửa hàng dev: http://localhost:5173/

Khi chưa có file `.env`, cửa hàng hiện sẵn GBA Pocket từ nội dung trong `content/`.

Xem cả trang policy (bản build):

```bash
npm run build
npm run preview
```

Mở http://localhost:4173/

## Supabase

1. Tạo project trên [supabase.com](https://supabase.com).
2. Mở SQL Editor, chạy `supabase/migrations/001_store.sql`, rồi chạy `supabase/seed.sql`. Nếu sửa file policy trong `content/`, chạy `npx tsx scripts/write-seed.ts` trước khi chạy lại seed.
3. Trong Storage, bucket `app-media` dùng cho icon và screenshot. Bucket `app-apks` dùng cho file APK.
4. Upload file, rồi điền đường dẫn object vào bảng (không phải URL đầy đủ). Ví dụ `gba-pocket/icon.png` vào `apps.icon_path`, `gba-pocket/latest.apk` vào `apps.apk_path`. Screenshot thêm từng dòng trong `app_screenshots`.
5. Bật `is_published` cho app khách được thấy. Chỉ một app có `is_home_policy` — đó là policy hiện ở trang chủ.
6. Copy Project URL và anon key vào `.env`:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Anon key là khóa public. Khách chỉ đọc được app đã xuất bản. Sửa dữ liệu bằng tài khoản của bạn trong Dashboard.

Đổi APK: upload file mới đè đúng `apk_path`, hoặc đổi tên file rồi cập nhật cột đó nếu trình duyệt còn giữ bản cũ.

## Đưa lên GitHub Pages

1. Settings → Secrets and variables → Actions: thêm `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY`.
2. Settings → Pages → Build and deployment → Source: **GitHub Actions**.
3. Push lên `main`, hoặc chạy workflow **Deploy site** bằng tay khi chỉ sửa policy trong Supabase.

Trong Play Console, dùng URL policy của GBA Pocket:

`https://v13tdu0ng.github.io/gocify-apps/gba-pocket/privacy-policy`

Trên GitHub Pages, tên repo `gocify-apps` nằm trong địa chỉ. Bản chạy local thì mở thẳng http://localhost:4173/, game ở `/gba-pocket`, policy ở `/gba-pocket/privacy-policy`.
