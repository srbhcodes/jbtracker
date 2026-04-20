import { Link, Navigate, Route, Routes } from 'react-router-dom'
import JobsPage from './pages/JobsPage'
import MyJobsPage from './pages/MyJobsPage'
import JobFormPage from './pages/JobFormPage'
import JobDetailsPage from './pages/JobDetailsPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import AccountSetupPage from './pages/AccountSetupPage'
import AccountSetupSuccessPage from './pages/AccountSetupSuccessPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/account-setup" element={<AccountSetupPage />} />
      <Route path="/account-setup/success" element={<AccountSetupSuccessPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/dashboard" element={<JobsPage />} />
      <Route path="/my-jobs" element={<MyJobsPage />} />
      <Route path="/jobs/new" element={<JobFormPage />} />
      <Route path="/jobs/:id" element={<JobDetailsPage />} />
      <Route path="/jobs/:id/edit" element={<JobFormPage />} />
      <Route path="*" element={<Link to="/dashboard">Go to Dashboard</Link>} />
    </Routes>
  )
}

export default App
