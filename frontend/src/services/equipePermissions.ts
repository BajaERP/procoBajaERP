import type { UserRole } from '../contexts/AuthContext'

export interface PermissaoEquipe {
	id: string
	acao: string
	permitido: boolean
	escopo?: string
}

export function podeConsultarPermissoes(perfil: UserRole): boolean {
	return perfil === 'capitao' || perfil === 'gestor'
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
			escopo:
				administra || perfil === 'orientador'
					? 'Todos os subsistemas'
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
			acao: 'Criar, editar e desativar subsistemas',
			permitido: administra,
		},
		{
			id: 'lideranca',
			acao: 'Definir líderes e transferir integrantes autorizados',
			permitido: administra,
			escopo: administra
				? 'Em operações comuns, substitua o Líder antes da saída; na desativação do subsistema, ele passa a Membro.'
				: undefined,
		},
		{
			id: 'atribuicao-financeira',
			acao: 'Atribuir, retirar ou transferir a responsabilidade financeira',
			permitido: capitao,
			escopo: capitao
				? 'A um Gestor ativo; no máximo um responsável por vez'
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
