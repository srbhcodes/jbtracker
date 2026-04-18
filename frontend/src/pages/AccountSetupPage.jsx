import { useNavigate } from 'react-router-dom'
import AuthBrand from '../components/AuthBrand'

function AccountSetupPage() {
  const navigate = useNavigate()

  const handleFinish = (event) => {
    event.preventDefault()
    navigate('/account-setup/success')
  }

  return (
    <section className="setup-wrapper setup-page">
      <p className="screen-label">Account Setup</p>
      <div className="setup-card">
        <AuthBrand compact />
        <h2>Account Setup</h2>

        <div className="upload-box">
          <p className="upload-title">Logo Upload</p>
          <button type="button" className="upload-dropzone">
            <span className="upload-dropzone-icon" aria-hidden>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M7 18a4.5 4.5 0 0 1 0-9 5.5 5.5 0 0 1 10.5-2 4 4 0 0 1 .5 8z" />
                <path d="M12 13v9M8 17l4-4 4 4" />
              </svg>
            </span>
            <span className="upload-dropzone-main">Browse photo or drop here</span>
            <span className="upload-dropzone-hint">
              A photo larger than 400 pixels work best. Max file size 5 MB.
            </span>
          </button>
        </div>

        <h3>Company Info</h3>
        <form className="setup-form" onSubmit={handleFinish}>
          <div className="setup-grid three">
            <label>
              Company Name
              <input type="text" name="companyName" required />
            </label>
            <label>
              Organization Type
              <select name="orgType" required defaultValue="">
                <option value="" disabled>
                  Choose type
                </option>
                <option value="company">Company</option>
                <option value="nonprofit">Non-profit</option>
                <option value="agency">Agency</option>
              </select>
            </label>
            <label>
              Industry Type
              <select name="industry" required defaultValue="">
                <option value="" disabled>
                  Choose industry
                </option>
                <option value="tech">Technology</option>
                <option value="design">Design</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>

          <div className="setup-grid two">
            <label>
              Team Size
              <select name="teamSize" required defaultValue="">
                <option value="" disabled>
                  Select size
                </option>
                <option value="1-10">1–10</option>
                <option value="11-50">11–50</option>
                <option value="51+">51+</option>
              </select>
            </label>
            <label>
              Year of Establishment
              <input type="text" name="yearEstablished" placeholder="e.g. 2020" />
            </label>
          </div>

          <label>
            About Us
            <textarea name="about" rows="4" />
          </label>

          <h3>Contact Info</h3>
          <div className="setup-grid three">
            <label>
              Location
              <input type="text" name="location" required />
            </label>
            <label>
              Contact Number
              <div className="phone-input">
                <span className="phone-prefix">US</span>
                <input type="tel" name="phone" placeholder="+1 (555) 000-0000" />
              </div>
            </label>
            <label>
              Email
              <input type="email" name="contactEmail" required />
            </label>
          </div>
          <button type="submit" className="btn btn-primary setup-btn">
            Finish Setup
          </button>
        </form>
      </div>
    </section>
  )
}

export default AccountSetupPage
