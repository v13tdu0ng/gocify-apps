import { useEffect, useLayoutEffect, useRef, useState } from 'react'

const FRAMES = 14
const FRAME_MS = 16

function motionOff(): boolean {
  if (typeof window.matchMedia !== 'function') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function wait(ms: number, timers: number[]): Promise<void> {
  return new Promise((resolve) => {
    timers.push(window.setTimeout(resolve, ms))
  })
}

export function Retype({ text }: { text: string }) {
  const [shown, setShown] = useState(text)
  const [busy, setBusy] = useState(false)
  const shownRef = useRef(text)

  useEffect(() => {
    const from = shownRef.current
    if (from === text || motionOff()) {
      shownRef.current = text
      setShown(text)
      setBusy(false)
      return
    }

    const timers: number[] = []
    let cancelled = false
    setBusy(true)

    const paint = (value: string) => {
      shownRef.current = value
      setShown(value)
    }

    const run = async () => {
      const deleteSteps = Math.min(FRAMES, Math.max(from.length, 1))
      for (let step = 1; step <= deleteSteps; step += 1) {
        if (cancelled) return
        const keep = Math.ceil(from.length * (1 - step / deleteSteps))
        paint(from.slice(0, keep))
        await wait(FRAME_MS, timers)
      }
      const typeSteps = Math.min(FRAMES, Math.max(text.length, 1))
      for (let step = 1; step <= typeSteps; step += 1) {
        if (cancelled) return
        const count = Math.ceil(text.length * (step / typeSteps))
        paint(text.slice(0, count))
        await wait(FRAME_MS, timers)
      }
      if (!cancelled) setBusy(false)
    }

    void run()
    return () => {
      cancelled = true
      timers.forEach((id) => window.clearTimeout(id))
    }
  }, [text])

  return (
    <>
      {shown}
      {busy && <span className="caret" aria-hidden="true" />}
    </>
  )
}

function visibleText(root: ParentNode): Text[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const nodes: Text[] = []
  while (walker.nextNode()) {
    const node = walker.currentNode as Text
    if (node.textContent?.trim()) nodes.push(node)
  }
  return nodes
}

function blanked(html: string): { html: string; texts: string[] } {
  const doc = new DOMParser().parseFromString(`<div id="retype-root">${html}</div>`, 'text/html')
  const root = doc.getElementById('retype-root')
  if (!root) return { html, texts: [] }
  const texts: string[] = []
  for (const node of visibleText(root)) {
    texts.push(node.textContent ?? '')
    node.textContent = '\u200b'
  }
  return { html: root.innerHTML, texts }
}

export function RetypeHtml({ html, className }: { html: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const htmlRef = useRef(html)
  const pending = useRef<string[] | null>(null)
  const fullHtml = useRef(html)
  const [markup, setMarkup] = useState(html)

  useEffect(() => {
    if (htmlRef.current === html) return
    const root = ref.current
    if (!root || motionOff()) {
      htmlRef.current = html
      setMarkup(html)
      return
    }

    const timers: number[] = []
    let cancelled = false
    htmlRef.current = html
    fullHtml.current = html

    const run = async () => {
      const nodes = visibleText(root)
      const original = nodes.map((node) => node.textContent ?? '')
      const steps = FRAMES
      for (let step = 1; step <= steps; step += 1) {
        if (cancelled) return
        nodes.forEach((node, index) => {
          const source = original[index] ?? ''
          const keep = Math.ceil(source.length * (1 - step / steps))
          node.textContent = source.slice(0, keep)
        })
        await wait(FRAME_MS, timers)
      }
      if (cancelled) return
      const next = blanked(html)
      pending.current = next.texts
      setMarkup(next.html)
    }

    void run()
    return () => {
      cancelled = true
      timers.forEach((id) => window.clearTimeout(id))
    }
  }, [html])

  useLayoutEffect(() => {
    const texts = pending.current
    const root = ref.current
    if (!texts || !root) return
    pending.current = null
    const nodes = visibleText(root)
    if (nodes.length !== texts.length) {
      setMarkup(fullHtml.current)
      return
    }

    const timers: number[] = []
    let cancelled = false
    const run = async () => {
      for (let step = 1; step <= FRAMES; step += 1) {
        if (cancelled) return
        nodes.forEach((node, index) => {
          const source = texts[index] ?? ''
          const count = Math.ceil(source.length * (step / FRAMES))
          node.textContent = source.slice(0, count)
        })
        await wait(FRAME_MS, timers)
      }
      if (!cancelled) setMarkup(fullHtml.current)
    }
    void run()
    return () => {
      cancelled = true
      timers.forEach((id) => window.clearTimeout(id))
    }
  }, [markup])

  return <div ref={ref} className={className} dangerouslySetInnerHTML={{ __html: markup }} />
}
