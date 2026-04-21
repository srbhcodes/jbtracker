import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import AuthBrand from '../components/AuthBrand'
import { useAuth } from '../contexts/AuthContext'

function LoginPage() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const from = location.state?.from?.pathname || '/dashboard'

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login({ emailOrUsername: emailOrUsername.trim(), password })
      navigate(from, { replace: true })
    } catch (err) {
      const msg = err?.response?.data?.message || 'Login failed. Please try again.'
      setError(msg)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="auth-wrapper login-wrapper">
      <div className="auth-page login-page">
        <div className="auth-panel">
          <AuthBrand />
          <h2>Log In to JobPilot</h2>
          <p className="auth-hint">
            Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error ? (
              <p className="auth-form-error" role="alert">
                {error}
              </p>
            ) : null}
            <label>
              Username or Email Address
              <input
                type="text"
                autoComplete="username"
                value={emailOrUsername}
                onChange={(event) => setEmailOrUsername(event.target.value)}
                required
              />
            </label>
            <label>
              Password
              <div className="input-with-icon">
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <span className="field-icon">◔</span>
              </div>
            </label>
            <Link className="small-link" to="/signup">
              Forgot your password
            </Link>
            <button type="submit" className="btn btn-primary full-btn" disabled={busy}>
              {busy ? 'Signing in...' : 'Log In'}
            </button>
          </form>

          <div className="divider">OR</div>
          <div className="social-actions">
            <button type="button" className="btn social-btn">
              <span className="social-icon fb">f</span>
              Log in with Facebook
            </button>
            <button type="button" className="btn social-btn">
              <span className="social-icon google">G</span>
              Log in with Google
            </button>
          </div>
        </div>

        <div className="auth-image" />
      </div>
    </section>
  )
}

export default LoginPage
