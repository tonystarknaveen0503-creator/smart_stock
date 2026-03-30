function Card({ className = '', children }) {
  return (
    <div className={`rounded-3xl border border-slate-200 bg-white shadow-card ${className}`.trim()}>
      {children}
    </div>
  )
}

export default Card
