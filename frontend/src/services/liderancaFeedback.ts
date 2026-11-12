import { toast } from 'sonner'

const LIDERANCA_TOASTER_ID = 'lideranca'
const LIDERANCA_MODAL_TOASTER_ID = 'lideranca-modal'

export function notificarFalhaLideranca(mensagem: string) {
	return toast.error(mensagem, { toasterId: LIDERANCA_MODAL_TOASTER_ID })
}

export function notificarSucessoLideranca(subsistemaNome: string) {
	return toast.success(`Liderança de ${subsistemaNome} atualizada.`, {
		toasterId: LIDERANCA_TOASTER_ID,
	})
}
