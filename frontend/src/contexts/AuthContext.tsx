import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

export type UserRole =
  | 'gestor'
  | 'membro'
  | 'financeiro'
  | 'lider'
  | 'capitao'
  | 'orientador'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  initials: string
}

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<AuthUser>
  logout: () => void
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
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

// No backend yet — derive a stub user from the email. Will be replaced
// when the Spring Boot auth endpoint lands (see AGENTS.md backend integration).
function stubUserFromEmail(email: string): AuthUser {
  const local = email.split('@')[0] || 'gestor'
  const display = local.charAt(0).toUpperCase() + local.slice(1)
  return {
    id: 'stub',
    name: display,
    email,
    role: 'gestor',
    initials: initialsFromName(display) || 'GE',
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadStoredUser)

  useEffect(() => {
    if (user) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else window.localStorage.removeItem(STORAGE_KEY)
  }, [user])

  async function login(email: string, password: string): Promise<AuthUser> {
    // Simulated auth — replace with real API call once backend is wired.
    if (!email || !password) {
      throw new Error('E-mail e senha são obrigatórios.')
    }
    await new Promise((r) => setTimeout(r, 250))
    const next = stubUserFromEmail(email)
    setUser(next)
    return next
  }

  function logout() {
    setUser(null)
  }

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
