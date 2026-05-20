import { useEffect, useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { useBleeps } from '@arwes/react'
import Background from './Background.jsx'
import Scramble from './Scramble.jsx'

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

export default function AppShell() {
  const bleeps = useBleeps()
  const now = useClock()

  const playClick = () => {
    try {
      bleeps.click?.play()
    } catch {
      /* audio not ready / blocked until first interaction */
    }
  }

  const navClass = ({ isActive }) => `nav__link${isActive ? ' is-active' : ''}`

  return (
    <div className="shell">
      <Background />

      <header className="topbar">
        <div className="brand">
          <Scramble as="span">DEVSECOPS</Scramble>
          <span className="brand__slash">//</span>
          <Scramble as="span" className="brand__cursor">HUB</Scramble>
          <span className="brand__cursor blink">_</span>
        </div>
        <nav className="nav">
          <NavLink to="/" end className={navClass} onClick={playClick}>
            Dashboard
          </NavLink>
          <NavLink to="/roadmap" className={navClass} onClick={playClick}>
            Roadmap
          </NavLink>
        </nav>
      </header>

      <div className="statusline mono">
        <span>
          SYS:<span className="ok"> ONLINE</span>
        </span>
        <span>NODE: duytpk.me</span>
        <span>UPLINK: SECURE</span>
        <span>
          {now.toISOString().slice(0, 19).replace('T', ' ')} UTC
        </span>
      </div>

      <main className="shell__main">
        <Outlet />
      </main>

      <footer className="footer">
        <span>// PERSONAL DEVSECOPS HUB — LAB TERMINAL v1.0</span>
        <span>© {now.getFullYear()} duytpk · built with vite + @arwes/react</span>
      </footer>
    </div>
  )
}
