import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from 'react'
import { DEMO_DATA_CHANGED, equipeService } from '../services/equipe'
import {
	chooseDemoIdentity,
	identitiesForPerspective,
} from '../services/demoSession'
import type { DemoIdentity, DemoPerspective } from '../services/equipeTypes'
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
}

interface AuthContextValue {
	user: AuthUser | null
	isAuthenticated: boolean
	isReady: boolean
	login: (ra: string, password: string) => Promise<AuthUser>
	logout: () => void
	demoIdentities: DemoIdentity[]
	demoPerspective: DemoPerspective
	demoNotice: string | null
	demoRevision: number
	setDemoPerspective: (perspective: DemoPerspective) => void
	setDemoIdentity: (id: string) => void
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
	}
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(null)
	const [isReady, setReady] = useState(false)
	const [demoIdentities, setDemoIdentities] = useState<DemoIdentity[]>([])
	const [demoPerspective, setPerspective] =
		useState<DemoPerspective>('gestor')
	const [demoNotice, setNotice] = useState<string | null>(null)
	const [demoRevision, setRevision] = useState(0)
	const sessionUserId = user?.id ?? null

	useEffect(() => {
		let active = true
		async function hydrate() {
			if (import.meta.env.DEV) {
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
			}
			if (active) setReady(true)
		}
		void hydrate().catch(() => {
			if (active) {
				setNotice(
					'Não foi possível carregar as identidades demonstrativas.',
				)
				setReady(true)
			}
		})
		return () => {
			active = false
		}
	}, [])

	useEffect(() => {
		if (!import.meta.env.DEV || !isReady) return
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
		if (!import.meta.env.DEV || !isReady) return
		let active = true
		async function refresh(
			requestedId: string | null,
			perspective: DemoPerspective | null,
		) {
			const identities = (await equipeService.listarIdentidades?.()) ?? []
			if (!active) return
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
			setRevision((value) => value + 1)
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

	async function login(ra: string, password: string): Promise<AuthUser> {
		if (!import.meta.env.DEV)
			throw new Error(
				'Acesso indisponível até a integração com o servidor.',
			)
		const normalizedRa = ra.trim()
		if (!normalizedRa || !password)
			throw new Error('RA e senha são obrigatórios.')
		if (!/^\d+$/.test(normalizedRa))
			throw new Error('O RA deve conter apenas números.')
		if (normalizedRa.length > 20)
			throw new Error('O RA deve ter no máximo 20 caracteres.')
		await new Promise((resolve) => setTimeout(resolve, 250))
		const identity = await equipeService.identidadePadrao?.()
		if (!identity)
			throw new Error(
				'Nenhum Gestor ativo está disponível para a demonstração.',
			)
		const next = asAuthUser(identity)
		setUser(next)
		setPerspective(identity.financial ? 'financeiro' : 'gestor')
		setNotice(null)
		return next
	}

	function logout() {
		setUser(null)
		setNotice(null)
	}

	function setDemoPerspective(perspective: DemoPerspective) {
		if (
			!import.meta.env.DEV ||
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
		if (!import.meta.env.DEV || !user) return
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

	async function restoreDemo() {
		if (!import.meta.env.DEV || !user) return
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
		setRevision((value) => value + 1)
	}

	async function changeOwnPassword(
		currentPassword: string,
		newPassword: string,
	) {
		if (!import.meta.env.DEV || !user?.isDemo)
			throw new Error(
				'Troca indisponível até a integração com o servidor.',
			)
		await equipeService.trocarSenhaPropria(
			user.id,
			currentPassword,
			newPassword,
		)
		// The DEMO_DATA_CHANGED listener is the sole identity refresh path.
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated: !!user,
				isReady,
				login,
				logout,
				demoIdentities,
				demoPerspective,
				demoNotice,
				demoRevision,
				setDemoPerspective,
				setDemoIdentity,
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
