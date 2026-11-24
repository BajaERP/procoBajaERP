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

test('consulta financeira respeita a visibilidade da composição e não expõe opções de gestão', () => {
	const store = createDemoStore(storage())
	assert.throws(() => store.financialResponsibility('elisa'), /permissão/)
	assert.throws(
		() => store.financialResponsibility('inexistente'),
		/permissão/,
	)
	assert.equal(store.financialResponsibility('ana').responsavel?.id, 'bruno')
	store.definirLider('ana', 'financeiro', 'elisa')
	assert.equal(store.financialResponsibility('joao').responsavel?.id, 'bruno')
	const visible = store.financialResponsibility('elisa')
	assert.equal(visible.responsavel?.id, 'bruno')
	assert.equal(visible.subsistema?.id, 'financeiro')
	store.updateIntegrante('bruno', { subsistemaId: 'chassi' })
	assert.equal(store.financialResponsibility('ana').responsavel, null)
	assert.throws(() => store.financialResponsibility('joao'), /permissão/)
})

test('identidades ativas pertencem ao perfil real e Financeiro é o Gestor atribuído', () => {
	const store = createDemoStore(storage())
	const data = store.data()
	const subsistemasAtivos = data.subsistemas.filter((item) => item.ativo)
	assert.equal(
		data.subsistemas.find((item) => item.id === 'gestao')?.ativo,
		false,
	)
	assert.ok(
		subsistemasAtivos.every((subsistema) =>
			data.integrantes.some(
				(integrante) =>
					integrante.ativo &&
					integrante.perfil === 'lider' &&
					integrante.subsistemaId === subsistema.id,
			),
		),
	)
	assert.equal(store.defaultIdentity()?.id, 'bruno')
	assert.equal(store.identity('ana')?.passwordChangePending, true)
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

test('histórico de auditoria limita líderes ao escopo e entrega apenas campos de apresentação', () => {
	const store = createDemoStore(storage())
	const filtros = {
		page: 0,
		size: 25,
		entidade: '' as const,
		acao: '',
	}
	const capitao = store.consultarAuditoria(
		{ id: 'ana', perfil: 'capitao', subsistemaId: null },
		filtros,
	)
	const liderChassi = store.consultarAuditoria(
		{ id: 'diego', perfil: 'lider', subsistemaId: 'chassi' },
		filtros,
	)

	assert.equal(capitao.totalElements, 3)
	assert.equal(liderChassi.totalElements, 2)
	assert.ok(
		liderChassi.content.every(
			(item) =>
				item.subsistemaOrigem?.id === 'chassi' ||
				item.subsistemaDestino?.id === 'chassi',
		),
	)
	assert.ok(
		!liderChassi.content.some((item) =>
			item.descricao.includes('Financeiro'),
		),
	)
	assert.throws(
		() =>
			store.consultarAuditoria(
				{ id: 'elisa', perfil: 'membro', subsistemaId: 'chassi' },
				filtros,
			),
		/consultar o histórico/i,
	)
	for (const evento of capitao.content) {
		assert.equal('detalhesJson' in evento, false)
		assert.equal('ra' in evento, false)
		assert.equal('senha' in evento, false)
	}
	const apresentacao = JSON.stringify(capitao)
	assert.ok(!apresentacao.includes('2345678'))
	assert.ok(!apresentacao.includes('SIAPE'))
})

test('histórico de auditoria aplica filtros e paginação na demonstração', () => {
	const store = createDemoStore(storage())
	const resultado = store.consultarAuditoria(
		{ id: 'ana', perfil: 'capitao', subsistemaId: null },
		{ page: 1, size: 1, entidade: '', acao: '' },
	)

	assert.equal(resultado.totalElements, 3)
	assert.equal(resultado.totalPages, 3)
	assert.equal(resultado.page, 1)
	assert.equal(resultado.content.length, 1)

	const primeiro = store.consultarAuditoria(
		{ id: 'ana', perfil: 'capitao', subsistemaId: null },
		{ page: 0, size: 1, entidade: 'USUARIO', acao: 'TRANSFERIDO' },
	)
	assert.equal(primeiro.totalElements, 1)
	assert.equal(primeiro.content[0]?.acao, 'TRANSFERIDO')
	assert.equal(primeiro.content[0]?.entidade, 'USUARIO')
})

test('troca obrigatória atualiza apenas a pendência e nunca persiste senhas', () => {
	const localStorage = storage()
	const store = createDemoStore(localStorage)
	const currentPassword = 'senha-atual-secreta'
	const newPassword = 'nova-senha-secreta-2026'

	store.changeOwnPassword('carla', currentPassword, newPassword)

	assert.equal(store.identity('carla')?.passwordChangePending, false)
	const persisted = localStorage.getItem('proco.demo.equipe.v1') ?? ''
	assert.ok(!persisted.includes(currentPassword))
	assert.ok(!persisted.includes(newPassword))
	assert.ok(!JSON.stringify(store.data()).includes(currentPassword))
	assert.ok(!JSON.stringify(store.data()).includes(newPassword))
})

test('falha simulada na troca mantém a pendência e descarta os campos recebidos', () => {
	const localStorage = storage()
	const store = createDemoStore(localStorage)
	const currentPassword = 'senha-atual-secreta'
	const newPassword = 'nova-senha-secreta-2026'
	store.failNextPasswordChange()

	assert.throws(
		() => store.changeOwnPassword('carla', currentPassword, newPassword),
		/Não foi possível concluir a troca demonstrativa/,
	)
	assert.equal(store.identity('carla')?.passwordChangePending, true)
	assert.ok(
		!localStorage
			.getItem('proco.demo.equipe.v1')
			?.includes(currentPassword),
	)
	assert.ok(
		!localStorage.getItem('proco.demo.equipe.v1')?.includes(newPassword),
	)
})

test('migra dados antigos uma vez, preserva a demonstração e não reativa a troca após recarga', () => {
	const localStorage = storage()
	const seed = createDemoStore(storage())
	const legacyData = seed.data()
	delete (legacyData as { schemaVersion?: number }).schemaVersion
	legacyData.integrantes.find(
		(item) => item.id === 'ana',
	)!.passwordChangePending = false
	legacyData.integrantes.find((item) => item.id === 'elisa')!.nome =
		'Elisa editada antes da migração'
	localStorage.setItem('proco.demo.equipe.v1', JSON.stringify(legacyData))

	const missingPendingStorage = storage()
	const missingPendingData = seed.data()
	delete (missingPendingData as { schemaVersion?: number }).schemaVersion
	delete missingPendingData.integrantes.find((item) => item.id === 'ana')!
		.passwordChangePending
	missingPendingStorage.setItem(
		'proco.demo.equipe.v1',
		JSON.stringify(missingPendingData),
	)
	assert.equal(
		createDemoStore(missingPendingStorage).identity('ana')
			?.passwordChangePending,
		true,
	)

	const migratedStore = createDemoStore(localStorage)
	assert.equal(migratedStore.identity('ana')?.passwordChangePending, true)
	assert.equal(
		migratedStore.identity('elisa')?.name,
		'Elisa editada antes da migração',
	)
	assert.equal(
		JSON.parse(localStorage.getItem('proco.demo.equipe.v1')!).schemaVersion,
		3,
	)

	migratedStore.changeOwnPassword(
		'ana',
		'senha-atual-ficticia',
		'nova-senha-ficticia-2026',
	)
	const reloadedStore = createDemoStore(localStorage)
	assert.equal(reloadedStore.identity('ana')?.passwordChangePending, false)
	assert.equal(
		reloadedStore.identity('elisa')?.name,
		'Elisa editada antes da migração',
	)
})

test('a responsabilidade acompanha o vínculo do Gestor e fica vaga ao sair de Financeiro', () => {
	const localStorage = storage()
	const store = createDemoStore(localStorage)
	store.updateIntegrante('bruno', { subsistemaId: 'chassi' })
	assert.equal(store.getFinancialManager(), null)
	assert.equal(store.identity('bruno')?.financial, false)
	assert.equal(store.financialResponsibility('ana').responsavel, null)
	store.transferirIntegrante('ana', 'bruno', 'financeiro')
	assert.equal(store.getFinancialManager()?.id, 'bruno')
	assert.equal(store.identity('bruno')?.financial, true)
	assert.equal(
		JSON.parse(
			localStorage.getItem('proco.demo.equipe.v1')!,
		).integrantes.find((item: { id: string }) => item.id === 'bruno')
			.subsistemaId,
		'financeiro',
	)
})

test('falha ao transferir para Financeiro preserva os vínculos persistidos', () => {
	const localStorage = storage()
	const store = createDemoStore(localStorage)
	const manager = store.createIntegrante('ana', {
		nome: 'Carla Gestora',
		identificador: '9999992',
		perfil: 'gestor',
		subsistemaId: 'inativo',
	})
	store.updateIntegrante('bruno', { subsistemaId: 'chassi' })
	localStorage.setWritesFail(true)
	assert.throws(
		() =>
			store.transferirIntegrante(
				'ana',
				manager.integrante.id,
				'financeiro',
			),
		/Não foi possível salvar a transferência/,
	)
	assert.equal(store.getFinancialManager(), null)
	assert.equal(store.identity(manager.integrante.id)?.financial, false)
})

test('mudar o perfil ou desativar o Gestor Financeiro retira a função automaticamente', () => {
	const store = createDemoStore(storage())
	const options = store.administrationOptions('ana', 'bruno')
	assert.equal(options.bloqueioPerfil, null)
	assert.equal(options.bloqueioStatus, null)
	assert.equal(options.podeAlterarStatus, true)
	assert.ok(options.perfis.includes('membro'))
	store.administer('ana', 'bruno', { perfil: 'membro' })
	assert.equal(store.identity('bruno')?.financial, false)
	assert.equal(store.getFinancialManager(), null)

	store.administer('ana', 'bruno', { perfil: 'gestor' })
	assert.equal(store.identity('bruno')?.financial, true)
	store.administer('ana', 'bruno', { ativo: false })
	assert.equal(store.identity('bruno'), null)
	assert.equal(store.getFinancialManager(), null)
	assert.throws(
		() => store.updateIntegrante('bruno', { financeiro: false }),
		/determinada pelo perfil e pelo subsistema/,
	)
})

test('alterações fictícias são compartilhadas entre instâncias e restauração recupera o padrão', () => {
	const localStorage = storage()
	const first = createDemoStore(localStorage)
	const second = createDemoStore(localStorage)
	first.updateIntegrante('bruno', { nome: 'Bruno Atualizado' })
	first.updateIntegrante('bruno', { subsistemaId: 'chassi' })
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

test('cadastro não cria Capitão; Capitão cadastra Gestor e Orientador mantém subsistema opcional', () => {
	const store = createDemoStore(storage())
	assert.throws(
		() =>
			store.createIntegrante('ana', {
				...cadastro,
				perfil: 'capitao',
				subsistemaId: null,
			}),
		(error: unknown) => {
			assert.ok(error instanceof Error)
			assert.ok(
				'campos' in error &&
					(error.campos as Record<string, string>).perfil,
			)
			return true
		},
	)
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
	assert.ok(manager.senhaProvisoria)
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
		[{ perfil: 'capitao' }, 'perfil'],
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
			subsistemasAtivos: 3,
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

test('Orientador consulta composições apenas de subsistemas ativos', () => {
	const store = createDemoStore(storage())
	store.updateIntegrante('joao', { subsistemaId: 'inativo' })

	const orientador = store.listarSubsistemas({
		id: 'joao',
		perfil: 'orientador',
		subsistemaId: 'inativo',
	}).subsistemas
	assert.equal(
		store.listarSubsistemas({
			id: 'joao',
			perfil: 'orientador',
			subsistemaId: 'inativo',
		}).resumo.integrantesAssociados,
		5,
	)

	assert.deepEqual(
		orientador.map((item: { id: string }) => item.id),
		['chassi', 'eletrica', 'projeto'],
	)
	assert.ok(
		orientador.every(
			(item: { integrantes?: unknown[] }) => item.integrantes,
		),
	)

	const capitao = store.listarSubsistemas({
		id: 'ana',
		perfil: 'capitao',
		subsistemaId: null,
	}).subsistemas
	const gestor = store.listarSubsistemas({
		id: 'bruno',
		perfil: 'gestor',
		subsistemaId: 'gestao',
	}).subsistemas
	const composicaoInativaDoCapitao = capitao.find(
		(item: { id: string }) => item.id === 'inativo',
	)?.integrantes
	const composicaoInativaDoGestor = gestor.find(
		(item: { id: string }) => item.id === 'inativo',
	)?.integrantes
	assert.equal(
		store.listarSubsistemas({
			id: 'ana',
			perfil: 'capitao',
			subsistemaId: null,
		}).resumo.integrantesAssociados,
		8,
	)
	assert.equal(
		store.listarSubsistemas({
			id: 'bruno',
			perfil: 'gestor',
			subsistemaId: 'gestao',
		}).resumo.integrantesAssociados,
		8,
	)
	assert.ok(
		composicaoInativaDoCapitao?.some(
			(item: { id: string }) => item.id === 'joao',
		),
	)
	assert.ok(
		composicaoInativaDoGestor?.some(
			(item: { id: string }) => item.id === 'joao',
		),
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
	store.updateIntegrante('joao', { subsistemaId: 'eletrica' })
	store.desativarSubsistema('ana', 'eletrica', {
		helena: 'chassi',
		gabriel: 'projeto',
		joao: 'chassi',
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
	assert.equal(store.identity('joao')?.subsistemaId, 'chassi')
	assert.equal(store.identity('joao')?.role, 'orientador')
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
			{
				integranteId: 'joao',
				origemId: 'eletrica',
				destinoId: 'chassi',
				perfilAnterior: 'orientador',
				perfilAtual: 'orientador',
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
	const auditCount = store.read().auditoria.length
	writeCount = 0
	failWrites = true
	assert.throws(
		() => store.transferirIntegrante('ana', 'elisa', 'inativo'),
		/Não foi possível salvar a transferência/i,
	)
	assert.equal(writeCount, 1)
	assert.equal(store.identity('elisa')?.subsistemaId, 'chassi')
	assert.equal(store.read().auditoria.length, auditCount)
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
	store.updateIntegrante('ana', { identificador: '9999999' })
	const inaccessible = store.createIntegrante('ana', {
		...cadastro,
		identificador: '2345678',
		perfil: 'gestor',
		subsistemaId: 'gestao',
	})
	store.updateIntegrante(inaccessible.integrante.id, { ativo: false })
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
	assert.equal(store.data().integrantes.length, 10)
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
	assert.equal(managerOptions.subsistemas.length, 6)
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
			{ id: 'carla', perfil: 'membro', subsistemaId: 'inativo' },
			'diego',
		),
		null,
	)
	assert.equal(
		store.detail(
			{ id: 'carla', perfil: 'membro', subsistemaId: 'inativo' },
			'bruno',
		),
		null,
	)
	assert.equal(
		'passwordChangePending' in
			(store.detail(
				{ id: 'carla', perfil: 'membro', subsistemaId: 'inativo' },
				'carla',
			) ?? {}),
		false,
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

test('detalhes aplicam escopo de subsistemas e omitem pendência de senha', () => {
	const store = createDemoStore(storage())
	const detail = store.detail(
		{ id: 'carla', perfil: 'membro', subsistemaId: 'gestao' },
		'carla',
	)

	assert.ok(detail)
	assert.equal('passwordChangePending' in detail, false)
	const adminDetail = store.detail(
		{ id: 'ana', perfil: 'capitao', subsistemaId: null },
		'carla',
	)
	assert.equal(adminDetail?.passwordChangePending, true)
})

test('detalhes usam perfil e subsistema persistidos da identidade ativa', () => {
	const store = createDemoStore(storage())
	assert.equal(
		store.detail(
			{ id: 'carla', perfil: 'capitao', subsistemaId: null },
			'ana',
		),
		null,
	)

	store.updateIntegrante('carla', { subsistemaId: 'chassi' })
	assert.equal(
		store.detail(
			{ id: 'carla', perfil: 'membro', subsistemaId: 'gestao' },
			'diego',
		)?.id,
		'diego',
	)

	store.updateIntegrante('carla', { ativo: false })
	assert.equal(
		store.detail(
			{ id: 'carla', perfil: 'capitao', subsistemaId: null },
			'ana',
		),
		null,
	)
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

test('liderança tem fluxo próprio e a responsabilidade financeira acompanha o vínculo', () => {
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
	assert.equal(financial.bloqueioStatus, null)
	assert.equal(financial.bloqueioPerfil, null)
	assert.equal(financial.podeAlterarStatus, true)
	assert.ok(financial.perfis.includes('membro'))
	store.administer('ana', 'bruno', { perfil: 'membro' })
	assert.equal(store.identity('bruno')?.financial, false)
	store.administer('ana', 'bruno', { perfil: 'gestor' })
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
	assert.throws(
		() => store.updateIntegrante('ana', { ativo: false }),
		/sucessão/,
	)
	assert.throws(
		() => store.administer('ana', 'ana', { nome: 'Ana' }),
		/próprios dados/,
	)
	store.administer('ana', 'bruno', { ativo: false })
	assert.equal(store.identity('bruno'), null)
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
	assert.equal(
		store.administrationOptions('ana', 'ana').podeRedefinirSenha,
		false,
	)
	assert.throws(() => store.resetTemporaryPassword('ana', 'ana'), /permissão/)
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

test('troca de perfil comum não pode atribuir ou retirar o perfil de Capitão', () => {
	const store = createDemoStore(storage())
	assert.throws(
		() => store.administer('ana', 'elisa', { perfil: 'capitao' }),
		/sucessão/,
	)
	assert.equal(
		store.data().integrantes.find((item) => item.id === 'elisa')
			?.subsistemaId,
		'chassi',
	)
	assert.equal(store.identity('elisa')?.role, 'membro')
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

test('sucessão troca os dois perfis e a associação financeira numa única gravação', () => {
	const localStorage = storage()
	const store = createDemoStore(localStorage)
	const options = store.opcoesSucessaoCapitao('ana')
	assert.deepEqual(
		options.sucessores.map(({ id }) => id),
		['bruno', 'carla', 'elisa', 'helena'],
	)
	assert.ok(
		options.sucessores.every(
			(item) => item.perfil === 'gestor' || item.perfil === 'membro',
		),
	)
	assert.equal(
		options.sucessores.find((item) => item.id === 'bruno')?.financeiro,
		true,
	)
	assert.deepEqual(
		options.subsistemasDestino.map(({ id }) => id),
		['chassi', 'eletrica', 'projeto'],
	)

	store.sucederCapitao('ana', 'bruno', 'chassi')
	assert.deepEqual(
		[
			store.identity('ana')?.role,
			store.identity('ana')?.subsistemaId,
			store.identity('bruno')?.role,
			store.identity('bruno')?.subsistemaId,
			store.identity('bruno')?.financial,
		],
		['membro', 'chassi', 'capitao', null, false],
	)
	assert.equal(
		store
			.data()
			.integrantes.filter(
				(item) => item.ativo && item.perfil === 'capitao',
			).length,
		1,
	)
	assert.equal(store.data().auditoria.at(-1)?.tipo, 'sucessao_capitao')
	assert.equal(createDemoStore(localStorage).identity('ana')?.role, 'membro')
})

test('sucessão exige Capitão ativo, candidato permitido e subsistema ativo', () => {
	const store = createDemoStore(storage())
	store.updateIntegrante('carla', { ativo: false })
	for (const [ator, sucessor, destino] of [
		['bruno', 'elisa', 'chassi'],
		['ana', 'ana', 'chassi'],
		['ana', 'diego', 'chassi'],
		['ana', 'carla', 'chassi'],
		['ana', 'elisa', 'inativo'],
	] as const) {
		assert.throws(() => store.sucederCapitao(ator, sucessor, destino))
	}
	assert.equal(store.identity('ana')?.role, 'capitao')
	assert.equal(store.identity('bruno')?.role, 'gestor')
})

test('falha ao persistir sucessão preserva a capitania e todos os dados', () => {
	const localStorage = storage()
	const store = createDemoStore(localStorage)
	const auditCount = store.data().auditoria.length
	localStorage.setWritesFail(true)
	assert.throws(
		() => store.sucederCapitao('ana', 'bruno', 'chassi'),
		/Não foi possível salvar a sucessão/,
	)
	localStorage.setWritesFail(false)
	assert.equal(store.identity('ana')?.role, 'capitao')
	assert.equal(store.identity('bruno')?.role, 'gestor')
	assert.equal(store.data().auditoria.length, auditCount)
})
