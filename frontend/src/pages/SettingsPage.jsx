import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/dashboard/Card'
import Navbar from '../components/dashboard/Navbar'
import Sidebar from '../components/dashboard/Sidebar'
import Toggle from '../components/dashboard/Toggle'
import { useBackendAuth } from '../context/BackendAuthContext'

function SettingsPage() {
  const navigate = useNavigate()
  const { currentUser, logout } = useBackendAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profile, setProfile] = useState({
    fullName: currentUser?.name || 'StockPro User',
    email: currentUser?.email || 'market@stockpro.com',
    phone: '+91 98765 43210',
  })
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    market: true,
  })
  const [appearance, setAppearance] = useState({
    darkMode: false,
    theme: 'Light',
  })
  const [preferences, setPreferences] = useState({
    currency: 'INR',
    language: 'English',
  })

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleProfileChange = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }))
  }

  const handlePasswordChange = (field, value) => {
    setPasswords((current) => ({ ...current, [field]: value }))
  }

  const initials = (profile.fullName || 'SP')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        <Sidebar activeItem="Settings" open={sidebarOpen} setOpen={setSidebarOpen} />

        <section className="flex-1 p-6">
          <Navbar currentUser={currentUser} onLogout={handleLogout} onMenuToggle={() => setSidebarOpen(true)} />

          <div className="mx-auto max-w-5xl space-y-6">
            <header>
              <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
              <p className="mt-2 text-gray-500">Manage your account and preferences</p>
            </header>

            <Card className="p-6 hover:shadow-xl">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-lg font-bold text-white shadow-md">
                    {initials}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{profile.fullName}</h2>
                    <p className="mt-1 text-sm text-gray-500">{profile.email}</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-green-700"
                >
                  Edit Profile
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">Full Name</span>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(event) => handleProfileChange('fullName', event.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-3 outline-none transition-all duration-300 focus:ring-2 focus:ring-green-500"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">Email</span>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(event) => handleProfileChange('email', event.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-3 outline-none transition-all duration-300 focus:ring-2 focus:ring-green-500"
                  />
                </label>

                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-medium text-gray-700">Phone Number</span>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(event) => handleProfileChange('phone', event.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-3 outline-none transition-all duration-300 focus:ring-2 focus:ring-green-500"
                  />
                </label>
              </div>
            </Card>

            <Card title="Security Settings" className="p-6 hover:shadow-xl">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">Current Password</span>
                  <input
                    type="password"
                    value={passwords.currentPassword}
                    onChange={(event) => handlePasswordChange('currentPassword', event.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-3 outline-none transition-all duration-300 focus:ring-2 focus:ring-green-500"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">New Password</span>
                  <input
                    type="password"
                    value={passwords.newPassword}
                    onChange={(event) => handlePasswordChange('newPassword', event.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-3 outline-none transition-all duration-300 focus:ring-2 focus:ring-green-500"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">Confirm Password</span>
                  <input
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={(event) => handlePasswordChange('confirmPassword', event.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-3 outline-none transition-all duration-300 focus:ring-2 focus:ring-green-500"
                  />
                </label>
              </div>

              <div className="mt-5 flex flex-col gap-4 border-t border-gray-100 pt-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Password Management</p>
                    <p className="mt-1 text-sm text-gray-500">Keep your trading account secure with regular password updates.</p>
                  </div>

                  <button
                    type="button"
                    className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-green-700"
                  >
                    Update Password
                  </button>
                </div>

                <Toggle
                  enabled={twoFactorEnabled}
                  onChange={setTwoFactorEnabled}
                  label="Two-factor authentication"
                  description="Add an extra verification step for sensitive account access."
                />
              </div>
            </Card>

            <Card title="Notification Settings" className="p-6 hover:shadow-xl">
              <div className="space-y-5">
                <Toggle
                  enabled={notifications.email}
                  onChange={(value) => setNotifications((current) => ({ ...current, email: value }))}
                  label="Email Notifications"
                  description="Receive portfolio summaries and important account updates by email."
                />
                <Toggle
                  enabled={notifications.sms}
                  onChange={(value) => setNotifications((current) => ({ ...current, sms: value }))}
                  label="SMS Alerts"
                  description="Get quick trade and verification alerts on your mobile number."
                />
                <Toggle
                  enabled={notifications.market}
                  onChange={(value) => setNotifications((current) => ({ ...current, market: value }))}
                  label="Market Alerts"
                  description="Stay on top of price movements, watchlist changes, and trend signals."
                />
              </div>
            </Card>

            <Card title="Appearance Settings" className="p-6 hover:shadow-xl">
              <div className="space-y-5">
                <Toggle
                  enabled={appearance.darkMode}
                  onChange={(value) => setAppearance((current) => ({ ...current, darkMode: value }))}
                  label="Dark Mode"
                  description="Preview a darker terminal-inspired workspace for low-light sessions."
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Theme Selection</label>
                  <select
                    value={appearance.theme}
                    onChange={(event) => setAppearance((current) => ({ ...current, theme: event.target.value }))}
                    className="w-full rounded-lg border border-gray-200 bg-white p-3 outline-none transition-all duration-300 focus:ring-2 focus:ring-green-500"
                  >
                    <option>Light</option>
                    <option>Dark</option>
                  </select>
                </div>
              </div>
            </Card>

            <Card title="Account Preferences" className="p-6 hover:shadow-xl">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Currency</label>
                  <select
                    value={preferences.currency}
                    onChange={(event) => setPreferences((current) => ({ ...current, currency: event.target.value }))}
                    className="w-full rounded-lg border border-gray-200 bg-white p-3 outline-none transition-all duration-300 focus:ring-2 focus:ring-green-500"
                  >
                    <option>INR</option>
                    <option>USD</option>
                    <option>EUR</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Language</label>
                  <select
                    value={preferences.language}
                    onChange={(event) => setPreferences((current) => ({ ...current, language: event.target.value }))}
                    className="w-full rounded-lg border border-gray-200 bg-white p-3 outline-none transition-all duration-300 focus:ring-2 focus:ring-green-500"
                  >
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Tamil</option>
                  </select>
                </div>
              </div>
            </Card>

            <div className="flex justify-end">
              <button
                type="button"
                className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-green-700"
              >
                Save Changes
              </button>
            </div>

            <section className="rounded-xl border border-red-200 bg-red-50 p-6">
              <h2 className="text-lg font-semibold text-red-700">Danger Zone</h2>
              <p className="mt-2 text-sm text-red-600">
                Permanently remove your account and all saved activity from StockPro.
              </p>
              <button
                type="button"
                className="mt-4 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-700"
              >
                Delete Account
              </button>
            </section>
          </div>
        </section>
      </div>
    </main>
  )
}

export default SettingsPage
