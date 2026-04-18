function AuthBrand({ compact = false }) {
  return (
    <div className={`brand ${compact ? 'brand-compact' : ''}`}>
      <span className="brand-mark">
        <span className="brand-swipe" />
      </span>
      <span className="brand-text">JobPilot</span>
    </div>
  )
}

export default AuthBrand
