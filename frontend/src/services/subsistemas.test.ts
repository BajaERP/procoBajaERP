import assert from 'node:assert/strict'
import test from 'node:test'
import { labelPerfilSubsistema, siglaSubsistema } from './subsistemas.ts'

test('composição mostra os nomes dos cinco perfis e a atribuição financeira', () => {
	assert.deepEqual(
		[
			labelPerfilSubsistema('capitao'),
			labelPerfilSubsistema('gestor'),
			labelPerfilSubsistema('lider'),
			labelPerfilSubsistema('membro'),
			labelPerfilSubsistema('orientador'),
			labelPerfilSubsistema('gestor', true),
		],
		[
			'Capitão/Administrador',
			'Gestor',
			'Líder',
			'Membro',
			'Orientador',
			'Gestor Financeiro',
		],
	)
})

test('sigla é derivada do nome do subsistema sem persistir outro campo', () => {
	assert.deepEqual(
		['Gestão', 'Elétrica', 'Gestão Financeira', '  '].map(siglaSubsistema),
		['GES', 'ELE', 'GF', ''],
	)
})
