import type { UserRole } from '../contexts/AuthContext'
import type {
	CadastroIntegrante,
	AlteracaoIntegrante,
	ErrosCadastroIntegrante,
	ErrosEdicaoIntegrante,
	OpcoesCadastroIntegrante,
	PerfilCadastro,
} from './equipeTypes'

export function perfisParaCadastro(perfil: UserRole): PerfilCadastro[] {
	if (perfil === 'capitao')
		return ['capitao', 'gestor', 'membro', 'orientador']
	if (perfil === 'gestor') return ['membro', 'orientador']
	return []
}

export function podeAdministrarPerfil(ator: UserRole, alvo: UserRole): boolean {
	return (
		ator === 'capitao' ||
		(ator === 'gestor' && ['lider', 'membro', 'orientador'].includes(alvo))
	)
}

export function validarCadastroIntegrante(
	dados: CadastroIntegrante,
	opcoes: OpcoesCadastroIntegrante,
): ErrosCadastroIntegrante {
	const erros: ErrosCadastroIntegrante = {}
	if (!dados.nome.trim()) erros.nome = 'Informe o nome completo.'
	else if (dados.nome.length > 150)
		erros.nome = 'O nome deve ter até 150 caracteres.'
	const identificador = dados.perfil === 'orientador' ? 'SIAPE' : 'RA'
	if (!/^\d{1,20}$/.test(dados.identificador))
		erros.identificador = `Informe o ${identificador} com apenas números, de 1 a 20 caracteres.`
	if (!opcoes.perfis.includes(dados.perfil))
		erros.perfil = 'Você não tem permissão para cadastrar este perfil.'
	if (dados.perfil === 'capitao' && dados.subsistemaId !== null)
		erros.subsistemaId = 'O Capitão não pertence a um subsistema.'
	else if (
		dados.perfil !== 'capitao' &&
		dados.perfil !== 'orientador' &&
		!dados.subsistemaId
	)
		erros.subsistemaId = 'Selecione um subsistema.'
	else if (
		dados.subsistemaId !== null &&
		!opcoes.subsistemas.some((item) => item.id === dados.subsistemaId)
	)
		erros.subsistemaId = 'Selecione um subsistema disponível.'
	return erros
}

export class CadastroIntegranteError extends Error {
	campos: ErrosCadastroIntegrante
	constructor(message: string, campos: ErrosCadastroIntegrante = {}) {
		super(message)
		this.name = 'CadastroIntegranteError'
		this.campos = campos
	}
}

export class AdministracaoIntegranteError extends Error {
	campos: ErrosEdicaoIntegrante
	constructor(message: string, campos: ErrosEdicaoIntegrante = {}) {
		super(message)
		this.name = 'AdministracaoIntegranteError'
		this.campos = campos
	}
}

export function validarEdicaoIntegrante(
	dados: AlteracaoIntegrante,
): ErrosEdicaoIntegrante {
	const erros: ErrosEdicaoIntegrante = {}
	if (dados.nome !== undefined) {
		if (!dados.nome.trim()) erros.nome = 'Informe o nome completo.'
		else if (dados.nome.trim().length > 150)
			erros.nome = 'O nome deve ter até 150 caracteres.'
	}
	if (
		dados.identificador !== undefined &&
		!/^\d{1,20}$/.test(dados.identificador)
	)
		erros.identificador = 'Use de 1 a 20 números.'
	return erros
}
