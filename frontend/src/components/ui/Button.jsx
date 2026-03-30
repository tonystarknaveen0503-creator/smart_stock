function Button({ as: Component = 'button', variant = 'primary', className = '', ...props }) {
  const baseClassName =
    'inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition duration-200 hover:-translate-y-0.5'

  const variantClassName =
    variant === 'secondary'
      ? 'border border-slate-200 bg-white text-slate-900 shadow-card hover:border-slate-300 hover:bg-slate-50'
      : 'bg-profit text-white shadow-soft hover:bg-green-700'

  return <Component className={`${baseClassName} ${variantClassName} ${className}`.trim()} {...props} />
}

export default Button
