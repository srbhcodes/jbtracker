import { Link, useNavigate } from 'react-router-dom'
import AuthBrand from '../components/AuthBrand'

function SignupPage() {
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    navigate('/account-setup')
  }

  return (
    <section className="auth-wrapper">
      <p className="screen-label">Sign Up</p>
      <div className="auth-page signup-page">
        <div className="auth-panel">
          <AuthBrand />
          <h2>Welcome to JobPilot</h2>
          <p className="auth-hint">
            Already have an account? <Link to="/login">Log in</Link>
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-grid">
              <label>
                Full Name
                <input type="text" required />
              </label>
              <label>
                Username
                <input type="text" required />
              </label>
            </div>

            <label>
              Email
              <input type="email" required />
            </label>
            <label>
              Password
              <div className="input-with-icon">
                <input type="password" required />
                <span className="field-icon">◔</span>
              </div>
            </label>
            <label>
              Confirm Password
              <div className="input-with-icon">
                <input type="password" required />
                <span className="field-icon">◔</span>
              </div>
            </label>

            <p className="terms">
              By creating an account, you agree to the <a href="#">Terms of use</a>{' '}
              and <a href="#">Privacy Policy</a>.
            </p>

            <button type="submit" className="btn btn-primary full-btn">
              Sign Up
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
