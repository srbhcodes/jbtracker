import { Link } from 'react-router-dom'
import AuthBrand from '../components/AuthBrand'

function AccountSetupPage() {
  return (
    <section className="setup-wrapper setup-page">
      <p className="screen-label">Account Setup</p>
      <div className="setup-card">
        <AuthBrand compact />
        <h2>Account Setup</h2>

        <div className="upload-box">
          <p className="upload-title">Logo Upload</p>
          <button type="button" className="upload-dropzone">
            Browse photo or drop here
          </button>
        </div>

        <h3>Company Info</h3>
        <form className="setup-form">
          <div className="setup-grid three">
            <label>
              Company Name
              <input type="text" />
            </label>
            <label>
              Organization Type
              <select>
                <option>Choose type</option>
              </select>
            </label>
            <label>
              Industry Type
              <select>
                <option>Choose industry</option>
              </select>
            </label>
          </div>

          <div className="setup-grid two">
            <label>
              Team Size
              <select>
                <option>Select size</option>
              </select>
            </label>
            <label>
              Year of Establishment
              <input type="text" />
            </label>
          </div>

          <label>
            About Us
            <textarea rows="4" />
          </label>

          <h3>Contact Info</h3>
          <div className="setup-grid three">
            <label>
              Location
              <input type="text" />
            </label>
            <label>
              Contact Number
              <div className="phone-input">
                <span className="phone-prefix">US</span>
                <input type="text" defaultValue="+1" />
              </div>
            </label>
            <label>
              Email
              <input type="email" />
            </label>
          </div>
          <Link className="btn btn-primary setup-btn" to="/account-setup/success">
            Finish Setup
          </Link>
        </form>
      </div>
    </section>
  )
}

export default AccountSetupPage
