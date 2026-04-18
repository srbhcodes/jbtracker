function JobForm({ formData, onChange, onSubmit, isSubmitting, submitLabel }) {
  return (
    <form className="form" onSubmit={onSubmit}>
      <label>
        Job Title
        <input
          name="title"
          value={formData.title}
          onChange={onChange}
          required
          placeholder="Frontend Developer"
        />
      </label>

      <label>
        Company
        <input
          name="company"
          value={formData.company}
          onChange={onChange}
          required
          placeholder="Acme Inc."
        />
      </label>

      <label>
        Location
        <input
          name="location"
          value={formData.location}
          onChange={onChange}
          required
          placeholder="Bangalore"
        />
      </label>

      <label>
        Employment Type
        <input
          name="type"
          value={formData.type}
          onChange={onChange}
          required
          placeholder="Full-time"
        />
      </label>

      <label>
        Salary
        <input
          name="salary"
          value={formData.salary}
          onChange={onChange}
          required
          placeholder="10-12 LPA"
        />
      </label>

      <label>
        Description
        <textarea
          name="description"
          value={formData.description}
          onChange={onChange}
          rows="6"
          required
        />
      </label>

      <label>
        Requirements
        <textarea
          name="requirements"
          value={formData.requirements}
          onChange={onChange}
          rows="4"
        />
      </label>

      <button className="btn btn-primary" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  )
}

export default JobForm
