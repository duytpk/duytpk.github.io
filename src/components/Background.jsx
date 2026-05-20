import { Animator, GridLines, Dots, MovingLines } from '@arwes/react'

/**
 * Fixed full-screen Arwes sci-fi grid background (GridLines + Dots + MovingLines).
 * Wrapped in an active Animator so MovingLines animates continuously.
 */
export default function Background() {
  return (
    <div className="bg-fx" aria-hidden="true">
      <Animator active duration={{ interval: 8 }}>
        <GridLines lineColor="rgba(33, 243, 243, 0.05)" distance={40} />
        <Dots color="rgba(33, 243, 243, 0.12)" distance={40} size={2} />
        <MovingLines lineColor="rgba(33, 243, 243, 0.22)" distance={40} sets={16} />
      </Animator>
    </div>
  )
}
