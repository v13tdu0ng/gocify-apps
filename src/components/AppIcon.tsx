import { useState } from 'react'

type AppIconProps = {
  name: string
  url: string | null
  size?: 'md' | 'lg'
}

export function AppIcon({ name, url, size = 'md' }: AppIconProps) {
  const [failed, setFailed] = useState(false)
  const showImage = Boolean(url) && !failed

  return (
    <div className={`icon-frame ${size}`}>
      {showImage ? (
        <img src={url!} alt="" onError={() => setFailed(true)} />
      ) : (
        <span aria-hidden="true">{name.slice(0, 1)}</span>
      )}
    </div>
  )
}
