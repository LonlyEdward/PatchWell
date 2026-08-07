export default function ErrorBanner({ message }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded border border-error/30 bg-error-container/10 p-4 font-body-md text-body-md text-on-surface"
    >
      <span className="material-symbols-outlined text-error" aria-hidden="true">
        error
      </span>
      <span>{message}</span>
    </div>
  )
}
