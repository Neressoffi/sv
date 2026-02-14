export default function Button({
  children,
  variant = 'primary',
  className = '',
  disabled,
  ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl px-5 py-3 transition-all touch-target disabled:opacity-50 disabled:pointer-events-none'
  const variants = {
    primary: 'bg-rose-500 text-white hover:bg-rose-600 active:scale-[0.98] shadow-md shadow-rose-300/50',
    secondary: 'bg-white text-rose-600 border-2 border-rose-300 hover:bg-rose-50',
    ghost: 'text-rose-600 hover:bg-rose-50',
  }
  return (
    <button
      type="button"
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
