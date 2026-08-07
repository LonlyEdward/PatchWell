import { useMemo, useState } from 'react'
import FindingCard from '../components/FindingCard.jsx'
import { buildFindings, summarizeStats } from '../utils/findings.js'

const SEVERITY_FILTERS = ['All', 'Critical', 'High', 'Moderate', 'Low', 'Unknown']
const SCOPE_FILTERS = ['All', 'Production', 'Development']

export default function ReportPage({ report, onNewScan }) {
  const dependencies = useMemo(() => report.dependencies || [], [report])
  const findings = useMemo(() => buildFindings(dependencies), [dependencies])
  const stats = useMemo(() => summarizeStats(dependencies, findings), [dependencies, findings])
  const scannedAt = useMemo(() => new Date(), [report])

  const [severityFilter, setSeverityFilter] = useState('All')
  const [scopeFilter, setScopeFilter] = useState('All')

  const filtered = findings.filter((f) => {
    if (severityFilter !== 'All' && f.severity !== severityFilter.toUpperCase()) return false
    if (scopeFilter !== 'All' && f.scope !== scopeFilter.toLowerCase()) return false
    return true
  })

  if (stats.totalVulnerabilities === 0) {
    return <EmptyReport stats={stats} dependencies={dependencies} onNewScan={onNewScan} />
  }

  return (
    <div className="mx-auto w-full max-w-container-max flex-grow px-margin-mobile py-8 md:px-margin-desktop md:py-12">
      <div className="mb-8">
        <h1 className="mb-2 font-headline-lg text-headline-lg text-on-surface">Findings Report</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Scan completed at <span className="font-code-md text-code-md text-on-surface">{scannedAt.toLocaleString()}</span>
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="rounded border border-surface-border bg-surface-elevated p-6 md:col-span-8">
          <h2 className="mb-4 flex items-center gap-2 font-headline-md text-headline-md text-on-surface">
            <span className="material-symbols-outlined text-primary" aria-hidden="true">
              analytics
            </span>
            Summary
          </h2>
          <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant">{buildSummaryText(stats)}</p>
        </div>

        <div className="flex flex-col gap-4 md:col-span-4">
          <div className="flex h-full flex-col justify-center rounded border border-surface-border bg-surface-elevated p-4">
            <div className="mb-3 flex items-end justify-between border-b border-surface-border pb-3">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">
                Dependencies
              </span>
              <span className="font-code-md text-code-md text-xl text-on-surface">{stats.totalDependencies}</span>
            </div>
            <div className="mb-4 flex items-end justify-between">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">
                Vulnerabilities
              </span>
              <span className="font-code-md text-code-md text-xl text-on-surface">{stats.totalVulnerabilities}</span>
            </div>
            <div className="mt-auto grid grid-cols-2 gap-2">
              <SeverityStat label="Critical" color="bg-severity-critical" count={stats.bySeverity.CRITICAL} />
              <SeverityStat label="High" color="bg-severity-high" count={stats.bySeverity.HIGH} />
              <SeverityStat label="Moderate" color="bg-severity-moderate" count={stats.bySeverity.MODERATE} />
              <SeverityStat label="Low" color="bg-severity-low" count={stats.bySeverity.LOW} />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4 border-b border-surface-border pb-4">
        <span className="material-symbols-outlined text-on-surface-variant" aria-hidden="true">
          filter_list
        </span>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="rounded border border-surface-border bg-surface-elevated px-3 py-1.5 font-body-sm text-body-sm text-on-surface focus:border-primary focus:ring-primary"
        >
          {SEVERITY_FILTERS.map((s) => (
            <option key={s} value={s}>
              Severity: {s}
            </option>
          ))}
        </select>
        <select
          value={scopeFilter}
          onChange={(e) => setScopeFilter(e.target.value)}
          className="rounded border border-surface-border bg-surface-elevated px-3 py-1.5 font-body-sm text-body-sm text-on-surface focus:border-primary focus:ring-primary"
        >
          {SCOPE_FILTERS.map((s) => (
            <option key={s} value={s}>
              Scope: {s}
            </option>
          ))}
        </select>
        <div className="ml-auto font-body-sm text-body-sm text-on-surface-variant">
          Showing {filtered.length} of {findings.length} findings
        </div>
      </div>

      <div className="flex flex-col gap-3 pb-16">
        {filtered.map((finding, i) => (
          <FindingCard key={`${finding.packageName}-${finding.id || i}`} finding={finding} />
        ))}
        {filtered.length === 0 && (
          <p className="py-12 text-center font-body-md text-body-md text-on-surface-variant">
            No findings match the selected filters.
          </p>
        )}
      </div>
    </div>
  )
}

function SeverityStat({ label, color, count }) {
  return (
    <div className="flex items-center justify-between rounded border border-surface-border bg-surface p-2">
      <div className="flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${color}`} />
        <span className="font-body-sm text-body-sm text-on-surface-variant">{label}</span>
      </div>
      <span className="font-code-sm text-code-sm text-on-surface">{count}</span>
    </div>
  )
}

function buildSummaryText(stats) {
  const parts = []
  if (stats.bySeverity.CRITICAL) parts.push(`${stats.bySeverity.CRITICAL} critical`)
  if (stats.bySeverity.HIGH) parts.push(`${stats.bySeverity.HIGH} high`)
  if (stats.bySeverity.MODERATE) parts.push(`${stats.bySeverity.MODERATE} moderate`)
  if (stats.bySeverity.LOW) parts.push(`${stats.bySeverity.LOW} low`)
  if (stats.bySeverity.UNKNOWN) parts.push(`${stats.bySeverity.UNKNOWN} unrated`)

  const breakdown = parts.length ? ` (${parts.join(', ')} severity)` : ''

  return `PatchWell scanned ${stats.totalDependencies} ${
    stats.totalDependencies === 1 ? 'dependency' : 'dependencies'
  } and found ${stats.totalVulnerabilities} known ${
    stats.totalVulnerabilities === 1 ? 'vulnerability' : 'vulnerabilities'
  }${breakdown}. Findings below are ranked by severity — start remediation with the highest-risk items first.`
}

function EmptyReport({ stats, dependencies, onNewScan }) {
  const production = dependencies.filter((d) => d.type === 'production').length
  const development = dependencies.filter((d) => d.type === 'development').length

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-grow flex-col items-center justify-center px-margin-mobile py-16 text-center md:px-margin-desktop">
      <div className="relative mb-8">
        <div className="absolute inset-0 scale-150 rounded-full bg-severity-low/10 blur-xl" />
        <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border border-severity-low/30 bg-surface-container">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-severity-low/50 bg-surface-container-highest">
            <span
              className="material-symbols-outlined filled text-severity-low"
              style={{ fontSize: 48 }}
              aria-hidden="true"
            >
              check_circle
            </span>
          </div>
        </div>
      </div>

      <h1 className="mb-3 font-headline-lg text-headline-lg tracking-tight text-on-surface">Your manifest is clean.</h1>
      <p className="mx-auto mb-10 max-w-md font-body-md text-body-md leading-relaxed text-on-surface-variant">
        No known vulnerabilities found across{' '}
        <span className="rounded border border-primary/20 bg-primary/10 px-1.5 py-0.5 font-code-md text-code-md text-primary">
          {stats.totalDependencies}
        </span>{' '}
        scanned dependencies.
      </p>

      <div className="mb-10 grid w-full grid-cols-2 gap-4">
        <div className="rounded border border-surface-border bg-surface-container p-4">
          <div className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">
            Production
          </div>
          <div className="mt-1 font-code-md text-code-md text-xl text-on-surface">{production}</div>
        </div>
        <div className="rounded border border-surface-border bg-surface-container p-4">
          <div className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">
            Development
          </div>
          <div className="mt-1 font-code-md text-code-md text-xl text-on-surface">{development}</div>
        </div>
      </div>

      <button
        type="button"
        onClick={onNewScan}
        className="group flex items-center gap-2 rounded border border-surface-border px-6 py-3 font-label-caps text-label-caps uppercase tracking-widest text-on-surface transition-all hover:border-primary hover:bg-surface-container"
      >
        <span
          className="material-symbols-outlined text-primary transition-transform duration-500 group-hover:rotate-180"
          style={{ fontSize: 18 }}
          aria-hidden="true"
        >
          radar
        </span>
        Start a new scan
      </button>
    </div>
  )
}
