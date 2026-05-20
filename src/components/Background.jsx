import { createPortal } from 'react-dom'
import { Animator, GridLines, Dots, MovingLines } from '@arwes/react'

/**
 * Arwes sci-fi grid background (GridLines + Dots + MovingLines).
 *
 * Rendered via a portal directly into <body> so the fixed `.bg-fx` container
 * has no intermediate ancestors — this guarantees `position: fixed` is relative
 * to the real viewport and the canvas always measures/covers the full screen
 * (a transformed/relatively-positioned ancestor was making the grid scroll
 * away and leave a black band at the top).
 */
export default function Background() {
  const layer = (
    <div className="bg-fx" aria-hidden="true">
      <Animator active duration={{ interval: 8 }}>
        <GridLines lineColor="rgba(33, 243, 243, 0.05)" distance={40} />
        <Dots color="rgba(33, 243, 243, 0.12)" distance={40} size={2} />
        <MovingLines lineColor="rgba(33, 243, 243, 0.22)" distance={40} sets={16} />
      </Animator>
    </div>
  )

  if (typeof document === 'undefined') return layer
  return createPortal(layer, document.body)
}
