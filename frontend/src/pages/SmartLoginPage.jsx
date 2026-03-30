import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useBackendAuth } from '../context/BackendAuthContext'

const demoCredentials = {
  email: 'admin@smartstock.com',
  password: 'SmartStock123',
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M4 6h16v12H4z" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M20 21a8 8 0 1 0-16 0" />
      <circle cx="12" cy="8" r="4" />
    </svg>
  )
}

function EyeIcon({ open }) {
  return open ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="m3 3 18 18" />
      <path d="M10.6 10.7A3 3 0 0 0 13.3 13.4" />
      <path d="M9.9 5.1A11 11 0 0 1 12 5c6.5 0 10 7 10 7a18.7 18.7 0 0 1-4 4.9" />
      <path d="M6.6 6.7C3.9 8.5 2 12 2 12s3.5 7 10 7c1.8 0 3.4-.4 4.7-1" />
    </svg>
  )
}

function Spinner() {
  return <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
}

function SocialButton({ icon, children }) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">{icon}</span>
      <span>{children}</span>
    </button>
  )
}

function validateField(name, value, isSignupMode) {
  const trimmedValue = value.trim()

  if (name === 'name') {
    if (!isSignupMode) return ''
    if (!trimmedValue) return 'Full name is required.'
    if (trimmedValue.length < 3) return 'Full name must be at least 3 characters.'
    return ''
  }

  if (name === 'email') {
    if (!trimmedValue) return 'Email is required.'
    if (!emailPattern.test(trimmedValue)) return 'Enter a valid email address.'
    return ''
  }

  if (name === 'password') {
    if (!trimmedValue) return 'Password is required.'
    if (isSignupMode && trimmedValue.length < 8) return 'Password must be at least 8 characters.'
    if (isSignupMode && !/[A-Za-z]/.test(trimmedValue)) return 'Password must include at least one letter.'
    if (isSignupMode && !/\d/.test(trimmedValue)) return 'Password must include at least one number.'
    return ''
  }

  return ''
}

function SmartLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser, login, signup } = useBackendAuth()
  const isSignupMode = location.pathname === '/register'
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [fieldErrors, setFieldErrors] = useState({ name: '', email: '', password: '' })
  const [touchedFields, setTouchedFields] = useState({ name: false, email: false, password: false })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (currentUser) {
    const nextPath = location.state?.from?.pathname || '/dashboard'
    return <Navigate to={nextPath} replace />
  }

  useEffect(() => {
    setError('')
    setShowPassword(false)
    setFieldErrors({ name: '', email: '', password: '' })
    setTouchedFields({ name: false, email: false, password: false })
  }, [isSignupMode])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    setFieldErrors((current) => ({ ...current, [name]: touchedFields[name] ? validateField(name, value, isSignupMode) : '' }))
  }

  const handleBlur = (event) => {
    const { name, value } = event.target
    setTouchedFields((current) => ({ ...current, [name]: true }))
    setFieldErrors((current) => ({ ...current, [name]: validateField(name, value, isSignupMode) }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const validationErrors = {
      name: validateField('name', formData.name, isSignupMode),
      email: validateField('email', formData.email, isSignupMode),
      password: validateField('password', formData.password, isSignupMode),
    }

    setFieldErrors(validationErrors)
    setTouchedFields({ name: isSignupMode, email: true, password: true })

    if (Object.values(validationErrors).some(Boolean)) {
      setError('Please correct the highlighted fields.')
      return
    }

    const trimmedName = formData.name.trim()
    const trimmedEmail = formData.email.trim()
    const trimmedPassword = formData.password.trim()

    setLoading(true)

    try {
      if (isSignupMode) {
        await signup(trimmedName, trimmedEmail, trimmedPassword)
      } else {
        await login(trimmedEmail, trimmedPassword)
      }

      navigate('/dashboard')
    } catch (submissionError) {
      setError(submissionError.message || 'Unable to complete authentication.')
    } finally {
      setLoading(false)
    }
  }

  const applyDemoCredentials = () => {
    setError('')
    setFieldErrors({ name: '', email: '', password: '' })
    setTouchedFields({ name: false, email: false, password: false })
    setFormData((current) => ({ ...current, email: demoCredentials.email, password: demoCredentials.password }))
    navigate('/login')
  }

  const getFieldClass = (fieldName) => fieldErrors[fieldName] ? 'border-red-300 focus-within:ring-red-400' : 'border-slate-200 focus-within:ring-green-500'

  return (
    <main className="min-h-screen overflow-y-auto bg-slate-100">
      <div className="flex min-h-screen">
        <section className="relative hidden flex-1 overflow-hidden bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(15,23,42,0.14),_transparent_32%)]" />
          <div className="relative flex w-full flex-col justify-center px-16 py-12 text-white">
            <Link to="/" className="mb-12 inline-flex items-center gap-3 self-start">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-lg font-bold shadow-lg backdrop-blur">SP</div>
              <div>
                <strong className="block text-xl">StockPro</strong>
                <span className="text-sm text-white/80">Market Workspace</span>
              </div>
            </Link>

            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/70">Stock Market App</p>
              <h1 className="mt-6 text-5xl font-semibold leading-tight">
                {isSignupMode ? 'Create your account and start trading smarter' : 'Invest smarter with real-time market insights'}
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-8 text-white/85">
                Watch the market, track your opportunities, and manage your investing flow from one clean dashboard.
              </p>
            </div>

            <div className="mt-12 max-w-xl rounded-[28px] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between text-sm text-white/80">
                <span>NIFTY 50</span>
                <span className="font-semibold text-emerald-100">+1.42%</span>
              </div>

              <div className="mt-4 h-48 rounded-2xl border border-white/10 bg-[linear-gradient(to_top,_rgba(255,255,255,0.14),_transparent_65%),repeating-linear-gradient(to_right,_transparent_0,_transparent_51px,_rgba(255,255,255,0.08)_52px),repeating-linear-gradient(to_bottom,_transparent_0,_transparent_51px,_rgba(255,255,255,0.08)_52px)] p-4">
                <div className="relative h-full w-full overflow-hidden rounded-xl">
                  <div className="absolute inset-x-0 bottom-3 h-24 rounded-full bg-emerald-300/10 blur-2xl" />
                  <svg viewBox="0 0 480 180" preserveAspectRatio="none" className="h-full w-full">
                    <path d="M0 150 C50 135, 95 142, 145 118 C190 95, 238 108, 286 72 C330 40, 380 55, 430 30 C450 20, 464 18, 480 10" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-white/10 p-4"><span className="block text-xs uppercase tracking-[0.2em] text-white/60">Open</span><strong className="mt-2 block text-lg font-semibold">21,620.10</strong></div>
                <div className="rounded-2xl bg-white/10 p-4"><span className="block text-xs uppercase tracking-[0.2em] text-white/60">High</span><strong className="mt-2 block text-lg font-semibold">21,910.20</strong></div>
                <div className="rounded-2xl bg-white/10 p-4"><span className="block text-xs uppercase tracking-[0.2em] text-white/60">Signal</span><strong className="mt-2 block text-lg font-semibold">Bullish</strong></div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
          <div className="w-full max-w-md">
            <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl sm:p-9">
              <div className="space-y-6 animate-[authFadeUp_0.5s_ease_both]">
                <div>
                  <div className="mb-5 flex items-center justify-between lg:hidden">
                    <Link to="/" className="text-sm font-semibold text-slate-500 transition hover:text-slate-900">Back to Home</Link>
                    {!isSignupMode ? <button type="button" onClick={applyDemoCredentials} className="rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-100">Demo Login</button> : null}
                  </div>

                  <p className="text-3xl font-semibold text-slate-950">{isSignupMode ? 'Create Account' : 'Welcome Back 👋'}</p>
                  <p className="mt-2 text-sm text-slate-500">{isSignupMode ? 'Register now and enter your dashboard' : 'Login to your account'}</p>
                </div>

                {isSignupMode ? (
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Full Name</span>
                    <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-300 focus-within:ring-2 ${getFieldClass('name')}`}>
                      <span className="text-slate-400"><UserIcon /></span>
                      <input name="name" type="text" value={formData.name} onChange={handleChange} onBlur={handleBlur} placeholder="Enter your full name" className="w-full border-none bg-transparent text-slate-900 outline-none placeholder:text-slate-400" />
                    </div>
                    {fieldErrors.name ? <span className="mt-2 block text-sm text-red-600">{fieldErrors.name}</span> : null}
                  </label>
                ) : null}

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
                  <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-300 focus-within:ring-2 ${getFieldClass('email')}`}>
                    <span className="text-slate-400"><MailIcon /></span>
                    <input name="email" type="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} placeholder="Enter your email" className="w-full border-none bg-transparent text-slate-900 outline-none placeholder:text-slate-400" />
                  </div>
                  {fieldErrors.email ? <span className="mt-2 block text-sm text-red-600">{fieldErrors.email}</span> : null}
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
                  <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-300 focus-within:ring-2 ${getFieldClass('password')}`}>
                    <span className="text-slate-400"><LockIcon /></span>
                    <input name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} onBlur={handleBlur} placeholder="Enter your password" className="w-full border-none bg-transparent text-slate-900 outline-none placeholder:text-slate-400" />
                    <button type="button" onClick={() => setShowPassword((current) => !current)} className="text-slate-400 transition hover:text-slate-700" aria-label={showPassword ? 'Hide password' : 'Show password'}><EyeIcon open={showPassword} /></button>
                  </div>
                  {fieldErrors.password ? <span className="mt-2 block text-sm text-red-600">{fieldErrors.password}</span> : null}
                </label>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <label className="flex items-center gap-2 text-slate-600">
                    <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500" />
                    <span>Remember Me</span>
                  </label>

                  {!isSignupMode ? (
                    <Link to="/forgot-password" className="font-medium text-green-700 transition hover:text-green-800">Forgot Password?</Link>
                  ) : (
                    <span className="text-xs text-slate-400">Secure signup validation enabled</span>
                  )}
                </div>

                {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}

                <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-3 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-green-700 disabled:cursor-progress disabled:opacity-80">
                  {loading ? <Spinner /> : null}
                  <span>{loading ? 'Please wait...' : isSignupMode ? 'Register and Open Dashboard' : 'Login to Dashboard'}</span>
                </button>

                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">OR</span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <SocialButton icon="G">Google</SocialButton>
                  <SocialButton icon="GH">GitHub</SocialButton>
                </div>

                {!isSignupMode ? (
                  <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <strong className="block text-sm font-semibold text-slate-900">Quick Demo Access</strong>
                        <span className="text-xs text-slate-500">{demoCredentials.email}</span>
                      </div>
                      <button type="button" onClick={applyDemoCredentials} className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-green-700 shadow-sm transition hover:bg-slate-50">Use Demo</button>
                    </div>
                  </div>
                ) : null}

                <p className="text-center text-sm text-slate-500">
                  {isSignupMode ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <button type="button" onClick={() => navigate(isSignupMode ? '/login' : '/register')} className="font-semibold text-green-700 transition hover:text-green-800">
                    {isSignupMode ? 'Login' : 'Sign up'}
                  </button>
                </p>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}

export default SmartLoginPage

