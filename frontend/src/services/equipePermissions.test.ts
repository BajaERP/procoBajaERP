import assert from 'node:assert/strict'
import test from 'node:test'
import { consultarPermissoesEquipe } from './equipePermissions.ts'
import type { UserRole } from '../contexts/AuthContext.tsx'

const consulta = (ator: UserRole, perfil: UserRole, financeiro = false) =>
	consultarPermissoesEquipe(ator, perfil, financeiro)

test('A consulta da matriz é exclusiva de Capitão e Gestor', () => {
	for (const ator of ['capitao', 'gestor'] as const) {
		for (const perfil of [
			'capitao',
			'gestor',
			'lider',
			'membro',
			'orientador',
		] as const)
			assert.ok(consulta(ator, perfil))
	}
	for (const ator of ['lider', 'membro', 'orientador'] as const)
		assert.equal(consulta(ator, 'capitao'), null)
})

test('Gestor Financeiro conserva a matriz de Gestor e acrescenta acesso financeiro', () => {
	const gestor = consulta('gestor', 'gestor')!
	const financeiro = consulta('gestor', 'gestor', true)!
	assert.deepEqual(
		financeiro.filter((item) => item.id !== 'funcoes-financeiras'),
		gestor.filter((item) => item.id !== 'funcoes-financeiras'),
	)
	assert.equal(
		gestor.find((item) => item.id === 'funcoes-financeiras')?.permitido,
		false,
	)
	assert.equal(
		financeiro.find((item) => item.id === 'funcoes-financeiras')?.permitido,
		true,
	)
	assert.equal(
		financeiro.find((item) => item.id === 'atribuicao-financeira')
			?.permitido,
		false,
	)
})

test('Atribuição financeira só amplia a consulta do perfil Gestor', () => {
	for (const perfil of ['capitao', 'lider', 'membro', 'orientador'] as const)
		assert.deepEqual(
			consulta('capitao', perfil, true),
			consulta('capitao', perfil),
		)
})

test('Matriz mantém os limites de composição, desativados e identificadores da listagem', () => {
	for (const perfil of [
		'capitao',
		'gestor',
		'lider',
		'membro',
		'orientador',
	] as const) {
		const permissoes = consulta('capitao', perfil)!
		const administra = perfil === 'capitao' || perfil === 'gestor'
		assert.equal(
			permissoes.find((item) => item.id === 'desativados')?.permitido,
			administra,
		)
		assert.equal(
			permissoes.find((item) => item.id === 'identificadores')?.escopo,
			administra
				? 'Todos os integrantes'
				: 'Somente o próprio RA ou SIAPE',
		)
		assert.equal(
			permissoes.find((item) => item.id === 'composicao')?.escopo,
			administra || perfil === 'orientador'
				? 'Todos os subsistemas'
				: 'Somente o próprio subsistema, inclusive inativo',
		)
		assert.equal(
			permissoes.find((item) => item.id === 'atribuicao-financeira')
				?.permitido,
			perfil === 'capitao',
		)
	}
})

test('A matriz distingue a saída comum de Líder da desativação do subsistema', () => {
	const permissoes = consulta('capitao', 'gestor')!
	assert.equal(
		permissoes.find((item) => item.id === 'lideranca')?.escopo,
		'Em operações comuns, o Líder precisa ser substituído antes de sair do subsistema, ser desativado ou mudar de perfil. Na desativação do subsistema, passa a Membro.',
	)
})
