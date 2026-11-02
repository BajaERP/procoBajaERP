import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from 'react'

export type UserRole =
	'gestor' | 'membro' | 'financeiro' | 'lider' | 'capitao' | 'orientador'

export const ROLE_LABELS: Record<UserRole, string> = {
	capitao: 'Capitão/Administrador',
	gestor: 'Gestor',
	financeiro: 'Financeiro',
	lider: 'Líder',
	membro: 'Membro',
	orientador: 'Orientador',
}

function isUserRole(value: unknown): value is UserRole {
	return typeof value === 'string' && Object.hasOwn(ROLE_LABELS, value)
}

export interface AuthUser {
	id: string
	name: string
	ra: string
	role: UserRole
	initials: string
}

interface AuthContextValue {
	user: AuthUser | null
	isAuthenticated: boolean
	login: (ra: string, password: string) => Promise<AuthUser>
	logout: () => void
	setDemoRole: (role: UserRole) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)
const STORAGE_KEY = 'proco.auth.user'

function initialsFromName(name: string): string {
	return name
		.split(/\s+/)
		.map((p) => p[0] ?? '')
		.filter(Boolean)
		.slice(0, 2)
		.join('')
		.toUpperCase()
}

function loadStoredUser(): AuthUser | null {
	if (typeof window === 'undefined') return null
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY)
		if (!raw) return null
		const stored: unknown = JSON.parse(raw)
		if (
			typeof stored !== 'object' ||
			stored === null ||
			!('id' in stored) ||
			stored.id !== 'demo' ||
			!('name' in stored) ||
			stored.name !== 'Usuário de demonstração' ||
			!('ra' in stored) ||
			typeof stored.ra !== 'string' ||
			!stored.ra.trim() ||
			!('role' in stored) ||
			!isUserRole(stored.role) ||
			(!import.meta.env.DEV && stored.role !== 'gestor')
		)
			return null
		return {
			id: 'demo',
			name: 'Usuário de demonstração',
			ra: stored.ra,
			role: stored.role,
			initials: 'UD',
		}
	} catch {
		return null
	}
}

// This is a local demonstration session, not an authentication mechanism.
function demoUserFromRa(ra: string): AuthUser {
	return {
		id: 'demo',
		name: 'Usuário de demonstração',
		ra,
		role: 'gestor',
		initials: initialsFromName('Usuário demonstração') || 'UD',
	}
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(loadStoredUser)

	useEffect(() => {
		try {
			if (user)
				window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
			else window.localStorage.removeItem(STORAGE_KEY)
		} catch {
			// The current session remains usable in memory if storage is unavailable.
		}
	}, [user])

	async function login(ra: string, password: string): Promise<AuthUser> {
		// Any non-empty values enter the local demo; there is no server auth.
		const normalizedRa = ra.trim()
		if (!normalizedRa || !password) {
			throw new Error('RA e senha são obrigatórios.')
		}
		if (!/^\d+$/.test(normalizedRa)) {
			throw new Error('O RA deve conter apenas números.')
		}
		if (normalizedRa.length > 20) {
			throw new Error('O RA deve ter no máximo 20 caracteres.')
		}
		await new Promise((r) => setTimeout(r, 250))
		const next = demoUserFromRa(normalizedRa)
		setUser(next)
		return next
	}

	function logout() {
		setUser(null)
	}

	function setDemoRole(role: UserRole) {
		if (!import.meta.env.DEV || !isUserRole(role)) return
		setUser((current) =>
			current?.id === 'demo' ? { ...current, role } : current,
		)
	}

	const value: AuthContextValue = {
		user,
		isAuthenticated: !!user,
		login,
		logout,
		setDemoRole,
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error('useAuth must be used within AuthProvider')
	return ctx
}
