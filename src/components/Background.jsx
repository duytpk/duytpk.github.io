import { Animator, GridLines, Dots, MovingLines } from '@arwes/react'

/**
 * Fixed full-screen animated grid background (lab/terminal vibe).
 * Wrapped in an active Animator so MovingLines animates continuously.
 */
export default function Background() {
  return (
    <div className="bg-fx" aria-hidden="true">
      <Animator active duration={{ interval: 8 }}>
        <GridLines lineColor="rgba(33, 243, 243, 0.05)" distance={42} />
        <Dots color="rgba(33, 243, 243, 0.07)" distance={42} size={1.5} />
        <MovingLines lineColor="rgba(33, 243, 243, 0.05)" distance={42} sets={14} />
      </Animator>
    </div>
  )
}
