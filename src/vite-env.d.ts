/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_BASE?: string
}

declare module '*.md?raw' {
  const content: string
  export default content
}
