import { useState } from 'react'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Please enter both email and password.')
      return
    }

    setLoading(true)

    await new Promise((resolve) => {
      window.setTimeout(resolve, 800)
    })

    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome back</h1>
          <p className="text-gray-500 mt-1 mb-6">Login to access your stock market dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <div className="flex justify-between items-center text-sm mb-4">
            <label className="flex items-center gap-2 text-gray-600">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
              />
              <span>Remember me</span>
            </label>

            <button type="button" className="text-green-600 hover:underline">
              Forgot password?
            </button>
          </div>

          {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-70 disabled:cursor-progress"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-400 my-4">OR</p>

        <div>
          <button className="w-full border py-2 rounded-lg mb-2 hover:bg-gray-100 transition" type="button">
            Continue with Google
          </button>
          <button className="w-full border py-2 rounded-lg mb-2 hover:bg-gray-100 transition" type="button">
            Continue with GitHub
          </button>
        </div>

        <p className="text-center text-sm mt-6 text-gray-600">
          Don&apos;t have an account?{' '}
          <button type="button" className="text-green-600 hover:underline">
            Sign up
          </button>
        </p>
      </div>
    </main>
  )
}

export default Login
