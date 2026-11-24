export interface ApiProblem {
	detail?: string
	title?: string
	erros?: Record<string, string>
}

export class ApiError extends Error {
	readonly status: number
	readonly fields: Record<string, string>

	constructor(
		message: string,
		status: number,
		fields: Record<string, string> = {},
	) {
		super(message)
		this.name = 'ApiError'
		this.status = status
		this.fields = fields
	}
}

export class ApiNetworkError extends Error {
	constructor() {
		super(
			'Não foi possível conectar ao servidor. Verifique a conexão e tente novamente.',
		)
		this.name = 'ApiNetworkError'
	}
}

export interface ApiClientOptions {
	fetcher?: typeof fetch
	readCookie?: (name: string) => string | null
	onUnauthorized?: () => void
}

export interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
	body?: unknown
	notifyUnauthorized?: boolean
}

function parseProblem(body: unknown): ApiProblem {
	if (!body || typeof body !== 'object') return {}
	const value = body as Record<string, unknown>
	const errors = value.erros
	return {
		detail: typeof value.detail === 'string' ? value.detail : undefined,
		title: typeof value.title === 'string' ? value.title : undefined,
		erros:
			errors && typeof errors === 'object'
				? Object.fromEntries(
						Object.entries(errors).filter(
							(entry): entry is [string, string] =>
								typeof entry[1] === 'string',
						),
					)
				: undefined,
	}
}

function defaultReadCookie(name: string): string | null {
	if (typeof document === 'undefined') return null
	const prefix = `${encodeURIComponent(name)}=`
	const entry = document.cookie
		.split('; ')
		.find((cookie) => cookie.startsWith(prefix))
	if (!entry) return null
	try {
		return decodeURIComponent(entry.slice(prefix.length))
	} catch {
		return entry.slice(prefix.length)
	}
}

export function createApiClient(options: ApiClientOptions = {}) {
	const fetcher = options.fetcher ?? fetch
	const readCookie = options.readCookie ?? defaultReadCookie
	const onUnauthorized = options.onUnauthorized ?? (() => {})

	async function ensureCsrfToken() {
		if (readCookie('XSRF-TOKEN')) return
		let response: Response
		try {
			response = await fetcher('/api/auth/csrf', {
				method: 'GET',
				credentials: 'same-origin',
			})
		} catch {
			throw new ApiNetworkError()
		}
		if (!response.ok) throw await errorFromResponse(response)
		if (!readCookie('XSRF-TOKEN'))
			throw new ApiError(
				'Não foi possível preparar a proteção da sessão. Atualize a página e tente novamente.',
				response.status,
			)
	}

	async function errorFromResponse(response: Response): Promise<ApiError> {
		let body: unknown
		try {
			body = await response.json()
		} catch {
			body = null
		}
		const problem = parseProblem(body)
		const fallback =
			response.status === 401
				? 'Sua sessão expirou. Entre novamente.'
				: response.status === 403
					? 'Você não tem permissão para concluir esta operação.'
					: 'Não foi possível concluir a solicitação.'
		return new ApiError(
			problem.detail ?? problem.title ?? fallback,
			response.status,
			problem.erros,
		)
	}

	async function request<T>(
		path: string,
		requestOptions: ApiRequestOptions = {},
	): Promise<T> {
		const { body, notifyUnauthorized = true, ...init } = requestOptions
		const method = (init.method ?? 'GET').toUpperCase()
		const mutates = !['GET', 'HEAD', 'OPTIONS'].includes(method)
		if (mutates) await ensureCsrfToken()

		const headers = new Headers(init.headers)
		if (body !== undefined && !headers.has('Content-Type'))
			headers.set('Content-Type', 'application/json')
		if (mutates) {
			const token = readCookie('XSRF-TOKEN')
			if (!token)
				throw new ApiError(
					'Não foi possível preparar a proteção da sessão. Atualize a página e tente novamente.',
					0,
				)
			headers.set('X-XSRF-TOKEN', token)
		}

		let response: Response
		try {
			response = await fetcher(path, {
				...init,
				method,
				headers,
				credentials: 'same-origin',
				...(body === undefined ? {} : { body: JSON.stringify(body) }),
			})
		} catch {
			throw new ApiNetworkError()
		}

		if (!response.ok) {
			const error = await errorFromResponse(response)
			if (error.status === 401 && notifyUnauthorized) onUnauthorized()
			throw error
		}
		if (response.status === 204) return undefined as T
		try {
			return (await response.json()) as T
		} catch {
			throw new ApiError(
				'O servidor respondeu em um formato que não é reconhecido.',
				response.status,
			)
		}
	}

	return { request }
}
