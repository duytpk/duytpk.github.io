import { useEffect } from 'react'
import { Animator } from '@arwes/react'
import Panel from './Panel.jsx'
import Scramble from './Scramble.jsx'

/**
 * Themed confirmation popup (replaces window.confirm). Renders nothing when
 * closed. Closes on Escape or backdrop click.
 */
export default function ConfirmModal({
  open,
  title = 'CONFIRM',
  message,
  confirmLabel = 'CONFIRM',
  cancelLabel = 'CANCEL',
  variant = 'amber',
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onCancel}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <Animator active>
          <Panel className="modal__panel" variant={variant} frame="octagon">
            <h2 className={`modal__title glow-${variant === 'amber' ? 'magenta' : variant}`}>
              <Scramble as="span">{title}</Scramble>
            </h2>
            <p className="modal__msg">{message}</p>
            <div className="modal__actions">
              <button type="button" className="btn" onClick={onCancel} autoFocus>
                {cancelLabel}
              </button>
              <button type="button" className="btn btn--danger" onClick={onConfirm}>
                {confirmLabel}
              </button>
            </div>
          </Panel>
        </Animator>
      </div>
    </div>
  )
}
