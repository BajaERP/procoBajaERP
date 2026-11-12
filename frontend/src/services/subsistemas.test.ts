import assert from 'node:assert/strict'
import test from 'node:test'
import { labelPerfilSubsistema } from './subsistemas.ts'

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
