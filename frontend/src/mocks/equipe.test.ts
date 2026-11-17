import assert from 'node:assert/strict'
import test from 'node:test'

const values = new Map<string, string>()
const localStorage = {
	getItem: (key: string) => values.get(key) ?? null,
	setItem: (key: string, value: string) => values.set(key, value),
	removeItem: (key: string) => values.delete(key),
}
Object.defineProperty(globalThis, 'window', {
	configurable: true,
	value: {
		localStorage,
		setTimeout: (callback: () => void) => {
			callback()
			return 0
		},
	},
})

const { mockEquipeService } = await import('./equipe.ts')

test('serviço demo oferece destinos inativos e publica transferência persistida', async () => {
	const options = await mockEquipeService.opcoesTransferenciaIntegrante(
		'ana',
		'elisa',
	)
	assert.ok(
		options.destinos.some((item) => item.id === 'inativo' && !item.ativo),
	)
	await mockEquipeService.transferirIntegrante('ana', 'elisa', 'inativo')
	const query = await mockEquipeService.listarSubsistemas({
		id: 'ana',
		perfil: 'capitao',
		subsistemaId: null,
	})
	assert.ok(
		query.subsistemas
			.find((item) => item.id === 'inativo')
			?.integrantes?.some((item) => item.id === 'elisa'),
	)
})

test('serviço demo exige e aplica destinos individuais na desativação', async () => {
	const options = await mockEquipeService.opcoesDesativacaoSubsistema(
		'ana',
		'eletrica',
	)
	assert.ok(options.integrantes.some((item) => item.id === 'gabriel'))
	assert.ok(options.destinos.every((item) => item.ativo))
	await assert.rejects(
		mockEquipeService.desativarSubsistema('ana', 'eletrica', {}),
		/subsistema ativo/i,
	)
	await mockEquipeService.desativarSubsistema('ana', 'eletrica', {
		gabriel: 'chassi',
		helena: 'projeto',
	})
	const query = await mockEquipeService.listarSubsistemas({
		id: 'ana',
		perfil: 'capitao',
		subsistemaId: null,
	})
	assert.equal(
		query.subsistemas.find((item) => item.id === 'eletrica')?.ativo,
		false,
	)
	assert.equal(
		query.subsistemas.find((item) => item.id === 'chassi')?.lider?.id,
		'diego',
	)
})
