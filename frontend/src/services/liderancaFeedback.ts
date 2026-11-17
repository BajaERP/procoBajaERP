import { toast } from 'sonner'

const LIDERANCA_TOASTER_ID = 'lideranca'

export function notificarFalhaLideranca(mensagem: string) {
	return toast.error(mensagem)
}

export function notificarSucessoLideranca(subsistemaNome: string) {
	return toast.success(`Liderança de ${subsistemaNome} atualizada.`, {
		toasterId: LIDERANCA_TOASTER_ID,
	})
}
