import assert from 'node:assert/strict'
import test from 'node:test'
import { createDemoStore } from './equipeStore.ts'

function storage() {
	const values = new Map<string, string>()
	return {
		getItem: (key: string) => values.get(key) ?? null,
		setItem: (key: string, value: string) => {
			values.set(key, value)
		},
		removeItem: (key: string) => {
			values.delete(key)
		},
	}
}

test('identidades ativas pertencem ao perfil real e Financeiro é o Gestor atribuído', () => {
	const store = createDemoStore(storage())
	assert.equal(store.defaultIdentity()?.id, 'bruno')
	assert.deepEqual(
		store.identities('financeiro').map((item) => item.id),
		['bruno'],
	)
	assert.deepEqual(
		store.identities('gestor').map((item) => item.id),
		['bruno'],
	)
	assert.ok(store.identities('membro').some((item) => item.id === 'carla'))
	assert.equal(store.identity('carla')?.passwordChangePending, true)
	assert.equal(store.identity('inexistente'), null)
})

test('alterações fictícias são compartilhadas entre instâncias e restauração recupera o padrão', () => {
	const localStorage = storage()
	const first = createDemoStore(localStorage)
	const second = createDemoStore(localStorage)
	first.updateIntegrante('bruno', {
		nome: 'Bruno Atualizado',
		financeiro: false,
	})
	second.updateIntegrante('carla', { ativo: false })
	assert.equal(second.identity('bruno')?.name, 'Bruno Atualizado')
	assert.equal(first.identity('carla'), null)
	assert.equal(second.identities('financeiro').length, 0)
	assert.equal(second.identity('carla'), null)
	second.reset()
	assert.equal(
		createDemoStore(localStorage).identity('bruno')?.name,
		'Bruno Lima',
	)
	assert.equal(
		createDemoStore(localStorage).identities('financeiro').length,
		1,
	)
})

test('persistência descarta campos de senha e dados inválidos', () => {
	const localStorage = storage()
	const store = createDemoStore(localStorage)
	store.updateIntegrante('ana', {
		nome: 'Ana Silva',
		password: 'segredo',
	} as never)
	assert.ok(!JSON.stringify(store.data()).includes('segredo'))
	assert.ok(
		!localStorage.getItem('proco.demo.equipe.v1')?.includes('segredo'),
	)
	localStorage.setItem(
		'proco.demo.equipe.v1',
		'{"integrantes":[{"password":"senha"}]}',
	)
	assert.equal(createDemoStore(localStorage).defaultIdentity()?.id, 'bruno')
})

test('falha simulada vale para uma consulta e depois permite recuperação', () => {
	const store = createDemoStore(storage())
	store.failNextRead()
	assert.throws(() => store.read(), /Não foi possível carregar/)
	assert.equal(store.read().integrantes.length > 0, true)
})
