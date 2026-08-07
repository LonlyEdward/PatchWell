export default function ScopeTag({ children }) {
  return (
    <span className="rounded border border-surface-border bg-surface-container px-2 py-0.5 font-code-sm text-code-sm text-on-surface-variant">
      {children}
    </span>
  )
}
