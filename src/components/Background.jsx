import { Animator, Dots, MovingLines } from '@arwes/react'

/**
 * Animated overlay for the background (dots + moving lines) on top of the
 * static CSS grid that lives on the body. Wrapped in an active Animator so
 * MovingLines animates continuously. The static grid is intentionally CSS-only
 * (see body in index.css) so coverage never depends on canvas sizing.
 */
export default function Background() {
  return (
    <div className="bg-fx" aria-hidden="true">
      <Animator active duration={{ interval: 8 }}>
        <Dots color="rgba(33, 243, 243, 0.10)" distance={42} size={1.5} />
        <MovingLines lineColor="rgba(33, 243, 243, 0.07)" distance={42} sets={14} />
      </Animator>
    </div>
  )
}
