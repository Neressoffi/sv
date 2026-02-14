export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`rounded-2xl bg-white/90 shadow-lg shadow-pink-200/30 border border-pink-100 overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
