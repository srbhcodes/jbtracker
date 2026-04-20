import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { NavIcon } from '../components/EmployerNavIcons'
import { createJob, getJobById, updateJob } from '../services/jobService'

const initialForm = {
  title: '',
  tags: '',
  role: '',
  minSalary: '',
  maxSalary: '',
  salaryType: '',
  educationLevel: '',
  experienceLevel: '',
  type: '',
  level: '',
  expirationDate: '',
  country: '',
  location: '',
  remote: false,
  description: '',
  requirements: '',
}

const parseSalaryRange = (salaryText) => {
  const values = (salaryText || '').match(/\$?[\d,]+/g) || []
  const strip = (v) => (v || '').replace(/^\$/, '').replace(/,/g, '')
  return {
    minSalary: strip(values[0]),
    maxSalary: strip(values[1]),
  }
}

const toDateInput = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

const isoToDmy = (iso) => {
  if (!iso) return ''
  const parts = iso.split('-')
  if (parts.length !== 3) return ''
  const [y, m, d] = parts
  return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`
}

const dmyToIso = (text) => {
  const m = String(text || '')
    .trim()
    .match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (!m) return ''
  const d = Number(m[1])
  const mo = Number(m[2])
  const y = Number(m[3])
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return ''
  return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

const parseLocation = (loc) => {
  const parts = (loc || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  if (parts.length >= 2) {
    const city = parts[0]
    let country = parts[1]
    if (country === 'IN') country = 'India'
    return { city, country }
  }
  return { city: loc?.trim() || '', country: '' }
}

const normalizeJobType = (t) => {
  const v = (t || '').toLowerCase().replace(/\s+/g, ' ').trim()
  if (v === 'full time' || v === 'fulltime') return 'Full Time'
  if (v === 'part time' || v === 'parttime') return 'Part Time'
  return t || ''
}

const normalizeExperience = (e) => {
  const v = (e || '').replace(/\s+/g, ' ').trim()
  if (v === '1 - 2 years' || v === '1-2 years') return '1-2 years'
  if (v === '0 - 1 years' || v === '0-1 years') return '0-1 years'
  if (v === '2 - 4 years' || v === '2-4 years') return '2-4 years'
  return v
}

const COMBINED_REQ = '\n\nRequirements\n'

const combineJobBody = (description, requirements) => {
  const desc = (description || '').trimEnd()
  const req = (requirements || '').trim()
  if (!req) return desc
  const lines = req.split('\n').map((l) => l.trim()).filter(Boolean)
  const bullets = lines
    .map((line) => {
      if (/^[-•*]\s/.test(line)) return line.startsWith('-') ? line : `- ${line.replace(/^[•*]\s*/, '')}`
      return `- ${line}`
    })
    .join('\n')
  return `${desc}${COMBINED_REQ}${bullets}`
}

const splitJobBody = (text) => {
  const idx = text.indexOf(COMBINED_REQ)
  if (idx === -1) return { description: text.trim(), requirements: '' }
  return {
    description: text.slice(0, idx).trim(),
    requirements: text.slice(idx + COMBINED_REQ.length).trim(),
  }
}

function JobFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = useMemo(() => Boolean(id), [id])
  const [formData, setFormData] = useState(initialForm)
  const [expiryDraft, setExpiryDraft] = useState('')
  const [jobBody, setJobBody] = useState('')
  const [loading, setLoading] = useState(isEditMode)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEditMode) return

    const fetchJob = async () => {
      try {
        const data = await getJobById(id)
        const salaryParts = parseSalaryRange(data.salary)
        const { city, country } = parseLocation(data.location)
        const expIso = toDateInput(data.expiresAt)
        setFormData({
          title: data.title || '',
          tags: '',
          role: data.role || 'Designer',
          minSalary: salaryParts.minSalary,
          maxSalary: salaryParts.maxSalary,
          salaryType: (data.salary || '').toLowerCase().includes('monthly') ? 'Monthly' : 'Yearly',
          educationLevel: data.educationLevel || '',
          experienceLevel: normalizeExperience(data.experienceLevel),
          location: city || 'Bangalore',
          type: normalizeJobType(data.type) || 'Full Time',
          level: data.jobLevel || '',
          expirationDate: expIso,
          country: country || 'India',
          remote: false,
          description: data.description || '',
          requirements: data.requirements || '',
        })
        setExpiryDraft(isoToDmy(expIso))
        setJobBody(combineJobBody(data.description || '', data.requirements || ''))
        setError('')
      } catch {
        setError('Failed to load job data.')
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [id, isEditMode])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    const fmtUsd = (n) => {
      const raw = String(n || '').replace(/[$,]/g, '')
      if (!raw) return ''
      const num = Number(raw)
      if (!Number.isFinite(num)) return `$${n}`
      return `$${num.toLocaleString('en-US')}`
    }
    const salary = [fmtUsd(formData.minSalary), fmtUsd(formData.maxSalary)]
      .filter(Boolean)
      .join(' – ')

    const expiryIso = isEditMode ? dmyToIso(expiryDraft) || formData.expirationDate : formData.expirationDate
    const { description, requirements } = isEditMode
      ? splitJobBody(jobBody)
      : { description: formData.description, requirements: formData.requirements }

    const payload = {
      title: formData.title,
      company: 'Designic',
      location: [formData.location, formData.country].filter(Boolean).join(', '),
      type: formData.type || 'Full Time',
      salary: salary || formData.salaryType || 'Not specified',
      description,
      requirements,
      expiresAt: expiryIso || undefined,
      jobLevel: formData.level || '',
      experienceLevel: formData.experienceLevel || '',
      educationLevel: formData.educationLevel || '',
    }

    try {
      if (isEditMode) {
        await updateJob(id, payload)
        navigate(`/jobs/${id}`)
      } else {
        const created = await createJob(payload)
        navigate(`/jobs/${created._id}`)
      }
    } catch {
      setError('Could not save job. Try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) return <p className="state-text">Loading form...</p>

  return (
    <section className="details-page-wrap">
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

          <main className={`details-main job-form-main ${isEditMode ? 'edit-job-main' : ''}`}>
            <div className={isEditMode ? 'edit-job-card' : undefined}>
              <div className="jobs-header form-title-row">
                <h2 className="post-title">{isEditMode ? 'Edit Job Details' : 'Post a Job'}</h2>
                {isEditMode ? (
                  <button
                    className="edit-form-save-btn"
                    form="job-form"
                    disabled={isSubmitting}
                    type="submit"
                  >
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </button>
                ) : null}
              </div>
              {error ? <p className="state-text error">{error}</p> : null}

              <form className="post-job-form" id="job-form" onSubmit={handleSubmit}>
              <div className="post-grid three">
                <label>
                  Job Titles
                  <input name="title" value={formData.title} onChange={handleChange} required />
                </label>
                <label>
                  Tags
                  <input name="tags" value={formData.tags} onChange={handleChange} />
                </label>
                <label>
                  Job Role
                  <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="Designer">Designer</option>
                    <option value="UI/UX Designer">UI/UX Designer</option>
                    <option value="Frontend Developer">Frontend Developer</option>
                  </select>
                </label>
              </div>

              <h3>Salary</h3>
              <div className="post-grid three">
                <label>
                  Min Salary
                  <div className="salary-input-wrap">
                    <input name="minSalary" value={formData.minSalary} onChange={handleChange} />
                    <span>USD</span>
                  </div>
                </label>
                <label>
                  Max Salary
                  <div className="salary-input-wrap">
                    <input name="maxSalary" value={formData.maxSalary} onChange={handleChange} />
                    <span>USD</span>
                  </div>
                </label>
                <label>
                  Salary Type
                  <select name="salaryType" value={formData.salaryType} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="Yearly">Yearly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </label>
              </div>

              <h3>Advance Information</h3>
              <div className="post-grid three">
                <label>
                  Education Level
                  <select
                    name="educationLevel"
                    value={formData.educationLevel}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Graduation">Graduation</option>
                    <option value="Post Graduation">Post Graduation</option>
                  </select>
                </label>
                <label>
                  Experience Level
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="0-1 years">0-1 years</option>
                    <option value="1-2 years">1-2 years</option>
                    <option value="2-4 years">2-4 years</option>
                  </select>
                </label>
                <label>
                  Job Type
                  <select name="type" value={formData.type} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </label>
              </div>

              <div className="post-grid two">
                <label>
                  Job Level
                  <select name="level" value={formData.level} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="Entry Level">Entry Level</option>
                    <option value="Mid Level">Mid Level</option>
                  </select>
                </label>
                <label>
                  Expiration Date
                  {isEditMode ? (
                    <input
                      type="text"
                      name="expirationDisplay"
                      value={expiryDraft}
                      onChange={(e) => setExpiryDraft(e.target.value)}
                      onBlur={() => {
                        const iso = dmyToIso(expiryDraft.trim())
                        if (iso) setFormData((prev) => ({ ...prev, expirationDate: iso }))
                        else if (!expiryDraft.trim())
                          setFormData((prev) => ({ ...prev, expirationDate: '' }))
                      }}
                      placeholder="dd/mm/yyyy"
                      autoComplete="off"
                    />
                  ) : (
                    <input
                      type="date"
                      name="expirationDate"
                      value={formData.expirationDate}
                      onChange={handleChange}
                    />
                  )}
                </label>
              </div>

              <h3>Location</h3>
              <div className="post-grid two">
                <label>
                  Country
                  <select name="country" value={formData.country} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                  </select>
                </label>
                <label>
                  City
                  <select name="location" value={formData.location} onChange={handleChange} required>
                    <option value="">Select</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                  </select>
                </label>
              </div>

              <label className="remote-row">
                <input
                  type="checkbox"
                  name="remote"
                  checked={formData.remote}
                  onChange={handleChange}
                />
                Fully remote position
              </label>

              <h3>Job Descriptions</h3>
              {isEditMode ? (
                <textarea
                  className="post-description edit-job-body"
                  name="jobBody"
                  value={jobBody}
                  onChange={(e) => setJobBody(e.target.value)}
                  placeholder="Job description and requirements"
                  rows={14}
                  required
                />
              ) : (
                <>
                  <textarea
                    className="post-description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Add job description"
                    rows="8"
                    required
                  />
                </>
              )}

              {!isEditMode ? (
                <button className="btn btn-primary setup-btn" disabled={isSubmitting} type="submit">
                  {isSubmitting ? 'Saving...' : 'Post Job'}
                </button>
              ) : null}
              </form>
            </div>
          </main>
        </div>
      </div>
    </section>
  )
}

export default JobFormPage
