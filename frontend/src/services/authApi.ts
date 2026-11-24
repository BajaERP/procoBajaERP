import { createApiClient } from './apiClient'
import type { ApiUsuarioAtual } from './apiMappers'
import { PasswordChangeError } from './passwordChange'

export const AUTH_SESSION_EXPIRED = 'proco.auth.session-expired'
export const AUTH_USER_CHANGED = 'proco.auth.user-changed'

const api = createApiClient({
	onUnauthorized() {
		if (typeof window !== 'undefined')
			window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED))
	},
})

export const authApi = {
	login(ra: string, senha: string) {
		return api.request<ApiUsuarioAtual>('/api/auth/login', {
			method: 'POST',
			body: { ra, senha },
			notifyUnauthorized: false,
		})
	},
	currentUser() {
		return api.request<ApiUsuarioAtual>('/api/auth/eu', {
			notifyUnauthorized: false,
		})
	},
	logout() {
		return api.request<void>('/api/auth/logout', {
			method: 'POST',
			notifyUnauthorized: false,
		})
	},
	changePassword(senhaAtual: string, novaSenha: string) {
		return api
			.request<void>('/api/auth/senha', {
				method: 'PUT',
				body: { senhaAtual, novaSenha },
			})
			.catch((error: unknown) => {
				if (!(error instanceof Error) || !('fields' in error))
					throw error
				const apiFields = (error as { fields: Record<string, string> })
					.fields
				throw new PasswordChangeError(error.message, {
					currentPassword: apiFields.senhaAtual,
					newPassword: apiFields.novaSenha,
				})
			})
	},
}

export function notifyAuthUserChanged() {
	if (typeof window !== 'undefined')
		window.dispatchEvent(new Event(AUTH_USER_CHANGED))
}
