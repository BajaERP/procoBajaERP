import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { PasswordChangeForm } from '../components/pages/configuracoes/PasswordChangeForm'

interface ProtectedRouteProps {
	children: ReactNode
}

// Guards /app/* — redirects unauthenticated users to /login while
// remembering the attempted destination.
export function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { isAuthenticated, isReady, user } = useAuth()
	const location = useLocation()
	if (!isReady) return <div role="status">Carregando sessão...</div>

	if (!isAuthenticated) {
		const from = `${location.pathname}${location.search}${location.hash}`
		return <Navigate to="/login" replace state={{ from }} />
	}
	if (user?.passwordChangePending) return <PasswordChangeForm required />
	return <>{children}</>
}
