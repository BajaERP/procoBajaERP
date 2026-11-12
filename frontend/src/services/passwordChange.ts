export interface PasswordChangeErrors {
	currentPassword?: string
	newPassword?: string
}

export class PasswordChangeError extends Error {
	readonly fields: PasswordChangeErrors

	constructor(message: string, fields: PasswordChangeErrors = {}) {
		super(message)
		this.name = 'PasswordChangeError'
		this.fields = fields
	}
}

export function validatePasswordChange(
	currentPassword: string,
	newPassword: string,
): PasswordChangeErrors {
	const errors: PasswordChangeErrors = {}
	if (!currentPassword) errors.currentPassword = 'Informe a senha atual.'

	const characterCount = Array.from(newPassword).length
	if (characterCount < 8 || characterCount > 64) {
		errors.newPassword = 'A senha deve ter entre 8 e 64 caracteres.'
	} else if (new TextEncoder().encode(newPassword).length > 72) {
		errors.newPassword = 'A senha deve ocupar no máximo 72 bytes em UTF-8.'
	} else if (currentPassword && newPassword === currentPassword) {
		errors.newPassword = 'A nova senha deve ser diferente da senha atual.'
	}

	return errors
}

export function assertValidPasswordChange(
	currentPassword: string,
	newPassword: string,
): void {
	const fields = validatePasswordChange(currentPassword, newPassword)
	if (Object.keys(fields).length)
		throw new PasswordChangeError('Confira os campos indicados.', fields)
}
