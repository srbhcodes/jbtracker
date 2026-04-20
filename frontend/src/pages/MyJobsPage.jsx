import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { NavIcon } from '../components/EmployerNavIcons'
import DeleteJobConfirmModal from '../components/DeleteJobConfirmModal'
import { deleteJob, getJobs } from '../services/jobService'

function daysRemainingFromPosted(createdAt) {
  const posted = new Date(createdAt).getTime()
  const expires = posted + 30 * 24 * 60 * 60 * 1000
  return Math.ceil((expires - Date.now()) / (24 * 60 * 60 * 1000))
}

function MyJobsPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openMenuId, setOpenMenuId] = useState(null)
  const [pendingDeleteId, setPendingDeleteId] = useState(null)
  const [deleteBusy, setDeleteBusy] = useState(false)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs()
        setJobs(data)
      } catch {
        setError('Failed to load jobs.')
      } finally {
        setLoading(false)
      }
    }

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

  const confirmDelete = async () => {
    if (!pendingDeleteId) return
    setDeleteBusy(true)
    try {
      await deleteJob(pendingDeleteId)
      setJobs((prev) => prev.filter((job) => job._id !== pendingDeleteId))
      setPendingDeleteId(null)
      setOpenMenuId(null)
    } catch {
      setError('Could not delete the job.')
    } finally {
      setDeleteBusy(false)
    }
  }

  if (loading) return <p className="state-text">Loading my jobs...</p>
  if (error) return <p className="state-text error">{error}</p>

  return (
    <section className="details-page-wrap">
      <DeleteJobConfirmModal
        open={Boolean(pendingDeleteId)}
        onCancel={() => !deleteBusy && setPendingDeleteId(null)}
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

          <main className="details-main my-jobs-main">
            <div className="jobs-header">
              <h2>My Jobs</h2>
            </div>

            {jobs.length === 0 ? (
              <div className="employer-empty-panel">
                <p className="dashboard-empty">No jobs posted yet.</p>
              </div>
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
                                onClick={() => {
                                  setOpenMenuId(null)
                                  setPendingDeleteId(job._id)
                                }}
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
    </section>
  )
}

export default MyJobsPage
