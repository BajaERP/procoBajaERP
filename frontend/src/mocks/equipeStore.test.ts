import assert from 'node:assert/strict'
import test from 'node:test'
import { createDemoStore } from './equipeStore.ts'

function storage(failWrites = false) {
	const values = new Map<string, string>()
	let writesFail = failWrites
	return {
		getItem: (key: string) => values.get(key) ?? null,
		setItem: (key: string, value: string) => {
			if (writesFail) throw new Error('storage unavailable')
			values.set(key, value)
		},
		removeItem: (key: string) => {
			values.delete(key)
		},
		setWritesFail: (value: boolean) => {
			writesFail = value
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

test('somente o Capitão atribui a responsabilidade a Gestor ativo, mesmo em subsistema inativo', () => {
	const store = createDemoStore(storage())
	store.removeFinancialManager('ana')
	const inactiveManager = store.createIntegrante('ana', {
		nome: 'Gestor Inativo',
		identificador: '9999989',
		perfil: 'gestor',
		subsistemaId: 'gestao',
	})
	store.updateIntegrante(inactiveManager.integrante.id, { ativo: false })
	store.updateIntegrante('bruno', { subsistemaId: 'inativo' })
	store.assignFinancialManager('ana', 'bruno')
	assert.equal(store.getFinancialManager()?.id, 'bruno')
	assert.equal(store.identity('bruno')?.financial, true)
	assert.throws(
		() => store.assignFinancialManager('bruno', 'ana'),
		/Somente o Capitão/,
	)
	assert.throws(
		() => store.assignFinancialManager('ana', 'carla'),
		/Gestor ativo/,
	)
	assert.throws(
		() =>
			store.assignFinancialManager('ana', inactiveManager.integrante.id),
		/Gestor ativo/,
	)
})

test('a atribuição admite zero ou um responsável e operações concorrentes não criam dois', async () => {
	const store = createDemoStore(storage())
	store.removeFinancialManager('ana')
	const carla = store.createIntegrante('ana', {
		nome: 'Carla Gestora',
		identificador: '9999991',
		perfil: 'gestor',
		subsistemaId: 'inativo',
	})
	const results = await Promise.allSettled([
		Promise.resolve().then(() =>
			store.assignFinancialManager('ana', 'bruno'),
		),
		Promise.resolve().then(() =>
			store.assignFinancialManager('ana', carla.integrante.id),
		),
	])
	assert.equal(
		results.filter((result) => result.status === 'fulfilled').length,
		1,
	)
	assert.equal(
		results.filter((result) => result.status === 'rejected').length,
		1,
	)
	assert.equal(
		store.data().integrantes.filter((item) => item.financeiro).length,
		1,
	)
})

test('transferência financeira troca o responsável em uma gravação e retirada conserva a conta', () => {
	const localStorage = storage()
	const store = createDemoStore(localStorage)
	const manager = store.createIntegrante('ana', {
		nome: 'Carla Gestora',
		identificador: '9999990',
		perfil: 'gestor',
		subsistemaId: 'inativo',
	})
	store.transferFinancialManager('ana', manager.integrante.id)
	const persisted = JSON.parse(
		localStorage.getItem('proco.demo.equipe.v1')!,
	) as { integrantes: { id: string; financeiro: boolean }[] }
	assert.deepEqual(
		persisted.integrantes
			.filter((item) => item.financeiro)
			.map((item) => item.id),
		[manager.integrante.id],
	)
	assert.equal(store.identity('bruno')?.financial, false)
	store.removeFinancialManager('ana')
	assert.equal(store.getFinancialManager(), null)
	assert.equal(store.identity(manager.integrante.id)?.role, 'gestor')
	assert.equal(store.identity(manager.integrante.id)?.financial, false)
})

test('falha de persistência mantém o responsável anterior durante transferência', () => {
	const localStorage = storage()
	const store = createDemoStore(localStorage)
	const manager = store.createIntegrante('ana', {
		nome: 'Carla Gestora',
		identificador: '9999992',
		perfil: 'gestor',
		subsistemaId: 'inativo',
	})
	localStorage.setWritesFail(true)
	assert.throws(
		() => store.transferFinancialManager('ana', manager.integrante.id),
		/Não foi possível salvar a transferência/,
	)
	assert.equal(store.getFinancialManager()?.id, 'bruno')
	assert.equal(store.identity(manager.integrante.id)?.financial, false)
})

test('atribuição financeira bloqueia desativação e troca de perfil inclusive pela edição geral', () => {
	const store = createDemoStore(storage())
	const options = store.administrationOptions('ana', 'bruno')
	assert.equal(
		options.bloqueioPerfil,
		'Retire ou transfira a responsabilidade financeira antes de alterar o perfil.',
	)
	assert.equal(
		options.bloqueioStatus,
		'Retire ou transfira a responsabilidade financeira antes de desativar esta conta.',
	)
	assert.equal(options.podeAlterarStatus, false)
	assert.throws(
		() => store.removeFinancialManager('bruno'),
		/Somente o Capitão/,
	)
	assert.throws(
		() => store.administer('ana', 'bruno', { ativo: false }),
		/Retire ou transfira/,
	)
	assert.throws(
		() => store.administer('ana', 'bruno', { perfil: 'membro' }),
		/Retire ou transfira/,
	)
	assert.throws(
		() => store.updateIntegrante('bruno', { financeiro: false }),
		/fluxo próprio/,
	)
	assert.throws(
		() => store.updateIntegrante('bruno', { ativo: false }),
		/Retire ou transfira/,
	)
	store.removeFinancialManager('ana')
	store.updateIntegrante('bruno', { ativo: false })
	assert.equal(store.identity('bruno'), null)
})

test('alterações fictícias são compartilhadas entre instâncias e restauração recupera o padrão', () => {
	const localStorage = storage()
	const first = createDemoStore(localStorage)
	const second = createDemoStore(localStorage)
	first.updateIntegrante('bruno', { nome: 'Bruno Atualizado' })
	first.removeFinancialManager('ana')
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
	store.removeFinancialManager('ana')
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

test('consulta subsistemas mostra resumo ativo a todos e composição autorizada por identidade', () => {
	const store = createDemoStore(storage())
	const membro = store.listarSubsistemas({
		id: 'carla',
		perfil: 'membro',
		subsistemaId: 'inativo',
	}).subsistemas
	assert.ok(membro.some((item: { id: string }) => item.id === 'inativo'))
	assert.ok(
		membro
			.find((item: { id: string }) => item.id === 'inativo')
			?.integrantes?.some((item: { id: string }) => item.id === 'carla'),
	)
	assert.equal(store.identity('carla')?.subsistemaId, 'inativo')
	assert.ok(
		!(
			'identificador' in
			membro.find((item: { id: string }) => item.id === 'inativo')!
				.integrantes![0]
		),
	)
	assert.ok(
		!membro.find((item: { id: string }) => item.id === 'chassi')
			?.integrantes,
	)
	assert.ok(membro.some((item: { id: string }) => item.id === 'projeto'))
	assert.deepEqual(
		store.listarSubsistemas({
			id: 'ana',
			perfil: 'capitao',
			subsistemaId: null,
		}).resumo,
		{
			subsistemasAtivos: 4,
			integrantesAssociados: 7,
		},
	)
	assert.equal(
		store.listarSubsistemas({
			id: 'carla',
			perfil: 'membro',
			subsistemaId: 'inativo',
		}).resumo.integrantesAssociados,
		null,
	)
	store.updateIntegrante('elisa', { ativo: false })
	const orientador = store.listarSubsistemas({
		id: 'joao',
		perfil: 'orientador',
		subsistemaId: null,
	}).subsistemas
	assert.ok(
		!orientador
			.find((item: { id: string }) => item.id === 'chassi')
			?.integrantes?.some((item: { id: string }) => item.id === 'elisa'),
	)
	const lider = store.listarSubsistemas({
		id: 'diego',
		perfil: 'lider',
		subsistemaId: 'chassi',
	}).subsistemas
	assert.ok(
		!lider
			.find((item: { id: string }) => item.id === 'chassi')
			?.integrantes?.some((item: { id: string }) => item.id === 'elisa'),
	)
	const captain = store.listarSubsistemas({
		id: 'ana',
		perfil: 'capitao',
		subsistemaId: null,
	}).subsistemas
	assert.ok(
		!captain
			.find((item: { id: string }) => item.id === 'chassi')
			?.integrantes?.some((item: { id: string }) => item.id === 'elisa'),
	)
	assert.equal(
		store.listarSubsistemas({
			id: 'ana',
			perfil: 'capitao',
			subsistemaId: null,
		}).resumo.integrantesAssociados,
		6,
	)
	assert.equal(
		store.detail(
			{ id: 'ana', perfil: 'capitao', subsistemaId: null },
			'elisa',
		)?.ativo,
		false,
	)
})

test('definição inicial ativa o subsistema e persiste o novo Líder nas identidades', () => {
	const localStorage = storage()
	const store = createDemoStore(localStorage)

	store.definirLider('ana', 'inativo', 'carla')

	const reloaded = createDemoStore(localStorage)
	assert.equal(reloaded.identity('carla')?.role, 'lider')
	assert.equal(reloaded.identity('carla')?.subsistemaId, 'inativo')
	assert.equal(
		reloaded
			.listarSubsistemas({
				id: 'ana',
				perfil: 'capitao',
				subsistemaId: null,
			})
			.subsistemas.find((item: { id: string }) => item.id === 'inativo')
			?.ativo,
		true,
	)
	assert.equal(
		reloaded
			.listarSubsistemas({
				id: 'ana',
				perfil: 'capitao',
				subsistemaId: null,
			})
			.subsistemas.find((item: { id: string }) => item.id === 'inativo')
			?.lider?.id,
		'carla',
	)
})

test('substituição atualiza o perfil e as identidades do Líder anterior e do novo', () => {
	const store = createDemoStore(storage())

	store.definirLider('bruno', 'chassi', 'elisa')

	assert.equal(store.identity('diego')?.role, 'membro')
	assert.equal(store.identity('diego')?.subsistemaId, 'chassi')
	assert.equal(store.identity('elisa')?.role, 'lider')
	assert.equal(store.identity('elisa')?.subsistemaId, 'chassi')
})

test('transferência de outro subsistema troca a liderança e atualiza ambas as composições', () => {
	const store = createDemoStore(storage())

	store.definirLider('ana', 'chassi', 'helena')

	const equipes = store.listarSubsistemas({
		id: 'ana',
		perfil: 'capitao',
		subsistemaId: null,
	}).subsistemas
	assert.equal(store.identity('helena')?.role, 'lider')
	assert.equal(store.identity('helena')?.subsistemaId, 'chassi')
	assert.equal(store.identity('diego')?.role, 'membro')
	assert.equal(store.identity('diego')?.subsistemaId, 'chassi')
	assert.equal(
		equipes.find((item: { id: string }) => item.id === 'chassi')?.lider?.id,
		'helena',
	)
	assert.equal(
		equipes.find((item: { id: string }) => item.id === 'eletrica')?.lider
			?.id,
		'gabriel',
	)
	assert.ok(
		equipes
			.find((item: { id: string }) => item.id === 'eletrica')
			?.integrantes?.some(
				(item: { id: string }) => item.id === 'helena',
			) === false,
	)
})

test('transferência comum aceita destino inativo, persiste vínculo e registra auditoria', () => {
	const localStorage = storage()
	const store = createDemoStore(localStorage)
	store.transferirIntegrante('ana', 'elisa', 'inativo')

	assert.equal(store.identity('elisa')?.subsistemaId, 'inativo')
	assert.equal(
		createDemoStore(localStorage).identity('elisa')?.subsistemaId,
		'inativo',
	)
	const audit = store.read().auditoria.at(-1)!
	assert.equal(typeof audit.registradoEm, 'string')
	const { registradoEm: _, ...auditEntry } = audit
	assert.deepEqual(auditEntry, {
		tipo: 'transferencia_integrante',
		atorId: 'ana',
		integranteId: 'elisa',
		origemId: 'chassi',
		destinoId: 'inativo',
		perfilAnterior: 'membro',
		perfilAtual: 'membro',
	})
})

test('transferência comum bloqueia Líder sem substituição e rejeita ator sem permissão', () => {
	const store = createDemoStore(storage())
	assert.throws(
		() => store.transferirIntegrante('ana', 'diego', 'eletrica'),
		/Defina outro Líder.*antes de transferir/i,
	)
	assert.equal(store.identity('diego')?.subsistemaId, 'chassi')
	assert.throws(
		() => store.transferirIntegrante('elisa', 'helena', 'chassi'),
		/permissão para transferir/i,
	)
})

test('desativação transfere cada conta ativa ou desativada e converte Líder em Membro', () => {
	const localStorage = storage()
	const store = createDemoStore(localStorage)
	store.updateIntegrante('helena', { subsistemaId: 'eletrica' })
	store.updateIntegrante('gabriel', { ativo: false })
	store.desativarSubsistema('ana', 'eletrica', {
		helena: 'chassi',
		gabriel: 'projeto',
	})

	assert.equal(
		store.read().subsistemas.find((item) => item.id === 'eletrica')?.ativo,
		false,
	)
	assert.equal(store.identity('helena')?.subsistemaId, 'chassi')
	assert.equal(store.identity('gabriel'), null)
	assert.equal(
		store.read().integrantes.find((item) => item.id === 'gabriel')
			?.subsistemaId,
		'projeto',
	)
	assert.equal(
		store.read().integrantes.find((item) => item.id === 'gabriel')?.perfil,
		'membro',
	)
	const audit = store.read().auditoria.at(-1)!
	const { registradoEm: _, ...auditEntry } = audit
	assert.deepEqual(auditEntry, {
		tipo: 'desativacao_subsistema',
		atorId: 'ana',
		subsistemaId: 'eletrica',
		transferencias: [
			{
				integranteId: 'gabriel',
				origemId: 'eletrica',
				destinoId: 'projeto',
				perfilAnterior: 'lider',
				perfilAtual: 'membro',
			},
			{
				integranteId: 'helena',
				origemId: 'eletrica',
				destinoId: 'chassi',
				perfilAnterior: 'membro',
				perfilAtual: 'membro',
			},
		],
	})
	assert.equal(
		createDemoStore(localStorage)
			.read()
			.subsistemas.find((item) => item.id === 'eletrica')?.ativo,
		false,
	)
})

test('desativação bloqueia sem destinos ativos e não altera dados; vazio não exige destino', () => {
	const localStorage = storage()
	const seed = createDemoStore(localStorage)
	const noDestinations = seed.read()
	noDestinations.subsistemas.forEach(
		(item) => (item.ativo = item.id === 'chassi'),
	)
	localStorage.setItem('proco.demo.equipe.v1', JSON.stringify(noDestinations))
	const store = createDemoStore(localStorage)
	assert.throws(
		() => store.desativarSubsistema('ana', 'chassi', {}),
		/Não há subsistema ativo para receber os integrantes/i,
	)
	assert.equal(
		store.read().subsistemas.find((item) => item.id === 'chassi')?.ativo,
		true,
	)
	assert.equal(
		store.read().integrantes.find((item) => item.id === 'diego')
			?.subsistemaId,
		'chassi',
	)
	store.updateIntegrante('diego', { subsistemaId: null, perfil: 'membro' })
	store.updateIntegrante('elisa', { subsistemaId: null })
	store.desativarSubsistema('ana', 'chassi', {})
	assert.equal(
		store.read().subsistemas.find((item) => item.id === 'chassi')?.ativo,
		false,
	)
})

test('desativação valida todos os destinos antes de persistir e falha sem mutação parcial', () => {
	const localStorage = storage()
	const store = createDemoStore(localStorage)
	const before = store.read()
	assert.throws(
		() =>
			store.desativarSubsistema('ana', 'eletrica', {
				gabriel: 'chassi',
				helena: 'inativo',
			}),
		/Escolha um subsistema ativo para Helena/i,
	)
	assert.equal(
		store.read().subsistemas.find((item) => item.id === 'eletrica')?.ativo,
		true,
	)
	assert.equal(
		store.read().integrantes.find((item) => item.id === 'gabriel')
			?.subsistemaId,
		'eletrica',
	)
	assert.equal(store.read().auditoria.length, before.auditoria.length)
})

test('falha de persistência mantém vínculos e auditoria da transferência', () => {
	let failWrites = false
	let writeCount = 0
	const values = new Map<string, string>()
	const localStorage = {
		getItem: (key: string) => values.get(key) ?? null,
		setItem: (key: string, value: string) => {
			writeCount += 1
			if (failWrites) throw new Error('storage unavailable')
			values.set(key, value)
		},
		removeItem: (key: string) => values.delete(key),
	}
	const store = createDemoStore(localStorage)
	writeCount = 0
	failWrites = true
	assert.throws(
		() => store.transferirIntegrante('ana', 'elisa', 'inativo'),
		/Não foi possível salvar a transferência/i,
	)
	assert.equal(writeCount, 1)
	assert.equal(store.identity('elisa')?.subsistemaId, 'chassi')
	assert.equal(store.read().auditoria.length, 0)
})

test('definição de Líder exige administrador e Membro ativo e falha sem alteração parcial', () => {
	let failWrites = false
	const values = new Map<string, string>()
	const localStorage = {
		getItem: (key: string) => values.get(key) ?? null,
		setItem: (key: string, value: string) => {
			if (failWrites) throw new Error('storage unavailable')
			values.set(key, value)
		},
		removeItem: (key: string) => values.delete(key),
	}
	const store = createDemoStore(localStorage)
	store.updateIntegrante('carla', { ativo: false })

	assert.throws(
		() => store.definirLider('elisa', 'chassi', 'helena'),
		/permissão/,
	)
	assert.throws(
		() => store.definirLider('ana', 'chassi', 'gabriel'),
		/Membro ativo/,
	)
	assert.throws(
		() => store.definirLider('ana', 'chassi', 'carla'),
		/Membro ativo/,
	)
	failWrites = true
	assert.throws(() => store.definirLider('ana', 'chassi', 'helena'), /salvar/)
	assert.equal(store.identity('diego')?.role, 'lider')
	assert.equal(store.identity('helena')?.role, 'membro')
})

test('Capitão cria subsistema inativo sem Líder e prepara composição com integrantes autorizados', () => {
	const store = createDemoStore(storage())
	const created = store.salvarSubsistema('ana', {
		nome: '  Ergonomia  ',
		integranteIds: ['joao'],
	})
	assert.equal(created.nome, 'Ergonomia')
	assert.equal(created.ativo, false)
	assert.equal(created.lider, null)
	assert.deepEqual(
		created.integrantes?.map((item: { id: string }) => item.id),
		['joao'],
	)
	assert.equal(store.identity('joao')?.subsistemaId, created.id)
	assert.throws(
		() =>
			store.salvarSubsistema('ana', {
				nome: 'Não transfere',
				integranteIds: ['elisa'],
			}),
		/transferências precisam do fluxo próprio/i,
	)
	assert.equal(store.identity('elisa')?.subsistemaId, 'chassi')
})

test('descrição opcional de subsistema é normalizada e persistida ao criar e editar', () => {
	const localStorage = storage()
	const store = createDemoStore(localStorage)
	const created = store.salvarSubsistema('ana', {
		nome: 'Aerodinâmica',
		descricao: '  Estudo de fluxo de ar.  ',
		integranteIds: [],
	})
	assert.equal(created.descricao, 'Estudo de fluxo de ar.')
	assert.equal(
		createDemoStore(localStorage)
			.data()
			.subsistemas.find((item) => item.id === created.id)?.descricao,
		'Estudo de fluxo de ar.',
	)
	store.salvarSubsistema('ana', {
		id: created.id,
		nome: created.nome,
		descricao: '  ',
		integranteIds: [],
	})
	assert.equal(
		createDemoStore(localStorage)
			.data()
			.subsistemas.find((item) => item.id === created.id)?.descricao,
		null,
	)
})

test('subsistema exige permissão, nome de até 120 caracteres único sem diferenciar caixa', () => {
	const store = createDemoStore(storage())
	assert.throws(
		() =>
			store.salvarSubsistema('carla', {
				nome: 'Vendas',
				integranteIds: [],
			}),
		/permissão/,
	)
	for (const [input, field] of [
		[{ nome: ' ' }, 'nome'],
		[{ nome: 'x'.repeat(121) }, 'nome'],
		[{ nome: 'cHaSsI' }, 'nome'],
	] as const) {
		assert.throws(
			() => {
				const dados = Object.assign(
					{ nome: 'Vendas', integranteIds: [] },
					input,
				)
				store.salvarSubsistema('ana', dados)
			},
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
})

test('edição mantém subsistema inativo e não permite alterar sua liderança pelo fluxo básico', () => {
	const store = createDemoStore(storage())
	const saved = store.salvarSubsistema('bruno', {
		id: 'chassi',
		nome: 'Chassi e Estrutura',
		integranteIds: ['elisa'],
	})
	assert.equal(saved.ativo, true)
	assert.equal(saved.lider?.id, 'diego')
	assert.equal(store.identity('diego')?.role, 'lider')
	assert.equal(store.identity('diego')?.subsistemaId, 'chassi')
	assert.throws(
		() =>
			store.salvarSubsistema('ana', {
				id: 'ausente',
				nome: 'Novo',
				integranteIds: [],
			}),
		/não foi encontrado/i,
	)
})

test('edição preserva vínculos de integrantes desativados da composição', () => {
	const store = createDemoStore(storage())
	store.updateIntegrante('elisa', { ativo: false })
	const options = store.opcoesSubsistema('ana', 'chassi')
	assert.ok(!options.integranteIds.includes('elisa'))
	store.salvarSubsistema('ana', {
		id: 'chassi',
		nome: 'Chassi',
		integranteIds: [],
	})
	assert.equal(
		store.data().integrantes.find((item) => item.id === 'elisa')
			?.subsistemaId,
		'chassi',
	)
})

test('falha ao persistir subsistema é reportada e não confirma a alteração', () => {
	const localStorage = storage(true)
	const store = createDemoStore(localStorage)
	assert.throws(
		() =>
			store.salvarSubsistema('ana', {
				nome: 'Aerodinâmica',
				integranteIds: [],
			}),
		/Não foi possível salvar o subsistema/,
	)
	assert.equal(localStorage.getItem('proco.demo.equipe.v1'), null)
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

test('administração autoriza campos e preserva privacidade nos detalhes', () => {
	const store = createDemoStore(storage())
	const managerOptions = store.administrationOptions('bruno', 'elisa')
	assert.deepEqual(managerOptions.perfis, ['membro', 'orientador'])
	assert.equal(managerOptions.subsistemas.length, 5)
	assert.equal(managerOptions.podeEditarDados, true)
	assert.equal(managerOptions.podeAlterarStatus, true)
	assert.equal(
		store.administrationOptions('bruno', 'ana').podeEditarDados,
		false,
	)
	assert.equal(
		store.administrationOptions('carla', 'elisa').podeEditarDados,
		false,
	)
	assert.equal(
		store.detail(
			{ id: 'carla', perfil: 'membro', subsistemaId: 'gestao' },
			'diego',
		),
		null,
	)
	assert.equal(
		store.detail(
			{ id: 'carla', perfil: 'membro', subsistemaId: 'gestao' },
			'bruno',
		)?.identificador,
		null,
	)
	store.administer('bruno', 'elisa', {
		nome: '  Elisa Nova  ',
		identificador: '009876',
		perfil: 'orientador',
	})
	assert.equal(
		store.detail(
			{ id: 'bruno', perfil: 'gestor', subsistemaId: 'gestao' },
			'elisa',
		)?.nome,
		'Elisa Nova',
	)
	assert.equal(store.identity('elisa')?.role, 'orientador')
})

test('falha ao persistir administração retorna erro e preserva os dados anteriores', () => {
	const localStorage = storage()
	const store = createDemoStore(localStorage)
	store.administer('bruno', 'elisa', { nome: 'Elisa Persistida' })
	localStorage.setWritesFail(true)
	assert.throws(
		() => store.administer('bruno', 'elisa', { nome: 'Elisa Não Salva' }),
		/Não foi possível salvar/,
	)
	localStorage.setWritesFail(false)
	assert.equal(store.identity('elisa')?.name, 'Elisa Persistida')
})

test('liderança não muda por edição comum e Gestor Financeiro exige tratar a atribuição à parte', () => {
	const store = createDemoStore(storage())
	assert.deepEqual(store.administrationOptions('bruno', 'diego').perfis, [])
	assert.throws(
		() => store.administer('bruno', 'diego', { perfil: 'membro' }),
		/fluxo próprio/,
	)
	assert.match(
		store.administrationOptions('bruno', 'diego').bloqueioStatus ?? '',
		/Defina outro Líder/,
	)
	assert.throws(
		() => store.administer('bruno', 'diego', { ativo: false }),
		/Defina outro Líder/,
	)
	const financial = store.administrationOptions('ana', 'bruno')
	assert.match(financial.bloqueioStatus ?? '', /responsabilidade financeira/)
	assert.equal(financial.podeAlterarStatus, false)
	assert.deepEqual(financial.perfis, [])
	assert.throws(
		() => store.administer('ana', 'bruno', { ativo: false }),
		/responsabilidade financeira/,
	)
	assert.throws(
		() => store.administer('ana', 'bruno', { perfil: 'membro' }),
		/responsabilidade financeira/,
	)
	assert.equal(store.identity('bruno')?.financial, true)
})

test('administração valida duplicidade, dados próprios e mantém Capitão ativo', () => {
	const store = createDemoStore(storage())
	assert.throws(
		() => store.administer('bruno', 'elisa', { identificador: '2345680' }),
		/em uso/,
	)
	assert.throws(
		() => store.administer('ana', 'ana', { nome: 'Outra Ana' }),
		/próprios dados/,
	)
	assert.throws(
		() => store.administer('ana', 'ana', { ativo: false }),
		/próprios dados/,
	)
	assert.throws(
		() => store.administer('ana', 'ana', { perfil: 'gestor' }),
		/próprios dados/,
	)
	assert.throws(
		() => store.administer('ana', 'ana', { ativo: false }),
		/próprios dados/,
	)
	store.updateIntegrante('ana', { ativo: false })
	store.updateIntegrante('ana', { ativo: true })
	assert.throws(
		() => store.administer('ana', 'ana', { nome: 'Ana' }),
		/próprios dados/,
	)
	assert.throws(
		() => store.administer('ana', 'bruno', { ativo: false }),
		/responsabilidade financeira/,
	)
	assert.equal(
		store
			.data()
			.integrantes.filter(
				(item) => item.ativo && item.perfil === 'capitao',
			).length,
		1,
	)
})

test('redefinição mostra senha uma vez, exige troca e não persiste o texto', () => {
	const localStorage = storage()
	const store = createDemoStore(localStorage)
	store.updateIntegrante('bruno', { passwordChangePending: false })
	const password = store.resetTemporaryPassword('ana', 'elisa')
	assert.ok(password.length >= 12)
	assert.equal(store.identity('elisa')?.passwordChangePending, true)
	assert.ok(!JSON.stringify(store.data()).includes(password))
	assert.ok(!localStorage.getItem('proco.demo.equipe.v1')?.includes(password))
	assert.throws(
		() => store.resetTemporaryPassword('carla', 'elisa'),
		/permissão/,
	)
})

test('falha ao persistir redefinição não retorna senha e preserva o estado anterior', () => {
	const localStorage = storage()
	const store = createDemoStore(localStorage)
	store.updateIntegrante('elisa', { passwordChangePending: false })
	localStorage.setWritesFail(true)
	assert.throws(
		() => store.resetTemporaryPassword('ana', 'elisa'),
		/Não foi possível salvar/,
	)
	localStorage.setWritesFail(false)
	assert.equal(store.identity('elisa')?.passwordChangePending, false)
})

test('falha ao persistir atualização genérica retorna erro e preserva os dados anteriores', () => {
	const localStorage = storage()
	const store = createDemoStore(localStorage)
	store.updateIntegrante('elisa', { nome: 'Elisa Persistida' })
	localStorage.setWritesFail(true)
	assert.throws(
		() => store.updateIntegrante('elisa', { nome: 'Elisa Não Salva' }),
		/Não foi possível salvar/,
	)
	localStorage.setWritesFail(false)
	assert.equal(store.identity('elisa')?.name, 'Elisa Persistida')
})

test('troca de perfil mantém a regra de subsistema do Capitão e impede transferência implícita', () => {
	const store = createDemoStore(storage())
	store.administer('ana', 'elisa', { perfil: 'capitao' })
	assert.equal(
		store.data().integrantes.find((item) => item.id === 'elisa')
			?.subsistemaId,
		null,
	)
	assert.throws(
		() => store.administer('ana', 'elisa', { perfil: 'membro' }),
		/subsistema/,
	)
	store.administer('ana', 'elisa', {
		perfil: 'membro',
		subsistemaId: 'chassi',
	})
	assert.equal(
		store.data().integrantes.find((item) => item.id === 'elisa')
			?.subsistemaId,
		'chassi',
	)
	assert.throws(
		() =>
			store.administer('ana', 'elisa', {
				perfil: 'orientador',
				subsistemaId: 'eletrica',
			}),
		/fluxo próprio/,
	)
	assert.throws(
		() =>
			store.administer('ana', 'joao', {
				perfil: 'membro',
				subsistemaId: 'inexistente',
			}),
		/subsistema disponível/,
	)
	assert.throws(
		() => store.administer('ana', 'joao', { perfil: 'membro' }),
		/subsistema/,
	)
	store.administer('ana', 'joao', {
		perfil: 'membro',
		subsistemaId: 'gestao',
	})
	assert.equal(
		store.data().integrantes.find((item) => item.id === 'joao')
			?.subsistemaId,
		'gestao',
	)
})
