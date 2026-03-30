function Card({ title, subtitle, action, className = '', children }) {
  return (
    <article className={`rounded-xl bg-white p-5 shadow-md transition-all duration-300 hover:shadow-xl ${className}`}>
      {title || subtitle || action ? (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title ? <h3 className="text-lg font-semibold text-gray-900">{title}</h3> : null}
            {subtitle ? <p className="mt-1 text-sm text-gray-500">{subtitle}</p> : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </article>
  )
}

export default Card
