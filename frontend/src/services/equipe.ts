import type { EquipeService } from './equipeTypes'

export const DEMO_DATA_CHANGED = 'proco.demo.equipe.changed'

async function mockService() {
	const { mockEquipeService } = await import('../mocks/equipe')
	return mockEquipeService
}

export const equipeService: EquipeService = import.meta.env.DEV
	? {
			async obterDetalheIntegrante(visualizador, integranteId) {
				return (
					(await mockService()).obterDetalheIntegrante?.(
						visualizador,
						integranteId,
					) ?? null
				)
			},
			async opcoesAdministracaoIntegrante(atorId, integranteId) {
				return (
					(await mockService()).opcoesAdministracaoIntegrante?.(
						atorId,
						integranteId,
					) ?? {
						perfis: [],
						subsistemas: [],
						podeEditarDados: false,
						podeAlterarStatus: false,
						podeRedefinirSenha: false,
						bloqueioStatus: null,
					}
				)
			},
			async administrarIntegrante(atorId, integranteId, alteracoes) {
				await (
					await mockService()
				).administrarIntegrante?.(atorId, integranteId, alteracoes)
				window.dispatchEvent(new Event(DEMO_DATA_CHANGED))
			},
			async redefinirSenhaProvisoria(atorId, integranteId) {
				const password = await (
					await mockService()
				).redefinirSenhaProvisoria?.(atorId, integranteId)
				if (!password)
					throw new Error('Não foi possível redefinir a senha.')
				window.dispatchEvent(new Event(DEMO_DATA_CHANGED))
				return password
			},
			async opcoesCadastroIntegrante(atorId) {
				return (await mockService()).opcoesCadastroIntegrante(atorId)
			},
			async cadastrarIntegrante(atorId, dados) {
				const result = await (
					await mockService()
				).cadastrarIntegrante(atorId, dados)
				window.dispatchEvent(new Event(DEMO_DATA_CHANGED))
				return result
			},
			async simularFalhaNoProximoCadastro() {
				await (await mockService()).simularFalhaNoProximoCadastro?.()
			},
			async listarIntegrantes(visualizador) {
				return (await mockService()).listarIntegrantes(visualizador)
			},
			async listarSubsistemas(visualizador) {
				return (await mockService()).listarSubsistemas(visualizador)
			},
			async opcoesSubsistema(atorId, subsistemaId) {
				return (await mockService()).opcoesSubsistema(
					atorId,
					subsistemaId,
				)
			},
			async salvarSubsistema(atorId, dados) {
				await (await mockService()).salvarSubsistema(atorId, dados)
				window.dispatchEvent(new Event(DEMO_DATA_CHANGED))
			},
			async simularFalhaNaProximaConsulta() {
				;(await mockService()).simularFalhaNaProximaConsulta?.()
			},
			async listarIdentidades() {
				return (await mockService()).listarIdentidades?.() ?? []
			},
			async obterIdentidade(id) {
				return (await mockService()).obterIdentidade?.(id) ?? null
			},
			async identidadePadrao() {
				return (await mockService()).identidadePadrao?.() ?? null
			},
			async restaurarDadosDemo() {
				await (await mockService()).restaurarDadosDemo?.()
			},
			async atualizarIntegranteDemo(id, changes) {
				await (
					await mockService()
				).atualizarIntegranteDemo?.(id, changes)
				window.dispatchEvent(new Event(DEMO_DATA_CHANGED))
			},
		}
	: {
			async obterDetalheIntegrante() {
				throw new Error(
					'Detalhes indisponíveis até a integração com o servidor.',
				)
			},
			async opcoesAdministracaoIntegrante() {
				throw new Error(
					'Administração indisponível até a integração com o servidor.',
				)
			},
			async administrarIntegrante() {
				throw new Error(
					'Administração indisponível até a integração com o servidor.',
				)
			},
			async redefinirSenhaProvisoria() {
				throw new Error(
					'Redefinição indisponível até a integração com o servidor.',
				)
			},
			async opcoesCadastroIntegrante() {
				throw new Error(
					'Cadastro indisponível até a integração com o servidor.',
				)
			},
			async cadastrarIntegrante() {
				throw new Error(
					'Cadastro indisponível até a integração com o servidor.',
				)
			},
			async listarIntegrantes() {
				throw new Error(
					'Módulo indisponível até a integração com o servidor.',
				)
			},
			async listarSubsistemas() {
				throw new Error(
					'Módulo indisponível até a integração com o servidor.',
				)
			},
			async opcoesSubsistema() {
				throw new Error(
					'Administração indisponível até a integração com o servidor.',
				)
			},
			async salvarSubsistema() {
				throw new Error(
					'Administração indisponível até a integração com o servidor.',
				)
			},
		}
