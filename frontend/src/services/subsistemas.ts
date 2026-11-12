import type { DadosSubsistema, ErrosSubsistema } from './equipeTypes'

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
