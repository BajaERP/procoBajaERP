import type { DadosSubsistema, ErrosSubsistema } from './equipeTypes'
import type { UserRole } from '../contexts/AuthContext'

const PERFIL_LABELS: Record<UserRole, string> = {
	capitao: 'Capitão/Administrador',
	gestor: 'Gestor',
	lider: 'Líder',
	membro: 'Membro',
	orientador: 'Orientador',
}

export function labelPerfilSubsistema(
	perfil: UserRole,
	financeiro = false,
): string {
	if (perfil === 'gestor' && financeiro) return 'Gestor Financeiro'
	return PERFIL_LABELS[perfil]
}

export function siglaSubsistema(nome: string): string {
	const palavras = nome.trim().split(/\s+/).filter(Boolean)
	if (!palavras.length) return ''
	const sigla =
		palavras.length > 1
			? palavras
					.filter(
						(palavra) => palavra.toLocaleLowerCase('pt-BR') !== 'e',
					)
					.slice(0, 2)
					.map((palavra) => Array.from(palavra)[0])
					.join('')
			: Array.from(palavras[0]).slice(0, 2).join('')
	return sigla
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLocaleUpperCase('pt-BR')
}

export class SubsistemaError extends Error {
	campos: ErrosSubsistema

	constructor(message: string, campos: ErrosSubsistema = {}) {
		super(message)
		this.name = 'SubsistemaError'
		this.campos = campos
	}
}

export function validarSubsistema(dados: DadosSubsistema): ErrosSubsistema {
	const erros: ErrosSubsistema = {}
	const nome = dados.nome.trim()
	if (!nome) erros.nome = 'Informe o nome do subsistema.'
	else if (nome.length > 120) erros.nome = 'Use até 120 caracteres.'
	return erros
}
