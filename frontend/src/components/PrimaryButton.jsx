export default function PrimaryButton({ children, icon, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded bg-primary px-6 py-2 font-body-md text-body-md font-bold text-on-primary transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {icon && (
        <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </button>
  )
}
