import {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
	type ReactNode,
} from 'react'
import { DEMO_DATA_CHANGED, equipeService } from '../services/equipe'
import {
	chooseDemoIdentity,
	identitiesForPerspective,
} from '../services/demoSession'
import type { DemoIdentity, DemoPerspective } from '../services/equipeTypes'
import { DEMO_MODE } from '../services/demoMode'
import {
	AUTH_SESSION_EXPIRED,
	AUTH_USER_CHANGED,
	authApi,
} from '../services/authApi'
import { ApiError } from '../services/apiClient'
import { mapCurrentUser } from '../services/apiMappers'
import {
	DEMO_DATA_KEY,
	DEMO_SESSION_KEY as STORAGE_KEY,
} from '../services/demoStorage'

export type UserRole = 'gestor' | 'membro' | 'lider' | 'capitao' | 'orientador'

export const ROLE_LABELS: Record<UserRole, string> = {
	capitao: 'Capitão/Administrador',
	gestor: 'Gestor',
	lider: 'Líder',
	membro: 'Membro',
	orientador: 'Orientador',
}

export const DEMO_PERSPECTIVE_LABELS: Record<DemoPerspective, string> = {
	...ROLE_LABELS,
	financeiro: 'Gestor Financeiro',
}

export interface AuthUser {
	id: string
	name: string
	ra: string
	role: UserRole
	initials: string
	isDemo: boolean
	financial: boolean
	subsistemaId: string | null
	subsistema: string | null
	passwordChangePending: boolean
	permissions: string[]
}

interface AuthContextValue {
	user: AuthUser | null
	isAuthenticated: boolean
	isReady: boolean
	login: (ra: string, password: string) => Promise<AuthUser>
	logout: () => Promise<void>
	sessionError: string | null
	retrySession: () => Promise<void>
	demoIdentities: DemoIdentity[]
	demoPerspective: DemoPerspective
	demoNotice: string | null
	dataRevision: number
	setDemoPerspective: (perspective: DemoPerspective) => void
	setDemoIdentity: (id: string) => void
	adotarIdentidadeDemo: (
		id: string,
		perspective: DemoPerspective,
	) => Promise<void>
	restoreDemo: () => Promise<void>
	changeOwnPassword: (
		currentPassword: string,
		newPassword: string,
	) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function initialsFromName(name: string): string {
	return name
		.split(/\s+/)
		.map((part) => part[0] ?? '')
		.filter(Boolean)
		.slice(0, 2)
		.join('')
		.toUpperCase()
}

function readStoredSession(): {
	id: string
	perspective: DemoPerspective | null
} | null {
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY)
		if (!raw) return null
		const parsed: unknown = JSON.parse(raw)
		if (
			!parsed ||
			typeof parsed !== 'object' ||
			!('id' in parsed) ||
			typeof parsed.id !== 'string'
		)
			return null
		const perspective =
			'perspective' in parsed &&
			typeof parsed.perspective === 'string' &&
			Object.hasOwn(DEMO_PERSPECTIVE_LABELS, parsed.perspective)
				? (parsed.perspective as DemoPerspective)
				: null
		return { id: parsed.id, perspective }
	} catch {
		return null
	}
}

function asAuthUser(identity: DemoIdentity): AuthUser {
	return {
		...identity,
		initials: initialsFromName(identity.name),
		isDemo: true,
		permissions: [],
	}
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(null)
	const [isReady, setReady] = useState(false)
	const [sessionError, setSessionError] = useState<string | null>(null)
	const [demoIdentities, setDemoIdentities] = useState<DemoIdentity[]>([])
	const [demoPerspective, setPerspective] =
		useState<DemoPerspective>('gestor')
	const [demoNotice, setNotice] = useState<string | null>(null)
	const [dataRevision, setDataRevision] = useState(0)
	const identityRefresh = useRef(0)
	const sessionUserId = user?.id ?? null

	useEffect(() => {
		let active = true
		async function hydrate() {
			if (DEMO_MODE) {
				const identities =
					(await equipeService.listarIdentidades?.()) ?? []
				if (!active) return
				setDemoIdentities(identities)
				const stored = readStoredSession()
				if (stored) {
					const chosen = chooseDemoIdentity(
						identities,
						stored.id,
						stored.perspective,
					)
					setUser(
						chosen.identity ? asAuthUser(chosen.identity) : null,
					)
					setPerspective(chosen.perspective)
					setNotice(chosen.notice)
				}
			} else {
				try {
					const current = await authApi.currentUser()
					if (active) setUser(mapCurrentUser(current))
				} catch (error) {
					if (error instanceof ApiError && error.status === 401) {
						if (active) setUser(null)
					} else if (active) {
						setSessionError(
							'Não foi possível verificar sua sessão. Verifique a conexão e tente novamente.',
						)
					}
				}
			}
			if (active) setReady(true)
		}
		void hydrate().catch(() => {
			if (active) {
				if (DEMO_MODE)
					setNotice(
						'Não foi possível carregar as identidades demonstrativas.',
					)
				else
					setSessionError(
						'Não foi possível verificar sua sessão. Verifique a conexão e tente novamente.',
					)
				setReady(true)
			}
		})
		return () => {
			active = false
		}
	}, [])

	useEffect(() => {
		if (!DEMO_MODE || !isReady) return
		try {
			if (sessionUserId)
				window.localStorage.setItem(
					STORAGE_KEY,
					JSON.stringify({
						id: sessionUserId,
						perspective: demoPerspective,
					}),
				)
			else window.localStorage.removeItem(STORAGE_KEY)
		} catch {
			// The current page remains usable if browser storage is unavailable.
		}
	}, [demoPerspective, isReady, sessionUserId])

	useEffect(() => {
		if (!DEMO_MODE || !isReady) return
		let active = true
		async function refresh(
			requestedId: string | null,
			perspective: DemoPerspective | null,
		) {
			const refreshId = ++identityRefresh.current
			const identities = (await equipeService.listarIdentidades?.()) ?? []
			if (!active || refreshId !== identityRefresh.current) return
			setDemoIdentities(identities)
			if (requestedId) {
				const chosen = chooseDemoIdentity(
					identities,
					requestedId,
					perspective,
				)
				setUser(chosen.identity ? asAuthUser(chosen.identity) : null)
				setNotice(chosen.notice)
				setPerspective(chosen.perspective)
			} else setUser(null)
			setDataRevision((value) => value + 1)
		}
		function onChange(event: Event) {
			if (
				event instanceof StorageEvent &&
				(event.storageArea !== window.localStorage ||
					(event.key !== null &&
						event.key !== STORAGE_KEY &&
						event.key !== DEMO_DATA_KEY))
			)
				return
			const stored =
				event instanceof StorageEvent &&
				(event.key === STORAGE_KEY || event.key === null)
					? readStoredSession()
					: { id: user?.id ?? null, perspective: demoPerspective }
			void refresh(stored?.id ?? null, stored?.perspective ?? null)
		}
		window.addEventListener(DEMO_DATA_CHANGED, onChange)
		window.addEventListener('storage', onChange)
		return () => {
			active = false
			window.removeEventListener(DEMO_DATA_CHANGED, onChange)
			window.removeEventListener('storage', onChange)
		}
	}, [demoPerspective, isReady, user?.id])

	async function refreshServerUser() {
		try {
			const current = await authApi.currentUser()
			setUser(mapCurrentUser(current))
			setSessionError(null)
		} catch (error) {
			if (error instanceof ApiError && error.status === 401) {
				setUser(null)
				setSessionError('Sua sessão expirou. Entre novamente.')
			} else {
				setSessionError(
					'Não foi possível atualizar sua sessão. Verifique a conexão e tente novamente.',
				)
			}
		}
	}

	useEffect(() => {
		if (DEMO_MODE || !isReady) return
		function onExpired() {
			setUser(null)
			setSessionError('Sua sessão expirou. Entre novamente.')
		}
		function onUserChanged() {
			setDataRevision((value) => value + 1)
			void refreshServerUser()
		}
		window.addEventListener(AUTH_SESSION_EXPIRED, onExpired)
		window.addEventListener(AUTH_USER_CHANGED, onUserChanged)
		return () => {
			window.removeEventListener(AUTH_SESSION_EXPIRED, onExpired)
			window.removeEventListener(AUTH_USER_CHANGED, onUserChanged)
		}
	}, [isReady])

	async function retrySession() {
		if (DEMO_MODE) return
		setSessionError(null)
		setReady(false)
		await refreshServerUser()
		setReady(true)
	}

	async function login(ra: string, password: string): Promise<AuthUser> {
		const normalizedRa = ra.trim()
		if (!normalizedRa || !password)
			throw new Error('RA e senha são obrigatórios.')
		if (!/^\d+$/.test(normalizedRa))
			throw new Error('O RA deve conter apenas números.')
		if (normalizedRa.length > 20)
			throw new Error('O RA deve ter no máximo 20 caracteres.')
		if (!DEMO_MODE) {
			const next = mapCurrentUser(
				await authApi.login(normalizedRa, password),
			)
			setUser(next)
			setSessionError(null)
			setNotice(null)
			return next
		}
		await new Promise((resolve) => setTimeout(resolve, 250))
		const identity = await equipeService.identidadePadrao?.()
		if (!identity)
			throw new Error(
				'Nenhum Gestor ativo está disponível para a demonstração.',
			)
		const next = asAuthUser(identity)
		setUser(next)
		setPerspective(identity.financial ? 'financeiro' : 'gestor')
		setSessionError(null)
		setNotice(null)
		return next
	}

	async function logout() {
		if (!DEMO_MODE) {
			try {
				await authApi.logout()
			} catch (error) {
				if (!(error instanceof ApiError && error.status === 401))
					throw error
			}
		}
		setUser(null)
		setNotice(null)
		setSessionError(null)
	}

	function setDemoPerspective(perspective: DemoPerspective) {
		if (
			!DEMO_MODE ||
			!user ||
			!Object.hasOwn(DEMO_PERSPECTIVE_LABELS, perspective)
		)
			return
		const options = identitiesForPerspective(demoIdentities, perspective)
		if (options.length === 0) {
			setNotice(
				`Nenhuma pessoa ativa disponível para ${DEMO_PERSPECTIVE_LABELS[perspective]}.`,
			)
			return
		}
		setPerspective(perspective)
		const next = options.find((item) => item.id === user.id) ?? options[0]
		setUser(asAuthUser(next))
		setNotice(null)
	}

	function setDemoIdentity(id: string) {
		if (!DEMO_MODE || !user) return
		const identity = identitiesForPerspective(
			demoIdentities,
			demoPerspective,
		).find((item) => item.id === id)
		if (!identity) {
			setNotice('A identidade selecionada não está disponível.')
			return
		}
		setUser(asAuthUser(identity))
		setNotice(null)
	}

	async function adotarIdentidadeDemo(
		id: string,
		perspective: DemoPerspective,
	) {
		if (!DEMO_MODE)
			throw new Error('A troca de identidade só existe na demonstração.')
		const refreshId = ++identityRefresh.current
		const identities = (await equipeService.listarIdentidades?.()) ?? []
		if (refreshId !== identityRefresh.current) return
		const identity = identitiesForPerspective(identities, perspective).find(
			(item) => item.id === id,
		)
		if (!identity)
			throw new Error('A identidade atualizada não está disponível.')
		setDemoIdentities(identities)
		setUser(asAuthUser(identity))
		setPerspective(perspective)
		setNotice(null)
		setDataRevision((value) => value + 1)
	}

	async function restoreDemo() {
		if (!DEMO_MODE || !user) return
		await equipeService.restaurarDadosDemo?.()
		const identities = (await equipeService.listarIdentidades?.()) ?? []
		const identity = await equipeService.identidadePadrao?.()
		setDemoIdentities(identities)
		setUser(identity ? asAuthUser(identity) : null)
		setPerspective('gestor')
		setNotice(
			identity
				? 'Dados demonstrativos restaurados.'
				: 'Nenhum Gestor ativo está disponível para a demonstração.',
		)
		setDataRevision((value) => value + 1)
	}

	async function changeOwnPassword(
		currentPassword: string,
		newPassword: string,
	) {
		if (DEMO_MODE) {
			if (!user?.isDemo)
				throw new Error('A sessão demonstrativa não está disponível.')
			await equipeService.trocarSenhaPropria(
				user.id,
				currentPassword,
				newPassword,
			)
			return
		}
		await authApi.changePassword(currentPassword, newPassword)
		setUser((current) =>
			current ? { ...current, passwordChangePending: false } : current,
		)
		void refreshServerUser()
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated: !!user,
				isReady,
				sessionError,
				retrySession,
				login,
				logout,
				demoIdentities,
				demoPerspective,
				demoNotice,
				dataRevision,
				setDemoPerspective,
				setDemoIdentity,
				adotarIdentidadeDemo,
				restoreDemo,
				changeOwnPassword,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth(): AuthContextValue {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error('useAuth must be used within AuthProvider')
	return ctx
}
