import { useRef, useState } from 'react'
import PrimaryButton from '../components/PrimaryButton.jsx'
import ErrorBanner from '../components/ErrorBanner.jsx'

const PLACEHOLDER = `{
  "name": "your-project",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.17.1",
    "lodash": "^4.17.20"
  },
  "devDependencies": {
    "jest": "^26.6.3"
  }
}`

const LINE_NUMBERS = Array.from({ length: 20 }, (_, i) => i + 1)

export default function HomePage({ onScan, initialValue, error }) {
  const [mode, setMode] = useState('manifest')
  const [value, setValue] = useState(initialValue || '')
  const [validationError, setValidationError] = useState(null)
  const textareaRef = useRef(null)

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed) {
      setValidationError('Paste a package.json manifest before scanning.')
      textareaRef.current?.focus()
      return
    }
    try {
      JSON.parse(trimmed)
    } catch {
      setValidationError('That does not look like valid JSON. Check for a trailing comma or missing bracket.')
      return
    }
    setValidationError(null)
    onScan(trimmed)
  }

  const displayError = validationError || error

  return (
    <div className="flex flex-grow flex-col items-center justify-center px-margin-mobile py-16 md:px-margin-desktop">
      <div className="flex w-full max-w-3xl flex-col gap-8">
        <div className="space-y-4 text-center">
          <h1 className="font-headline-lg text-headline-lg tracking-tight text-on-surface">
            Instant dependency vulnerability audit.
          </h1>
          <p className="mx-auto max-w-xl font-body-md text-body-md text-on-surface-variant">
            Paste a package.json manifest and PatchWell checks every dependency against the OSV
            vulnerability database in seconds. No account required.
          </p>
        </div>

        <div className="flex flex-col overflow-hidden rounded-lg border border-surface-border bg-surface-elevated">
          <div className="flex border-b border-surface-border bg-surface-container-low">
            <button
              type="button"
              onClick={() => setMode('manifest')}
              className={`flex-1 border-b-2 px-4 py-3 text-center font-code-md text-code-md transition-colors ${
                mode === 'manifest'
                  ? 'border-primary bg-surface-elevated text-primary'
                  : 'border-transparent text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              Paste package.json
            </button>
            <button
              type="button"
              onClick={() => setMode('github')}
              className={`flex-1 border-b-2 px-4 py-3 text-center font-code-md text-code-md transition-colors ${
                mode === 'github'
                  ? 'border-primary bg-surface-elevated text-primary'
                  : 'border-transparent text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              GitHub Repo URL
            </button>
          </div>

          {mode === 'manifest' ? (
            <div className="relative w-full">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-0 top-0 flex w-12 select-none flex-col items-end border-r border-surface-border bg-surface-container-low py-4 pr-2 font-code-sm text-code-sm text-on-surface-variant/50"
              >
                {LINE_NUMBERS.map((n) => (
                  <span key={n}>{n}</span>
                ))}
              </div>
              <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={PLACEHOLDER}
                spellCheck={false}
                className="h-64 w-full resize-none border-0 bg-surface-elevated p-4 pl-16 font-code-md text-code-md text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center gap-3 p-6 text-center">
              <span className="material-symbols-outlined text-on-surface-variant" aria-hidden="true">
                construction
              </span>
              <p className="max-w-sm font-body-md text-body-md text-on-surface-variant">
                GitHub repository scanning is not available yet. Paste a{' '}
                <code className="font-code-sm text-code-sm text-on-surface">package.json</code> manifest for now.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between gap-4 border-t border-surface-border bg-surface-container-low p-4">
            <div className="hidden items-center gap-2 font-body-sm text-body-sm text-on-surface-variant sm:flex">
              <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
                info
              </span>
              Data remains local until scan initiates.
            </div>
            <PrimaryButton icon="search" onClick={handleSubmit} disabled={mode !== 'manifest'} className="ml-auto">
              Scan Manifest
            </PrimaryButton>
          </div>
        </div>

        {displayError && <ErrorBanner message={displayError} />}

        <div className="mt-4 flex items-center justify-center gap-2 text-center font-code-sm text-code-sm text-on-surface-variant/60">
          <span className="material-symbols-outlined text-[14px]" aria-hidden="true">
            terminal
          </span>
          Currently supports npm package.json manifests.
        </div>
      </div>
    </div>
  )
}
