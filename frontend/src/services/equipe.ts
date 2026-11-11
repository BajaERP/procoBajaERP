import type { EquipeService } from './equipeTypes'

export const DEMO_DATA_CHANGED = 'proco.demo.equipe.changed'

async function mockService() {
	const { mockEquipeService } = await import('../mocks/equipe')
	return mockEquipeService
}

export const equipeService: EquipeService = import.meta.env.DEV
	? {
			async listarIntegrantes(visualizador) {
				return (await mockService()).listarIntegrantes(visualizador)
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
			async listarIntegrantes() {
				throw new Error(
					'Módulo indisponível até a integração com o servidor.',
				)
			},
		}
