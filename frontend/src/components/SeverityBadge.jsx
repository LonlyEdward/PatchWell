const SEVERITY_STYLES = {
  CRITICAL: 'text-severity-critical bg-severity-critical/10 border-severity-critical/20',
  HIGH: 'text-severity-high bg-severity-high/10 border-severity-high/20',
  MODERATE: 'text-severity-moderate bg-severity-moderate/10 border-severity-moderate/20',
  LOW: 'text-severity-low bg-severity-low/10 border-severity-low/20',
  UNKNOWN: 'text-on-surface-variant bg-surface-container border-surface-border',
}

export default function SeverityBadge({ severity }) {
  const classes = SEVERITY_STYLES[severity] || SEVERITY_STYLES.UNKNOWN
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 font-code-sm text-code-sm ${classes}`}
    >
      {severity}
    </span>
  )
}
