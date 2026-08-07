import { useEffect, useState } from 'react'

const STEPS = [
  { key: 'parse', label: 'Parsing manifest...' },
  { key: 'osv', label: 'Checking OSV vulnerability database...' },
  { key: 'compile', label: 'Compiling report...' },
]

export default function ScanningPage() {
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    const timers = [setTimeout(() => setStepIndex(1), 500), setTimeout(() => setStepIndex(2), 2200)]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="flex flex-grow flex-col items-center justify-center px-margin-mobile py-16 md:px-margin-desktop">
      <div className="flex w-full max-w-3xl flex-col">
        <div className="mb-8">
          <h2 className="mb-2 font-headline-lg text-headline-lg text-on-surface">Analyzing Dependencies</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Please wait while PatchWell checks your manifest against the OSV vulnerability database.
          </p>
        </div>

        <div className="relative flex flex-col gap-8 overflow-hidden rounded border border-surface-border bg-surface-elevated p-6 md:p-8">
          <div className="absolute left-0 top-0 h-1 w-full overflow-hidden bg-surface-border">
            <div className="h-full w-1/3 animate-[slideRight_2s_ease-in-out_infinite] bg-primary" />
          </div>

          <div className="flex flex-col gap-6">
            {STEPS.map((step, i) => {
              const status = i < stepIndex ? 'done' : i === stepIndex ? 'active' : 'pending'
              return (
                <div key={step.key} className="relative flex items-start gap-4">
                  {i > 0 && <div className="absolute -top-6 left-3 z-0 h-6 w-px bg-surface-border" />}

                  {status === 'done' && (
                    <div className="relative z-10 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-severity-low/50 bg-severity-low/20">
                      <span
                        className="material-symbols-outlined text-[16px] font-bold text-severity-low"
                        aria-hidden="true"
                      >
                        check
                      </span>
                    </div>
                  )}
                  {status === 'active' && (
                    <div className="relative z-10 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-primary bg-surface-border">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                    </div>
                  )}
                  {status === 'pending' && (
                    <div className="relative z-10 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-surface-border bg-surface-container">
                      <span className="material-symbols-outlined text-[14px] text-on-surface-variant" aria-hidden="true">
                        schedule
                      </span>
                    </div>
                  )}

                  <h3
                    className={`font-body-md text-body-md ${
                      status === 'active'
                        ? 'font-semibold text-primary'
                        : status === 'done'
                          ? 'font-semibold text-on-surface'
                          : 'text-on-surface-variant opacity-60'
                    }`}
                  >
                    {step.label}
                  </h3>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideRight {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  )
}
