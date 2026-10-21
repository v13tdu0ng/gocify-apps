insert into public.apps (
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
Chính sách này giải thích cách **GBA Pocket** xử lý thông tin. Ứng dụng được thiết kế để hoạt động chủ yếu trên máy của bạn. Chúng tôi không có tài khoản người dùng và không bán dữ liệu cá nhân.

## 1. Chúng tôi là ai

GBA Pocket (“Ứng dụng”, “chúng tôi”) là trình chơi game cầm tay trên Android, cho phép bạn tự thêm và chơi các file game do bạn cung cấp. Tên gói: `com.sopa.gbapocket`.

Liên hệ về quyền riêng tư: [code.with.dobby@gmail.com](mailto:code.with.dobby@gmail.com)

## 2. Thông tin ứng dụng lưu trên máy của bạn

Ứng dụng có thể lưu các dữ liệu sau **chỉ trên máy của bạn**:

- **File game bạn nhập** (ví dụ ROM `.gba` mà bạn chọn hoặc quét), được sao chép vào bộ nhớ riêng của ứng dụng để chơi offline.
- **Thông tin thư viện** như tên game, tên file, dung lượng và ngày thêm (lưu trong tùy chọn trên máy).
- **Dữ liệu save / save-state trong game** do trình giả lập tích hợp tạo ra (lưu trong WebView / bộ nhớ cục bộ trên máy).
- **Tùy chọn của ứng dụng** như độ mờ nút điều khiển trên màn hình hoặc tốc độ chơi.

Những thông tin này ở trên máy của bạn, trừ khi bạn chủ động chuyển, sao lưu hoặc chia sẻ (ví dụ qua sao lưu Android hoặc công cụ chuyển file mà bạn dùng).

## 3. Thông tin chúng tôi không thu thập

Chúng tôi **không** cố ý thu thập, truyền đi hoặc bán:

- Tên, địa chỉ email hoặc thông tin đăng nhập (ứng dụng không có đăng nhập)
- Dữ liệu vị trí
- Danh bạ, ảnh hoặc SMS
- Mã quảng cáo dùng để lập hồ sơ tiếp thị
- Dữ liệu phân tích hoặc báo cáo lỗi gửi về máy chủ của chúng tôi (tính đến ngày của chính sách này, ứng dụng không có các tính năng đó)

Tại thời điểm chính sách này, ứng dụng không gắn SDK quảng cáo hay analytics của bên thứ ba. Nếu điều đó thay đổi ở bản cập nhật sau, chính sách này sẽ được cập nhật trước hoặc khi các tính năng đó được phát hành.

## 4. Quyền truy cập và file

Khi bạn chọn *Thêm game* hoặc *Quét thư mục*, bộ chọn file của Android (Storage Access Framework) cho phép bạn cấp quyền với file hoặc thư mục bạn chọn. Ứng dụng chỉ dùng quyền đó để tìm file game được hỗ trợ và, khi bạn nhập, sao chép chúng vào bộ nhớ riêng của ứng dụng để chơi.

Ứng dụng không duyệt toàn bộ bộ nhớ máy nếu bạn không chọn qua giao diện hệ thống.

## 5. Internet / mạng

Việc chơi game được thiết kế để dùng nội dung đi kèm ứng dụng và file lưu trên máy của bạn. Chúng tôi không cung cấp hoặc tải ROM game có bản quyền từ internet. Bạn chỉ nên nhập file game mà bạn có quyền sử dụng hợp pháp.

Máy của bạn hoặc thành phần hệ thống Android (ví dụ bản cập nhật WebView từ Google) có thể tự thực hiện hoạt động mạng ngoài tầm kiểm soát của chúng tôi. Hoạt động đó tuân theo chính sách của các nhà cung cấp đó.

## 6. Quyền riêng tư của trẻ em

Ứng dụng là tiện ích cho người dùng nói chung và không cố ý thu thập thông tin cá nhân của trẻ em. Vì chúng tôi không vận hành tài khoản và không thu thập dữ liệu cá nhân trên máy chủ, chúng tôi không xử lý thông tin cá nhân của trẻ em trên mạng.

## 7. Thời gian lưu và cách xóa dữ liệu

Dữ liệu cục bộ ở trên máy cho đến khi bạn xóa một game trong ứng dụng, xóa bộ nhớ của ứng dụng trong cài đặt Android, hoặc gỡ cài đặt ứng dụng. Gỡ cài đặt sẽ xóa dữ liệu riêng của ứng dụng (gồm bản sao game đã nhập và save cục bộ do ứng dụng giữ), ngoại trừ bản sao lưu riêng mà bạn có thể đã tạo.

## 8. Lựa chọn của bạn

- Không nhập những file bạn không muốn lưu trong ứng dụng.
- Xóa từng game khỏi thư viện khi bạn không còn cần.
- Xóa dữ liệu ứng dụng hoặc gỡ cài đặt để xóa dữ liệu cục bộ của ứng dụng.
- Thu hồi quyền thư mục trong cài đặt Android nếu trước đó bạn đã cấp quyền cho một thư mục.

## 9. Thành phần của bên thứ ba

Ứng dụng nhúng các thành phần giả lập mã nguồn mở / bên thứ ba (gồm tài nguyên liên quan tới EmulatorJS) chạy cục bộ trong WebView của Android. Các thành phần đó xử lý dữ liệu game trên máy của bạn để chơi được game. Chúng tôi không dùng chúng để gửi thông tin cá nhân của bạn về máy chủ của chúng tôi.

## 10. Thay đổi chính sách này

Chúng tôi có thể cập nhật Chính sách quyền riêng tư này theo thời gian. Ngày “Cập nhật” ở đầu trang sẽ thay đổi khi chúng tôi làm vậy. Tiếp tục dùng ứng dụng sau khi cập nhật có nghĩa là bạn chấp nhận chính sách đã sửa.

## 11. Liên hệ

Câu hỏi về Chính sách quyền riêng tư này hoặc cách ứng dụng xử lý dữ liệu: [code.with.dobby@gmail.com](mailto:code.with.dobby@gmail.com)
$policy_vi$,
  $policy_en$
This policy explains how **GBA Pocket** handles information. The app is designed to work primarily on your device. We do not operate user accounts and we do not sell personal data.

## 1. Who we are

GBA Pocket (“the App”, “we”, “us”) is a handheld-game player for Android that lets you import and play game files you provide yourself. Package name: `com.sopa.gbapocket`.

Contact for privacy questions: [code.with.dobby@gmail.com](mailto:code.with.dobby@gmail.com)

## 2. Information the App stores on your device

The App may store the following data **locally on your device** only:

- **Game files you import** (for example `.gba` ROMs you select or scan), copied into the App’s private storage so they can be played offline.
- **Library metadata** such as game title, file name, size, and date added (stored in on-device preferences).
- **In-game save data / save states** created by the built-in emulator (stored in the App’s WebView / local storage on device).
- **App preferences** such as on-screen control opacity or playback speed settings.

This information stays on your device unless you deliberately move, back up, or share it yourself (for example via Android backup or file transfer tools you use).

## 3. Information we do not collect

We do **not** intentionally collect, transmit, or sell:

- Names, email addresses, or account credentials (the App has no sign-in)
- Location data
- Contacts, photos, or SMS
- Advertising IDs for marketing profiles
- Analytics or crash telemetry to our own servers (none are built into the App as of this date)

The App does not include third-party ads or analytics SDKs at the time of this policy. If that changes in a future update, this policy will be updated before or when those features ship.

## 4. Permissions and file access

When you choose *Add game* or *Scan folder*, Android’s system file picker (Storage Access Framework) lets you grant access to files or folders you select. The App uses that access only to find supported game files and, when you import them, to copy them into the App’s private storage for playback.

The App does not browse your entire device storage without your selection through the system UI.

## 5. Internet / network

Game playback is designed to use content bundled with the App and files stored on your device. We do not provide or download copyrighted game ROMs from the internet. You are responsible for only importing game files you have the legal right to use.

Your device or Android system components (for example WebView updates from Google) may perform their own network activity outside our control; that activity is governed by those providers’ policies.

## 6. Children’s privacy

The App is a general-audience utility and does not knowingly collect personal information from children. Because we do not operate accounts or collect personal data on our servers, we do not process children’s personal information online.

## 7. Data retention and deletion

Local data remains on your device until you delete a game in the App, clear the App’s storage in Android settings, or uninstall the App. Uninstalling removes the App’s private data (including imported copies of games and local saves held by the App), subject to any separate backups you may have created.

## 8. Your choices

- Do not import files you do not want stored in the App.
- Delete individual games from the library when you no longer need them.
- Clear app data or uninstall the App to remove local App data.
- Revoke folder access from Android settings if you previously granted a folder permission.

## 9. Third-party components

The App embeds open-source / third-party emulation components (including EmulatorJS-related assets) that run locally inside an Android WebView. Those components process game data on your device to enable gameplay; they are not used by us to send your personal information to our servers.

## 10. Changes to this policy

We may update this Privacy Policy from time to time. The “Last updated” date at the top will change when we do. Continued use of the App after an update means you accept the revised policy.

## 11. Contact

Questions about this Privacy Policy or the App’s data practices: [code.with.dobby@gmail.com](mailto:code.with.dobby@gmail.com)
$policy_en$,
  'https://play.google.com/store/apps/details?id=com.sopa.gbapocket&pcampaignid=web_share',
  '2026-08-11',
  true,
  true,
  0
)
on conflict (slug) do nothing;
