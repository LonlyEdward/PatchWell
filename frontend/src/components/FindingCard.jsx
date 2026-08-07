import { useState } from 'react'
import SeverityBadge from './SeverityBadge.jsx'
import ScopeTag from './ScopeTag.jsx'

export default function FindingCard({ finding }) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async (event) => {
    event.stopPropagation()
    if (!finding.fixed_version) return
    const command = `npm install ${finding.packageName}@${finding.fixed_version}`
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard unavailable in this context, silently ignore
    }
  }

  return (
    <div className="rounded border border-surface-border bg-surface transition-colors hover:bg-surface-container-low">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-start justify-between gap-4 p-4 text-left sm:items-center"
        aria-expanded={expanded}
      >
        <div className="flex flex-grow flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex w-full items-center gap-2 sm:w-48 sm:flex-shrink-0">
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant" aria-hidden="true">
              inventory_2
            </span>
            <span className="truncate font-code-md text-code-md text-primary-container">
              {finding.packageName} <span className="text-on-surface-variant">@ {finding.packageVersion}</span>
            </span>
          </div>

          <div className="flex-shrink-0">
            <SeverityBadge severity={finding.severity} />
          </div>

          <p className="flex-grow truncate font-body-md text-body-md text-on-surface">
            {finding.summary || 'No summary provided by the advisory.'}
          </p>

          <div className="hidden flex-shrink-0 gap-2 md:flex">
            <ScopeTag>{finding.scope}</ScopeTag>
          </div>
        </div>

        <span className="material-symbols-outlined flex-shrink-0 text-on-surface-variant" aria-hidden="true">
          {expanded ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {expanded && (
        <div className="border-t border-surface-border bg-surface-elevated p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <div>
                <h4 className="mb-2 font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">
                  Vulnerability details
                </h4>
                <p className="font-body-md text-body-md leading-relaxed text-on-surface">
                  {finding.details || finding.summary || 'No further details were provided by the advisory database.'}
                </p>
              </div>
              {finding.id && (
                <div className="flex items-center gap-4 font-body-sm text-body-sm">
                  <span className="text-on-surface-variant">Reference:</span>
                  <a
                    className="font-code-sm text-code-sm text-primary hover:underline"
                    href={`https://osv.dev/vulnerability/${finding.id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {finding.id}
                  </a>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="h-full rounded border border-surface-border bg-surface p-4">
                <h4 className="mb-3 flex items-center gap-2 font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">
                  <span className="material-symbols-outlined text-[14px] text-severity-low" aria-hidden="true">
                    build
                  </span>
                  Remediation
                </h4>
                {finding.fixed_version ? (
                  <>
                    <p className="mb-3 font-body-sm text-body-sm text-on-surface">
                      Update dependency to the fixed version.
                    </p>
                    <div className="group flex items-center justify-between rounded border border-surface-border bg-background p-2">
                      <div className="font-code-sm text-code-sm">
                        <span className="text-primary">npm</span> install {finding.packageName}@
                        {finding.fixed_version}
                      </div>
                      <button
                        type="button"
                        onClick={handleCopy}
                        title="Copy command"
                        className="text-on-surface-variant opacity-0 transition-opacity hover:text-on-surface group-hover:opacity-100"
                      >
                        <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
                          {copied ? 'check' : 'content_copy'}
                        </span>
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    No fixed version is published yet for this advisory. Track the reference above for
                    updates or evaluate an alternative package.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
