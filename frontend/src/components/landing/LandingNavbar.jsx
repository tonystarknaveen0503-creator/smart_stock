import { Link } from 'react-router-dom'
import Button from '../ui/Button'

const navLinks = ['Home', 'Markets', 'Insights', 'News', 'IPO', 'Login']

function LandingNavbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-profit text-lg font-bold text-white shadow-card">
            SP
          </div>
          <div>
            <strong className="block text-base text-slate-950">StockPro</strong>
            <span className="block text-xs text-slate-500">Market Intelligence</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 lg:flex">
          {navLinks.map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="transition hover:text-slate-950">
              {link}
            </a>
          ))}
        </nav>

        <Button as={Link} to="/login" className="hidden sm:inline-flex">
          Get Started
        </Button>
      </div>
    </header>
  )
}

export default LandingNavbar
