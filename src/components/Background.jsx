import { createPortal } from 'react-dom'

/**
 * Fixed full-screen background, portaled into <body> so `position: fixed` is
 * always relative to the viewport. The grid + moving lines are drawn purely in
 * CSS (see `.bg-fx` in app.css): the Arwes canvas backgrounds render incorrectly
 * on displays with devicePixelRatio != 1 (e.g. Windows 125% scaling), leaving a
 * blank band, so CSS is used instead for reliable full-page coverage.
 */
export default function Background() {
  const layer = (
    <div className="bg-fx" aria-hidden="true">
      <div className="bg-fx__scan" />
    </div>
  )
  if (typeof document === 'undefined') return layer
  return createPortal(layer, document.body)
}
