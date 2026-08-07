export default function Header({ showNewScan, onNewScan }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-container-max items-center justify-between px-margin-mobile py-4 md:px-margin-desktop">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined filled text-primary" aria-hidden="true">
            security
          </span>
          <span className="font-headline-md text-headline-md text-on-surface">PatchWell</span>
        </div>
        {showNewScan && (
          <button
            type="button"
            onClick={onNewScan}
            className="flex items-center gap-2 rounded border border-surface-border px-3 py-1.5 font-body-sm text-body-sm text-on-surface-variant transition-colors hover:border-primary hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
              add
            </span>
            New scan
          </button>
        )}
      </div>
    </header>
  )
}
