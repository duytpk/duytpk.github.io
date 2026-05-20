import { Animator, Dots } from '@arwes/react'

/**
 * Subtle animated dots layered on top of the single static grid that lives on
 * the body background (see index.css). Only Dots are used here — no canvas
 * line grid — so there is exactly one grid and no doubling/moiré. Dots are
 * spaced to match the 44px body grid so they sit on its intersections.
 */
export default function Background() {
  return (
    <div className="bg-fx" aria-hidden="true">
      <Animator active duration={{ interval: 8 }}>
        <Dots color="rgba(33, 243, 243, 0.18)" distance={44} size={2} />
      </Animator>
    </div>
  )
}
