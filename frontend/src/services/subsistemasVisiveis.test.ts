import assert from 'node:assert/strict'
import test from 'node:test'
import { subsistemasVisiveis } from './equipePolicy.ts'

const subsistemas = [
	{ id: 'ativo', nome: 'Ativo', ativo: true },
	{ id: 'inativo', nome: 'Inativo', ativo: false },
]

test('administração e orientação podem filtrar por qualquer subsistema', () => {
	for (const perfil of ['capitao', 'gestor', 'orientador'] as const) {
		assert.deepEqual(
			subsistemasVisiveis(subsistemas, {
				id: 'visualizador',
				perfil,
				subsistemaId: null,
			}),
			subsistemas,
		)
	}
})

test('Líder e Membro podem filtrar apenas o próprio subsistema', () => {
	for (const perfil of ['lider', 'membro'] as const) {
		assert.deepEqual(
			subsistemasVisiveis(subsistemas, {
				id: 'visualizador',
				perfil,
				subsistemaId: 'inativo',
			}),
			[subsistemas[1]],
		)
	}
})
