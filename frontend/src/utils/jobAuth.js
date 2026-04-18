/** postedBy may be an id string or populated object from the API */
export function jobOwnerId(job) {
  if (!job?.postedBy) return null
  const p = job.postedBy
  if (typeof p === 'object' && p !== null && p._id) {
    return String(p._id)
  }
  return String(p)
}

export function canManageJob(job, user) {
  if (!user?.id) return false
  const oid = jobOwnerId(job)
  if (!oid) return false
  return oid === String(user.id)
}
