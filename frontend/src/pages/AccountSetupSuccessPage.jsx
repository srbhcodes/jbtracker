import { Link } from 'react-router-dom'
import AuthBrand from '../components/AuthBrand'

function AccountSetupSuccessPage() {
  return (
    <section className="setup-wrapper setup-success-page">
      <p className="screen-label">Account Setup</p>
      <div className="setup-card success-card">
        <AuthBrand compact />
        <div className="success-content">
          <div className="success-icon">✓</div>
          <h2>Congratulations, Your profile is 100% complete!</h2>
          <p className="auth-hint">Congratulations, Your profile is 100% complete!</p>
          <div className="card-actions">
            <Link className="btn soft-btn" to="/">
              View Dashboard
            </Link>
            <Link className="btn btn-primary" to="/jobs/new">
              Post a Job
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AccountSetupSuccessPage
