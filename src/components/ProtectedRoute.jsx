import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Only redirect if we're done loading and there's no user
    if (!loading && !user) {
      console.log('No user found, redirecting to login')
      navigate('/login', { replace: true })
    }
  }, [user, loading, navigate])

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If not loading and no user, don't render anything (will redirect)
  if (!user) {
    return null
  }

  // User is authenticated, render the protected content
  return children
}
