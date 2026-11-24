import type { AuthUser, UserRole } from '../contexts/AuthContext'
import type { IntegranteVisivel } from './equipeTypes'

export interface ApiResumo {
	id: number
	nome: string
}

export interface ApiUsuario {
	id: number
	nome: string
	ra: string | null
	perfil: string
	gestorFinanceiro: boolean
	subsistema: ApiResumo | null
	ativo: boolean
}

export interface ApiUsuarioAtual extends ApiUsuario {
	trocaDeSenhaPendente: boolean
	permissoes: string[]
}

const roleByApiName: Record<string, UserRole> = {
	CAPITAO_ADMIN: 'capitao',
	GESTOR: 'gestor',
	LIDER: 'lider',
	MEMBRO: 'membro',
	ORIENTADOR: 'orientador',
}

const apiNameByRole: Record<UserRole, string> = {
	capitao: 'CAPITAO_ADMIN',
	gestor: 'GESTOR',
	lider: 'LIDER',
	membro: 'MEMBRO',
	orientador: 'ORIENTADOR',
}

export function mapApiRole(value: string): UserRole {
	const role = roleByApiName[value]
	if (!role)
		throw new Error(`Perfil recebido da API não reconhecido: ${value}`)
	return role
}

export function mapRoleToApi(role: UserRole): string {
	return apiNameByRole[role]
}

export function mapCurrentUser(user: ApiUsuarioAtual): AuthUser {
	if (user.ra === null)
		throw new Error('O servidor não devolveu o RA da sessão atual.')
	const role = mapApiRole(user.perfil)
	return {
		id: String(user.id),
		name: user.nome,
		ra: user.ra,
		role,
		initials: user.nome
			.split(/\s+/)
			.map((part) => part[0] ?? '')
			.filter(Boolean)
			.slice(0, 2)
			.join('')
			.toUpperCase(),
		isDemo: false,
		financial: user.gestorFinanceiro,
		subsistemaId: user.subsistema ? String(user.subsistema.id) : null,
		subsistema: user.subsistema?.nome ?? null,
		passwordChangePending: user.trocaDeSenhaPendente,
		permissions: [...user.permissoes],
	}
}

export function mapUsuario(user: ApiUsuario): IntegranteVisivel {
	return {
		id: String(user.id),
		nome: user.nome,
		identificador: user.ra,
		perfil: mapApiRole(user.perfil),
		subsistemaId: user.subsistema ? String(user.subsistema.id) : null,
		subsistema: user.subsistema?.nome ?? null,
		ativo: user.ativo,
		financeiro: user.gestorFinanceiro,
	}
}

export function mapResumo<T extends ApiResumo | null>(summary: T) {
	return summary ? { id: String(summary.id), nome: summary.nome } : null
}
