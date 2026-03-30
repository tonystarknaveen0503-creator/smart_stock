import { Link } from 'react-router-dom'
import heroImage from '../assets/hero.png'

const marketCards = [
  { title: 'NIFTY 50', value: '22,145.60', change: '+1.12%', tone: 'profit' },
  { title: 'SENSEX', value: '73,420.18', change: '+0.94%', tone: 'profit' },
  { title: 'Top Gainers', value: 'TCS', change: '+3.48%', tone: 'profit' },
  { title: 'Top Losers', value: 'ITC', change: '-1.76%', tone: 'loss' },
]

const features = [
  'Live Stock Prices',
  'Advanced Charts',
  'Market Research (NSE/BSE)',
  'Commodities & Currency',
  'IPO Tracking',
  'Real-time Insights',
]

const insights = [
  {
    title: 'Market Trends',
    text: 'Track sector movement, momentum shifts, and key market patterns.',
  },
  {
    title: 'AI Predictions',
    text: 'Use intelligent projections to spot potential opportunities faster.',
  },
  {
    title: 'Analyst Recommendations',
    text: 'Access expert views, targets, and ratings in one clean dashboard.',
  },
]

const newsItems = [
  {
    title: 'Banking stocks rally as market sentiment improves',
    date: 'March 19, 2026',
  },
  {
    title: 'IT stocks recover after early morning correction',
    date: 'March 19, 2026',
  },
  {
    title: 'Upcoming IPOs draw attention from retail investors',
    date: 'March 18, 2026',
  },
]

const navItems = ['Home', 'Markets', 'Insights', 'News', 'IPO', 'Login']
const socialItems = ['X', 'in', 'YT']

function LandingPage() {
  return (
    <main className="landing-shell stockpro-page">
      <nav className="stockpro-navbar">
        <div className="stockpro-container stockpro-nav-inner">
          <Link to="/" className="stockpro-logo">
            StockPro
          </Link>

          <div className="stockpro-menu">
            {navItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="stockpro-menu-link">
                {item}
              </a>
            ))}
          </div>

          <Link to="/login" className="stockpro-btn stockpro-btn-primary stockpro-nav-cta">
            Get Started
          </Link>
        </div>
      </nav>

      <section className="stockpro-hero" id="home">
        <div className="stockpro-container stockpro-hero-grid">
          <div className="stockpro-hero-copy">
            <h1>Invest Smarter in the Stock Market</h1>
            <p>
              Track live prices, analyze markets, and grow your wealth with a clean, modern
              investing experience.
            </p>

            <div className="stockpro-hero-actions">
              <Link to="/login" className="stockpro-btn stockpro-btn-primary">
                Start Investing
              </Link>
              <a href="#markets" className="stockpro-btn stockpro-btn-secondary">
                View Markets
              </a>
            </div>
          </div>

          <div className="stockpro-chart-card">
            <div className="stockpro-chart-header">
              <div>
                <strong>NIFTY 50</strong>
                <span>Live Chart Preview</span>
              </div>
              <div className="stockpro-profit">+1.42%</div>
            </div>

            <div className="stockpro-chart-box">
              <svg viewBox="0 0 500 280" preserveAspectRatio="none" aria-hidden="true">
                <path
                  d="M 0 220 C 40 200, 80 210, 120 180 C 160 150, 200 160, 240 130 C 280 100, 320 120, 360 85 C 400 55, 440 70, 500 20"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="stockpro-section" id="markets">
        <div className="stockpro-container">
          <h2 className="stockpro-section-title">Live Market</h2>
          <p className="stockpro-section-subtitle">
            Stay updated with key indices, gainers, and losers in real time.
          </p>

          <div className="stockpro-market-grid">
            {marketCards.map((item) => (
              <article key={item.title} className="stockpro-card stockpro-market-card">
                <h3>{item.title}</h3>
                <strong>{item.value}</strong>
                <span className={item.tone === 'profit' ? 'stockpro-profit' : 'stockpro-loss'}>
                  {item.change}
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="stockpro-section">
        <div className="stockpro-container">
          <h2 className="stockpro-section-title">Features</h2>
          <p className="stockpro-section-subtitle">
            Everything you need for a smarter investing experience.
          </p>

          <div className="stockpro-feature-grid">
            {features.map((feature, index) => (
              <article key={feature} className="stockpro-card stockpro-feature-card">
                <div className="stockpro-icon-circle">{`${index + 1}`.padStart(2, '0')}</div>
                <h3>{feature}</h3>
                <p>Clean market tools designed for quick reading and confident decision making.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="stockpro-section" id="insights">
        <div className="stockpro-container">
          <h2 className="stockpro-section-title">Insights</h2>
          <p className="stockpro-section-subtitle">
            Professional analysis to help you read the market better.
          </p>

          <div className="stockpro-insight-grid">
            {insights.map((item) => (
              <article key={item.title} className="stockpro-card stockpro-insight-card">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="stockpro-section" id="news">
        <div className="stockpro-container">
          <h2 className="stockpro-section-title">Latest Market News</h2>
          <p className="stockpro-section-subtitle">
            Stay informed with the latest updates from the stock market.
          </p>

          <div className="stockpro-news-grid">
            {newsItems.map((item) => (
              <article key={item.title} className="stockpro-card stockpro-news-card">
                <div className="stockpro-news-image-wrap">
                  <img src={heroImage} alt={item.title} className="stockpro-news-image" />
                </div>
                <div className="stockpro-news-copy">
                  <span>{item.date}</span>
                  <h3>{item.title}</h3>
                  <p>Strong market activity keeps traders focused on fresh opportunities.</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="stockpro-section">
        <div className="stockpro-container">
          <div className="stockpro-cta">
            <h2>Start your investment journey today</h2>
            <p>Join StockPro and explore smarter tools for stock market investing.</p>
            <Link to="/login" className="stockpro-btn stockpro-cta-btn">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      <footer className="stockpro-footer">
        <div className="stockpro-container stockpro-footer-inner">
          <div className="stockpro-footer-copy">© 2026 StockPro. All rights reserved.</div>

          <div className="stockpro-footer-links">
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <a href="#privacy">Privacy</a>
          </div>

          <div className="stockpro-socials">
            {socialItems.map((item) => (
              <a key={item} href="#social">
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  )
}

export default LandingPage

