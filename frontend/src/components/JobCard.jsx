import { Link } from 'react-router-dom'

function JobCard({ job, onDelete }) {
  return (
    <article className="card">
      <h3>{job.title}</h3>
      <p className="muted">{job.company}</p>
      <div className="meta">
        <span>{job.location}</span>
        <span>{job.type}</span>
        <span>{job.salary}</span>
      </div>

      <div className="card-actions">
        <Link className="btn" to={`/jobs/${job._id}`}>
          View
        </Link>
        <Link className="btn" to={`/jobs/${job._id}/edit`}>
          Edit
        </Link>
        <button className="btn btn-danger" onClick={() => onDelete(job._id)}>
          Delete
        </button>
      </div>
    </article>
  )
}

export default JobCard
