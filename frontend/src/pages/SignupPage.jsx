import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import AuthBrand from '../components/AuthBrand'
import { useAuth } from '../contexts/AuthContext'

function SignupPage() {
  const { register, user } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setBusy(true)
    try {
      await register({
        fullName: fullName.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
      })
      navigate('/account-setup', { replace: false })
    } catch (err) {
      const msg = err?.response?.data?.message || 'Could not create account. Please try again.'
      setError(msg)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="auth-wrapper signup-wrapper">
      <p className="screen-label">Sign Up</p>
      <div className="auth-page signup-page">
        <div className="auth-panel">
          <AuthBrand />
          <h2>Welcome to JobPilot</h2>
          <p className="auth-hint">
            Already have an account? <Link to="/login">Log in</Link>
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error ? (
              <p className="auth-form-error" role="alert">
                {error}
              </p>
            ) : null}
            <div className="input-grid">
              <label>
                Full Name
                <input
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  required
                />
              </label>
              <label>
                Username
                <input
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                />
              </label>
            </div>

            <label>
              Email
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            <label>
              Password
              <div className="input-with-icon">
                <input
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <span className="field-icon">◔</span>
              </div>
            </label>
            <label>
              Confirm Password
              <div className="input-with-icon">
                <input
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />
                <span className="field-icon">◔</span>
              </div>
            </label>

            <p className="terms">
              By creating an account, you agree to the <a href="#">Terms of use</a>{' '}
              and <a href="#">Privacy Policy</a>.
            </p>

            <button type="submit" className="btn btn-primary full-btn" disabled={busy}>
              {busy ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <div className="divider">OR</div>
          <div className="social-actions">
            <button type="button" className="btn social-btn">
              <span className="social-icon fb">f</span>
              Sign up with Facebook
            </button>
            <button type="button" className="btn social-btn">
              <span className="social-icon google">G</span>
              Sign up with Google
            </button>
          </div>
        </div>

        <div className="auth-image" />
      </div>
    </section>
  )
}

export default SignupPage
