import { renderMarkdown } from './markdown'

export type HomePolicyInput = {
  appName: string
  updatedOn: string
  enMarkdown: string
  viMarkdown: string
  appsHref: string
  cssHref: string
  logoHref: string
  faviconHref: string
}

function escapeText(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function renderHomePolicyHtml(input: HomePolicyInput): string {
  const name = escapeText(input.appName)
  const updated = escapeText(input.updatedOn)
  const appsHref = escapeText(input.appsHref)
  const cssHref = escapeText(input.cssHref)
  const logoHref = escapeText(input.logoHref)
  const faviconHref = escapeText(input.faviconHref)

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Privacy Policy — ${name}</title>
  <link rel="icon" type="image/png" href="${faviconHref}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&amp;display=swap" />
  <link rel="stylesheet" href="${cssHref}" />
  <script>
    (function () {
      var stored = null
      try { stored = localStorage.getItem('lang') } catch (e) {}
      var zone = ''
      try { zone = Intl.DateTimeFormat().resolvedOptions().timeZone } catch (e) {}
      var lang = stored === 'vi' || stored === 'en' ? stored : (zone === 'Asia/Ho_Chi_Minh' || zone === 'Asia/Saigon' ? 'vi' : 'en')
      document.documentElement.setAttribute('data-lang', lang)
    })()
    document.addEventListener('click', function (event) {
      var target = event.target
      var link = target && target.closest ? target.closest('a[href]') : null
      if (!link || link.getAttribute('target') === '_blank') return
      var url
      try { url = new URL(link.href, location.href) } catch (e) { return }
      if (url.origin !== location.origin) return
      try { sessionStorage.setItem('nav-direction', link.getAttribute('data-nav') === 'back' ? 'back' : 'forward') } catch (e) {}
    }, true)
    function tagTransition(event) {
      if (!event.viewTransition) return
      var direction = 'forward'
      try { direction = sessionStorage.getItem('nav-direction') === 'back' ? 'back' : 'forward' } catch (e) {}
      event.viewTransition.types.add(direction)
    }
    window.addEventListener('pageswap', tagTransition)
    window.addEventListener('pagereveal', tagTransition)
  </script>
</head>
<body>
  <div class="page">
    <div class="shell">
      <header class="topbar">
        <a class="brand" href="${appsHref}"><img class="brand-logo" src="${logoHref}" alt="GOCIFY" /></a>
        <nav class="top-actions">
          <div class="langs" role="group" aria-label="Language">
            <button type="button" data-lang="vi">VI</button>
            <button type="button" data-lang="en">EN</button>
          </div>
        </nav>
      </header>
      <main class="board">
      <div class="board-clip">
      <div class="board-inner">
      <div class="board-pad">
      <p class="jump">
        <a class="sticker only-vi" data-nav="back" href="${appsHref}">Ứng dụng</a>
        <a class="sticker only-en" data-nav="back" href="${appsHref}">Apps</a>
      </p>
      <h1>
        <span class="only-vi">Chính sách quyền riêng tư — ${name}</span>
        <span class="only-en">Privacy Policy — ${name}</span>
      </h1>
      <p class="meta">
        <span class="only-vi">Cập nhật: ${updated}</span>
        <span class="only-en">Updated: ${updated}</span>
      </p>
      <section id="policy-en" lang="en">
        <p class="lang">English</p>
        ${renderMarkdown(input.enMarkdown)}
      </section>
      <section id="policy-vi" lang="vi">
        <p class="lang">Tiếng Việt</p>
        ${renderMarkdown(input.viMarkdown)}
      </section>
      </div>
      </div>
      </div>
      </main>
    </div>
  </div>
  <script>
    (function () {
      var group = document.querySelector('.langs')
      var board = document.querySelector('.board')
      if (!group) return
      var requested = document.documentElement.getAttribute('data-lang') === 'en' ? 'en' : 'vi'
      var swapTimer = 0
      function paintToggle(lang) {
        group.setAttribute('data-lang', lang)
        var buttons = group.querySelectorAll('button')
        for (var i = 0; i < buttons.length; i++) {
          buttons[i].setAttribute('aria-pressed', buttons[i].getAttribute('data-lang') === lang ? 'true' : 'false')
        }
      }
      function paintPage(lang) {
        document.documentElement.setAttribute('data-lang', lang)
      }
      function apply(lang) {
        requested = lang
        paintToggle(lang)
        paintPage(lang)
      }
      apply(requested)
      group.addEventListener('click', function (event) {
        var button = event.target.closest('button')
        if (!button) return
        var lang = button.getAttribute('data-lang')
        if ((lang !== 'vi' && lang !== 'en') || lang === requested) return
        requested = lang
        try { localStorage.setItem('lang', lang) } catch (e) {}
        paintToggle(lang)
        var reduce = false
        try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches } catch (e) {}
        if (reduce || !board) {
          paintPage(lang)
          return
        }
        board.classList.add('is-collapsed')
        window.clearTimeout(swapTimer)
        swapTimer = window.setTimeout(function () {
          paintPage(requested)
          board.classList.remove('is-collapsed')
        }, 280)
      })
    })()
  </script>
</body>
</html>
`
}
