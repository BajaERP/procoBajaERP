import type { EquipeService } from './equipeTypes'

export const equipeService: EquipeService = import.meta.env.DEV
	? {
			async listarIntegrantes(visualizador) {
				const { mockEquipeService } = await import('../mocks/equipe')
				return mockEquipeService.listarIntegrantes(visualizador)
			},
			async simularFalhaNaProximaConsulta() {
				const { mockEquipeService } = await import('../mocks/equipe')
				mockEquipeService.simularFalhaNaProximaConsulta?.()
			},
		}
	: {
			async listarIntegrantes() {
				throw new Error(
					'Módulo indisponível até a integração com o servidor.',
				)
			},
		}
