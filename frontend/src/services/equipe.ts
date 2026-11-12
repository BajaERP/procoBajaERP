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
						bloqueioPerfil: null,
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
			async consultarResponsabilidadeFinanceira(visualizador) {
				return (
					await mockService()
				).consultarResponsabilidadeFinanceira(visualizador)
			},
			async atribuirResponsabilidadeFinanceira(atorId, gestorId) {
				await (
					await mockService()
				).atribuirResponsabilidadeFinanceira(atorId, gestorId)
				window.dispatchEvent(new Event(DEMO_DATA_CHANGED))
			},
			async retirarResponsabilidadeFinanceira(atorId) {
				await (
					await mockService()
				).retirarResponsabilidadeFinanceira(atorId)
				window.dispatchEvent(new Event(DEMO_DATA_CHANGED))
			},
			async transferirResponsabilidadeFinanceira(atorId, gestorId) {
				await (
					await mockService()
				).transferirResponsabilidadeFinanceira(atorId, gestorId)
				window.dispatchEvent(new Event(DEMO_DATA_CHANGED))
			},
			async opcoesSubsistema(atorId, subsistemaId) {
				return (await mockService()).opcoesSubsistema(
					atorId,
					subsistemaId,
				)
			},
			async opcoesDefinicaoLider(atorId, subsistemaId) {
				return (await mockService()).opcoesDefinicaoLider(
					atorId,
					subsistemaId,
				)
			},
			async definirLider(atorId, subsistemaId, integranteId) {
				await (
					await mockService()
				).definirLider(atorId, subsistemaId, integranteId)
				window.dispatchEvent(new Event(DEMO_DATA_CHANGED))
			},
			async salvarSubsistema(atorId, dados) {
				await (await mockService()).salvarSubsistema(atorId, dados)
				window.dispatchEvent(new Event(DEMO_DATA_CHANGED))
			},
			async opcoesTransferenciaIntegrante(atorId, integranteId) {
				return (await mockService()).opcoesTransferenciaIntegrante(
					atorId,
					integranteId,
				)
			},
			async transferirIntegrante(atorId, integranteId, destinoId) {
				await (
					await mockService()
				).transferirIntegrante(atorId, integranteId, destinoId)
				window.dispatchEvent(new Event(DEMO_DATA_CHANGED))
			},
			async opcoesDesativacaoSubsistema(atorId, subsistemaId) {
				return (await mockService()).opcoesDesativacaoSubsistema(
					atorId,
					subsistemaId,
				)
			},
			async desativarSubsistema(atorId, subsistemaId, destinos) {
				await (
					await mockService()
				).desativarSubsistema(atorId, subsistemaId, destinos)
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
			async consultarResponsabilidadeFinanceira() {
				throw new Error(
					'Módulo indisponível até a integração com o servidor.',
				)
			},
			async atribuirResponsabilidadeFinanceira() {
				throw new Error(
					'Administração indisponível até a integração com o servidor.',
				)
			},
			async retirarResponsabilidadeFinanceira() {
				throw new Error(
					'Administração indisponível até a integração com o servidor.',
				)
			},
			async transferirResponsabilidadeFinanceira() {
				throw new Error(
					'Administração indisponível até a integração com o servidor.',
				)
			},
			async opcoesSubsistema() {
				throw new Error(
					'Administração indisponível até a integração com o servidor.',
				)
			},
			async opcoesDefinicaoLider() {
				throw new Error(
					'Administração indisponível até a integração com o servidor.',
				)
			},
			async definirLider() {
				throw new Error(
					'Administração indisponível até a integração com o servidor.',
				)
			},
			async salvarSubsistema() {
				throw new Error(
					'Administração indisponível até a integração com o servidor.',
				)
			},
			async opcoesTransferenciaIntegrante() {
				throw new Error(
					'Administração indisponível até a integração com o servidor.',
				)
			},
			async transferirIntegrante() {
				throw new Error(
					'Administração indisponível até a integração com o servidor.',
				)
			},
			async opcoesDesativacaoSubsistema() {
				throw new Error(
					'Administração indisponível até a integração com o servidor.',
				)
			},
			async desativarSubsistema() {
				throw new Error(
					'Administração indisponível até a integração com o servidor.',
				)
			},
		}
