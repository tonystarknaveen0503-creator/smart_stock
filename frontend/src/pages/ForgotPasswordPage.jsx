import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useBackendAuth } from '../context/BackendAuthContext'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function ForgotPasswordPage() {
  const navigate = useNavigate()
  const { requestPasswordReset } = useBackendAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmedEmail = email.trim()
    setError('')
    setMessage('')

    if (!trimmedEmail) {
      setError('Email is required.')
      return
    }

    if (!emailPattern.test(trimmedEmail)) {
      setError('Enter a valid email address.')
      return
    }

    setLoading(true)

    try {
      const payload = await requestPasswordReset(trimmedEmail)
      setMessage(payload.message || 'Password reset instructions have been sent to your email.')
    } catch (requestError) {
      setError(requestError.message || 'Unable to process password reset request.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center">
        <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl sm:p-9">
          <Link to="/login" className="text-sm font-semibold text-slate-500 transition hover:text-slate-900">
            Back to Login
          </Link>

          <h1 className="mt-6 text-3xl font-semibold text-slate-950">Forgot Password</h1>
          <p className="mt-2 text-sm text-slate-500">Enter your registered email to validate and request a password reset.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                className={`w-full rounded-xl border px-4 py-3 text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:ring-2 ${error ? 'border-red-300 focus:ring-red-400' : 'border-slate-200 focus:ring-green-500'}`}
              />
            </label>

            {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}
            {message ? <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{message}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-green-700 disabled:cursor-progress disabled:opacity-80"
            >
              {loading ? 'Please wait...' : 'Send Reset Request'}
            </button>
          </form>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="mt-6 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Return to Login
          </button>
        </div>
      </div>
    </main>
  )
}

export default ForgotPasswordPage

