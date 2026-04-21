import { Link, Navigate, Route, Routes } from 'react-router-dom'
import JobsPage from './pages/JobsPage'
import MyJobsPage from './pages/MyJobsPage'
import JobFormPage from './pages/JobFormPage'
import JobDetailsPage from './pages/JobDetailsPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import AccountSetupPage from './pages/AccountSetupPage'
import AccountSetupSuccessPage from './pages/AccountSetupSuccessPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/account-setup" element={<AccountSetupPage />} />
      <Route path="/account-setup/success" element={<AccountSetupSuccessPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <JobsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-jobs"
        element={
          <ProtectedRoute>
            <MyJobsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/jobs/new"
        element={
          <ProtectedRoute>
            <JobFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/jobs/:id"
        element={
          <ProtectedRoute>
            <JobDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/jobs/:id/edit"
        element={
          <ProtectedRoute>
            <JobFormPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Link to="/dashboard">Go to Dashboard</Link>} />
    </Routes>
  )
}

export default App
