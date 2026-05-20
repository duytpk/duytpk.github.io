import { Link } from 'react-router-dom'
import Scramble from '../components/Scramble.jsx'

export default function NotFound() {
  return (
    <div className="notfound">
      <h1>404</h1>
      <p className="mono">
        <Scramble as="span">SIGNAL LOST — sector not found</Scramble>
      </p>
      <p style={{ marginTop: '1.5rem' }}>
        <Link to="/" className="nav__link is-active">
          ‹ RETURN TO DASHBOARD
        </Link>
      </p>
    </div>
  )
}
