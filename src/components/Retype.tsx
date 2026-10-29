export function Retype({ text }: { text: string }) {
  return <>{text}</>
}

export function RetypeHtml({ html, className }: { html: string; className?: string }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
}
