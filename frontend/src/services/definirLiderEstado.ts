export function mensagemSemSelecao(integrantesDisponiveis: number): string {
	return integrantesDisponiveis > 0
		? 'Selecione um Membro para ver as consequências.'
		: 'Não há Membros ativos disponíveis para definir como Líder.'
}
