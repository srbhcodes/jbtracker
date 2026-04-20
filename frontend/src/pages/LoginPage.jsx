import { Link, useNavigate } from 'react-router-dom'
import AuthBrand from '../components/AuthBrand'

function LoginPage() {
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    navigate('/dashboard')
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
            <label>
              Username or Email Address
              <input type="text" required />
            </label>
            <label>
              Password
              <div className="input-with-icon">
                <input type="password" required />
                <span className="field-icon">◔</span>
              </div>
            </label>
            <Link className="small-link" to="/signup">
              Forgot your password
            </Link>
            <button type="submit" className="btn btn-primary full-btn">
              Log In
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
