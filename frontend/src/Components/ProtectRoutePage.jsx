import { Navigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext.jsx'

// Redirects to /login if not authenticated
// If adminOnly=true, redirects to / if not admin
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen gap-3 text-sm text-gray-400">
      <div className="w-5 h-5 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
      Loading...
    </div>
  )

  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && user.role !== 'admin') return <Navigate to="/faculties" replace />

  return children
}
