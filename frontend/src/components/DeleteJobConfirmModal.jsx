import { useEffect, useRef } from 'react'

function DeleteJobConfirmModal({
  open,
  onCancel,
  onConfirm,
  busy = false,
  title = 'Delete Job',
  message = 'Are you sure you want to delete this job?',
}) {
  const cancelRef = useRef(onCancel)
  cancelRef.current = onCancel

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') cancelRef.current()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  if (!open) return null

  return (
    <div
      className="delete-job-modal-backdrop"
      role="presentation"
      onClick={onCancel}
      aria-hidden={!open}
    >
      <div
        className="delete-job-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-job-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="delete-job-modal-title" className="delete-job-modal-title">
          {title}
        </h3>
        <p className="delete-job-modal-text">{message}</p>
        <div className="delete-job-modal-divider" />
        <div className="delete-job-modal-actions">
          <button type="button" className="delete-job-modal-cancel" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button type="button" className="delete-job-modal-confirm" onClick={onConfirm} disabled={busy}>
            {busy ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteJobConfirmModal
