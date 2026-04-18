import { useNavigate } from 'react-router-dom'
import { clearSession } from '../utils/authSession'

export function useEmployerLogout() {
  const navigate = useNavigate()
  return () => {
    clearSession()
    navigate('/login', { replace: true })
  }
}
