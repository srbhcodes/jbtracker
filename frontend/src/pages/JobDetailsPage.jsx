import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { NavIcon } from '../components/EmployerNavIcons'
import DeleteJobConfirmModal from '../components/DeleteJobConfirmModal'
import { deleteJob, getJobById } from '../services/jobService'

const fmtDetailDate = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const iconProps = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
  stroke: '#2563eb',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function OverviewGlyph({ name }) {
  switch (name) {
    case 'calendar':
      return (
        <svg {...iconProps} aria-hidden>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      )
    case 'clock':
      return (
        <svg {...iconProps} aria-hidden>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      )
    case 'layers':
      return (
        <svg {...iconProps} aria-hidden>
          <path d="M12 2 2 7l10 5 10-5-10-5z" />
          <path d="m2 17 10 5 10-5M2 12l10 5 10-5" />
        </svg>
      )
    case 'briefcase':
      return (
        <svg {...iconProps} aria-hidden>
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        </svg>
      )
    case 'grad':
      return (
        <svg {...iconProps} aria-hidden>
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
        </svg>
      )
    case 'map':
      return (
        <svg {...iconProps} aria-hidden>
          <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      )
    default:
      return null
  }
}

function JobDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteBusy, setDeleteBusy] = useState(false)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await getJobById(id)
        setJob(data)
        setError('')
      } catch {
        setError('Could not load this job.')
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [id])

  const confirmDelete = async () => {
    setDeleteBusy(true)
    try {
      await deleteJob(id)
      navigate('/my-jobs')
    } catch {
      setError('Could not delete this job.')
      setDeleteModalOpen(false)
    } finally {
      setDeleteBusy(false)
    }
  }

  const requirementItems = (job?.requirements || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)

  if (loading) return <p className="state-text">Loading my job details...</p>
  if (error) return <p className="state-text error">{error}</p>
  if (!job) return null

  return (
    <section className="details-page-wrap">
      <DeleteJobConfirmModal
        open={deleteModalOpen}
        onCancel={() => !deleteBusy && setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        busy={deleteBusy}
      />
      <div className="details-shell">
        <header className="details-header employer-top-bar">
          <div className="dashboard-footer-brand">
            <span className="footer-brand-mark" aria-hidden />
            <span>JobPilot</span>
          </div>
          <div className="dashboard-footer-actions">
            <Link className="post-outline-btn footer-post" to="/jobs/new">
              Post a Job
            </Link>
            <span className="profile-dot" />
          </div>
        </header>

        <div className="details-layout">
          <aside className="dashboard-sidebar">
            <p className="dashboard-title">EMPLOYERS DASHBOARD</p>
            <nav className="dashboard-nav">
              <Link className="nav-item nav-item-row link-nav" to="/dashboard">
                <NavIcon name="grid" />
                Overview
              </Link>
              <button className="nav-item nav-item-row" type="button">
                <NavIcon name="user" />
                Employers profile
              </button>
              <Link className="nav-item nav-item-row link-nav" to="/jobs/new">
                <NavIcon name="plus" />
                Post a Job
              </Link>
              <Link className="nav-item nav-item-row active link-nav" to="/my-jobs">
                <NavIcon name="briefcase" />
                My Jobs
              </Link>
              <button className="nav-item nav-item-row" type="button">
                <NavIcon name="bookmark" />
                Saved Candidate
              </button>
              <button className="nav-item nav-item-row" type="button">
                <NavIcon name="card" />
                Plans & Billing
              </button>
              <button className="nav-item nav-item-row" type="button">
                <NavIcon name="settings" />
                Settings
              </button>
            </nav>
            <button className="nav-item nav-item-row logout" type="button">
              <NavIcon name="logout" />
              Log Out
            </button>
          </aside>

          <main className="details-main">
            <div className="jobs-header">
              <h2>Job Details</h2>
              <div className="details-actions">
                <button
                  className="delete-job-btn"
                  type="button"
                  onClick={() => setDeleteModalOpen(true)}
                  aria-label="Delete job"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <path
                      d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6"
                      stroke="#e2554c"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <Link className="view-job-btn edit-btn" to={`/jobs/${job._id}/edit`}>
                  Edit Job
                </Link>
              </div>
            </div>

            <div className="details-content-grid">
              <section className="details-left">
                <h3>{job.title}</h3>
                <p className="description">{job.description}</p>

                <h4>Requirements</h4>
                {requirementItems.length > 0 ? (
                  <ul>
                    {requirementItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="description">No specific requirements mentioned.</p>
                )}
              </section>

              <aside className="details-right">
                <div className="summary-card salary">
                  <div className="salary-amt-block">
                    <p>Salary (USD)</p>
                    <strong>{job.salary}</strong>
                    <span>Yearly salary</span>
                  </div>
                  <div className="salary-loc-block">
                    <span className="salary-loc-icon">
                      <OverviewGlyph name="map" />
                    </span>
                    <div>
                      <p>Job Location</p>
                      <strong>{job.location}</strong>
                    </div>
                  </div>
                </div>

                <div className="summary-card">
                  <h4>Job Overview</h4>
                  <div className="overview-grid">
                    <div className="overview-cell">
                      <OverviewGlyph name="calendar" />
                      <div>
                        <p>Job Posted</p>
                        <strong>{fmtDetailDate(job.createdAt)}</strong>
                      </div>
                    </div>
                    <div className="overview-cell">
                      <OverviewGlyph name="clock" />
                      <div>
                        <p>Job Expires on</p>
                        <strong>{fmtDetailDate(job.expiresAt)}</strong>
                      </div>
                    </div>
                    <div className="overview-cell">
                      <OverviewGlyph name="layers" />
                      <div>
                        <p>Job Level</p>
                        <strong>{job.jobLevel || '—'}</strong>
                      </div>
                    </div>
                    <div className="overview-cell">
                      <OverviewGlyph name="briefcase" />
                      <div>
                        <p>Experience</p>
                        <strong>{job.experienceLevel || '—'}</strong>
                      </div>
                    </div>
                    <div className="overview-cell overview-cell-wide">
                      <OverviewGlyph name="grad" />
                      <div>
                        <p>Education</p>
                        <strong>{job.educationLevel || '—'}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </main>
        </div>
      </div>
    </section>
  )
}

export default JobDetailsPage
