import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { NavIcon } from '../components/EmployerNavIcons'
import { deleteJob, getJobs } from '../services/jobService'

function daysRemainingFromPosted(createdAt) {
  const posted = new Date(createdAt).getTime()
  const expires = posted + 30 * 24 * 60 * 60 * 1000
  return Math.ceil((expires - Date.now()) / (24 * 60 * 60 * 1000))
}

function StatIconBriefcase() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5d62ea" strokeWidth="1.8">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}

function StatIconCandidates() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b8860b" strokeWidth="1.8">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function JobsPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openMenuId, setOpenMenuId] = useState(null)

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const data = await getJobs()
      setJobs(data)
      setError('')
    } catch {
      setError('Failed to load jobs.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest('.kebab-wrap')) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [])

  const handleDelete = async (id) => {
    const shouldDelete = window.confirm('Delete this job?')
    if (!shouldDelete) return

    try {
      await deleteJob(id)
      setJobs((prev) => prev.filter((job) => job._id !== id))
      setOpenMenuId(null)
    } catch {
      setError('Could not delete the job.')
    }
  }

  const activeJobsCount = useMemo(() => {
    const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30
    const now = Date.now()
    return jobs.filter((job) => now - new Date(job.createdAt).getTime() <= THIRTY_DAYS).length
  }, [jobs])

  const savedCandidates = jobs.length * 20

  if (loading) return <p className="state-text">Loading dashboard...</p>
  if (error) return <p className="state-text error">{error}</p>

  return (
    <section className="dashboard-page">
      <div className="dashboard-inner">
        <aside className="dashboard-sidebar">
          <p className="dashboard-title">EMPLOYERS DASHBOARD</p>
          <nav className="dashboard-nav">
            <span className="nav-item nav-item-row active">
              <NavIcon name="grid" />
              Overview
            </span>
            <button className="nav-item nav-item-row" type="button">
              <NavIcon name="user" />
              Employers profile
            </button>
            <Link className="nav-item nav-item-row link-nav" to="/jobs/new">
              <NavIcon name="plus" />
              Post a Job
            </Link>
            <Link className="nav-item nav-item-row link-nav" to="/my-jobs">
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
          <div className="sidebar-brand-row">
            <span className="sidebar-brand-mark" />
            <span className="sidebar-brand-text">JobPilot</span>
          </div>
        </aside>

        <div className="dashboard-main-wrap">
          <main className="dashboard-main">
            <h1>Hello, Designic</h1>
            <p className="dashboard-subtitle">Here is your daily activity and applications</p>

            <div className="dashboard-stats">
              <article className="stat-card lilac">
                <div className="stat-card-body">
                  <div>
                    <p className="count">{activeJobsCount}</p>
                    <p className="stat-label">Open Jobs</p>
                  </div>
                  <div className="stat-icon-box">
                    <StatIconBriefcase />
                  </div>
                </div>
              </article>
              <article className="stat-card beige">
                <div className="stat-card-body">
                  <div>
                    <p className="count">{savedCandidates}</p>
                    <p className="stat-label">Saved Candidates</p>
                  </div>
                  <div className="stat-icon-box">
                    <StatIconCandidates />
                  </div>
                </div>
              </article>
            </div>

            <div className="jobs-header">
              <h2>Recently Posted Jobs</h2>
              <Link className="view-all-link" to="/my-jobs">
                View all
              </Link>
            </div>

            {jobs.length === 0 ? (
              <p className="dashboard-empty">No jobs posted yet.</p>
            ) : (
              <div className="jobs-table">
                <div className="table-row head">
                  <span>Jobs</span>
                  <span>Status</span>
                  <span>Applications</span>
                  <span>Actions</span>
                </div>

                {jobs.map((job, index) => {
                  const daysLeft = daysRemainingFromPosted(job.createdAt)
                  const isExpired = daysLeft <= 0
                  const metaSecond = isExpired
                    ? new Date(job.createdAt).toLocaleDateString(undefined, {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : `${daysLeft} days remaining`

                  return (
                    <div className="table-row" key={job._id}>
                      <div>
                        <p className="job-name">{job.title}</p>
                        <p className="job-meta">
                          {job.type} • {metaSecond}
                        </p>
                      </div>
                      <span className={`status-cell ${isExpired ? 'expired' : 'active-status'}`}>
                        {isExpired ? (
                          <>
                            <span className="status-icon warn" aria-hidden>
                              !
                            </span>
                            Expired
                          </>
                        ) : (
                          <>
                            <span className="status-icon ok" aria-hidden>
                              ✓
                            </span>
                            Active
                          </>
                        )}
                      </span>
                      <span className="apps-cell">
                        <span className="apps-icon" aria-hidden>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                        </span>
                        {(index + 1) * 15} Applications
                      </span>
                      <div className="row-actions">
                        <Link className="view-job-btn" to={`/jobs/${job._id}`}>
                          View Job
                        </Link>
                        <div className="kebab-wrap">
                          <button
                            type="button"
                            className="kebab-btn"
                            aria-label="More actions"
                            onClick={(e) => {
                              e.stopPropagation()
                              setOpenMenuId((id) => (id === job._id ? null : job._id))
                            }}
                          >
                            ⋮
                          </button>
                          {openMenuId === job._id ? (
                            <div className="kebab-menu" role="menu">
                              <Link
                                className="kebab-item"
                                to={`/jobs/${job._id}/edit`}
                                role="menuitem"
                                onClick={() => setOpenMenuId(null)}
                              >
                                <span className="kebab-edit-icon">✎</span>
                                Edit Job
                              </Link>
                              <button
                                type="button"
                                className="kebab-item kebab-delete"
                                role="menuitem"
                                onClick={() => handleDelete(job._id)}
                              >
                                <span className="kebab-trash">🗑</span>
                                Delete Job
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      <footer className="dashboard-global-footer">
        <div className="dashboard-footer-brand">
          <span className="footer-brand-mark" />
          <span>JobPilot</span>
        </div>
        <div className="dashboard-footer-actions">
          <Link className="post-outline-btn footer-post" to="/jobs/new">
            Post a Job
          </Link>
          <span className="profile-dot" />
        </div>
      </footer>
    </section>
  )
}

export default JobsPage
