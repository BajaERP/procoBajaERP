import type { UserRole } from '../contexts/AuthContext'
import type { AuthUser } from '../contexts/AuthContext'

export interface PermissaoEquipe {
	id: string
	acao: string
	permitido: boolean
	escopo?: string
}

export function podeConsultarPermissoes(perfil: UserRole): boolean {
	return perfil === 'capitao' || perfil === 'gestor'
}

export function possuiPermissao(user: AuthUser, permission: string): boolean {
	if (!user.isDemo) return user.permissions.includes(permission)
	if (permission === 'EQUIPE_CONSULTAR') return true
	if (permission === 'AUDITORIA_CONSULTAR')
		return ['capitao', 'gestor', 'lider'].includes(user.role)
	if (permission === 'USUARIOS_GERENCIAR')
		return ['capitao', 'gestor'].includes(user.role)
	if (permission === 'SUBSISTEMAS_GERENCIAR')
		return ['capitao', 'gestor'].includes(user.role)
	if (permission === 'VINCULOS_GERENCIAR') return user.role === 'capitao'
	return false
}

// Catálogo informativo do módulo 1. A autorização real pertence ao servidor.
export function consultarPermissoesEquipe(
	visualizador: UserRole,
	perfil: UserRole,
	financeiro = false,
): readonly PermissaoEquipe[] | null {
	if (!podeConsultarPermissoes(visualizador)) return null

	const capitao = perfil === 'capitao'
	const administra = podeConsultarPermissoes(perfil)
	return [
		{
			id: 'subsistemas-ativos',
			acao: 'Consultar subsistemas ativos e seus líderes',
			permitido: true,
		},
		{
			id: 'composicao',
			acao: 'Consultar a composição dos subsistemas',
			permitido: true,
			escopo: administra
				? 'Todos os subsistemas'
				: perfil === 'orientador'
					? 'Somente subsistemas ativos'
					: 'Somente o próprio subsistema, inclusive inativo',
		},
		{
			id: 'desativados',
			acao: 'Consultar integrantes desativados',
			permitido: administra,
		},
		{
			id: 'identificadores',
			acao: 'Consultar RA ou SIAPE',
			permitido: true,
			escopo: administra
				? 'Todos os integrantes'
				: 'Somente o próprio RA ou SIAPE',
		},
		{
			id: 'contas',
			acao: 'Administrar contas de integrantes',
			permitido: administra,
			escopo: administra
				? capitao
					? 'Todos os perfis, respeitando os bloqueios de cada conta'
					: 'Somente Líder, Membro e Orientador'
				: undefined,
		},
		{
			id: 'subsistemas',
			acao: 'Criar, editar subsistemas, definir líderes e transferir integrantes',
			permitido: administra,
		},
		{
			id: 'desativar-subsistemas',
			acao: 'Desativar subsistemas',
			permitido: capitao,
		},
		{
			id: 'lideranca',
			acao: 'Definir líderes e transferir integrantes autorizados',
			permitido: administra,
			escopo: administra
				? 'Em operações comuns, o Líder precisa ser substituído antes de sair do subsistema, ser desativado ou mudar de perfil. Na desativação do subsistema, passa a Membro.'
				: undefined,
		},
		{
			id: 'funcoes-financeiras',
			acao: 'Acessar as funções financeiras restritas',
			permitido: capitao || (perfil === 'gestor' && financeiro),
			escopo:
				capitao || (perfil === 'gestor' && financeiro)
					? 'Caixa, compras e previsão financeira; compras exigem aprovação conjunta'
					: undefined,
		},
		{
			id: 'senha',
			acao: 'Trocar a própria senha',
			permitido: true,
		},
	]
}
