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

const cadastro = {
	nome: '  Lucas Martins  ',
	identificador: '00123456789012345678',
	perfil: 'membro' as const,
	subsistemaId: 'chassi',
}

test('cadastro persiste uma conta pendente para outras identidades, sem a senha apresentada', () => {
	const localStorage = storage()
	const store = createDemoStore(localStorage)
	const result = store.createIntegrante('bruno', cadastro)
	assert.ok(result.senhaProvisoria.length >= 12)
	const reloaded = createDemoStore(localStorage)
	const identity = reloaded.identity(result.integrante.id)
	assert.equal(identity?.name, 'Lucas Martins')
	assert.equal(identity?.ra, cadastro.identificador)
	assert.equal(identity?.passwordChangePending, true)
	assert.equal(identity?.financial, false)
	assert.ok(!JSON.stringify(reloaded.data()).includes(result.senhaProvisoria))
	assert.ok(
		!localStorage
			.getItem('proco.demo.equipe.v1')
			?.includes(result.senhaProvisoria),
	)
	assert.ok(!('senhaProvisoria' in (identity ?? {})))
})

test('cadastro usa o perfil persistido do ator e rejeita perfis fora da responsabilidade', () => {
	const store = createDemoStore(storage())
	for (const id of ['carla', 'diego', 'joao', 'inexistente']) {
		assert.throws(
			() => store.createIntegrante(id, cadastro),
			/permissão|disponível/,
		)
	}
	for (const perfil of ['capitao', 'gestor', 'lider', 'financeiro']) {
		assert.throws(() =>
			store.createIntegrante('bruno', { ...cadastro, perfil } as never),
		)
	}
	store.updateIntegrante('bruno', { perfil: 'membro' })
	assert.throws(() => store.createIntegrante('bruno', cadastro), /permissão/)
	assert.equal(store.data().integrantes.length, 9)
})

test('Capitão cadastra Capitão sem subsistema e Gestor; Orientador tem SIAPE e subsistema opcional', () => {
	const store = createDemoStore(storage())
	const captain = store.createIntegrante('ana', {
		...cadastro,
		perfil: 'capitao',
		subsistemaId: null,
	})
	assert.equal(captain.integrante.subsistemaId, null)
	const manager = store.createIntegrante('ana', {
		...cadastro,
		identificador: '2',
		perfil: 'gestor',
		subsistemaId: 'inativo',
	})
	assert.equal(manager.integrante.perfil, 'gestor')
	const advisor = store.createIntegrante('bruno', {
		...cadastro,
		identificador: '3',
		perfil: 'orientador',
		subsistemaId: null,
	})
	assert.equal(advisor.integrante.perfil, 'orientador')
	assert.notEqual(captain.senhaProvisoria, manager.senhaProvisoria)
})

test('nome, identificador e subsistema inválidos retornam erros associados aos campos sem criar conta', () => {
	const store = createDemoStore(storage())
	const cases = [
		[{ nome: ' ' }, 'nome'],
		[{ nome: 'A'.repeat(151) }, 'nome'],
		[{ identificador: '' }, 'identificador'],
		[{ identificador: '12a' }, 'identificador'],
		[{ identificador: '1'.repeat(21) }, 'identificador'],
		[{ subsistemaId: null }, 'subsistemaId'],
		[{ subsistemaId: 'ausente' }, 'subsistemaId'],
		[{ perfil: 'capitao' }, 'subsistemaId'],
	] as const
	for (const [changes, field] of cases) {
		assert.throws(
			() => store.createIntegrante('ana', { ...cadastro, ...changes }),
			(error: unknown) => {
				assert.ok(error instanceof Error)
				assert.ok(
					'campos' in error &&
						(error.campos as Record<string, string>)[field],
				)
				return true
			},
		)
	}
	assert.equal(store.data().integrantes.length, 9)
})

test('duplicidade só orienta reativação quando o ator pode administrar a conta desativada', () => {
	const store = createDemoStore(storage())
	store.updateIntegrante('ana', { ativo: false })
	assert.throws(
		() =>
			store.createIntegrante('bruno', {
				...cadastro,
				identificador: '2345678',
			}),
		(error: unknown) => {
			assert.ok(error instanceof Error)
			assert.doesNotMatch(error.message, /desativad|reativ|Ana/)
			return true
		},
	)
	store.updateIntegrante('elisa', { ativo: false })
	assert.throws(
		() =>
			store.createIntegrante('bruno', {
				...cadastro,
				identificador: '2345682',
			}),
		/[Rr]eativ/,
	)
	assert.throws(
		() =>
			store.createIntegrante('bruno', {
				...cadastro,
				identificador: '2345683',
			}),
		/em uso/,
	)
	assert.equal(store.data().integrantes.length, 9)
})

test('falhas de cadastro e armazenamento não anunciam nem persistem criação; nova tentativa funciona', () => {
	const localStorage = storage()
	const store = createDemoStore(localStorage)
	store.failNextCreate()
	assert.throws(() => store.createIntegrante('bruno', cadastro), /cadastrar/)
	assert.equal(store.data().integrantes.length, 9)
	store.createIntegrante('bruno', cadastro)
	assert.equal(store.data().integrantes.length, 10)
	const unavailable = createDemoStore({
		...storage(),
		setItem() {
			throw new Error('QuotaExceededError')
		},
	})
	assert.throws(
		() => unavailable.createIntegrante('bruno', cadastro),
		/salvar/,
	)
	assert.equal(unavailable.data().integrantes.length, 9)
})
