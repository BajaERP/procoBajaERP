import assert from 'node:assert/strict'
import test from 'node:test'
import { validatePasswordChange } from './passwordChange.ts'

test('valida o tamanho da senha em pontos de código Unicode', () => {
	assert.equal(
		validatePasswordChange('atual', 'Abc123!').newPassword,
		'A senha deve ter entre 8 e 64 caracteres.',
	)
	assert.equal(
		validatePasswordChange('atual', 'A'.repeat(65)).newPassword,
		'A senha deve ter entre 8 e 64 caracteres.',
	)
	assert.equal(
		validatePasswordChange('atual', '😀'.repeat(8)).newPassword,
		undefined,
	)
})

test('limita a nova senha a 72 bytes UTF-8', () => {
	assert.equal(
		validatePasswordChange('atual', '😀'.repeat(18)).newPassword,
		undefined,
	)
	assert.equal(
		validatePasswordChange('atual', '😀'.repeat(19)).newPassword,
		'A senha deve ocupar no máximo 72 bytes em UTF-8.',
	)
})

test('exige senha atual e nova diferente da atual', () => {
	assert.equal(
		validatePasswordChange('', 'NovaSenha1!').currentPassword,
		'Informe a senha atual.',
	)
	assert.equal(
		validatePasswordChange('SenhaAtual1!', 'SenhaAtual1!').newPassword,
		'A nova senha deve ser diferente da senha atual.',
	)
})
