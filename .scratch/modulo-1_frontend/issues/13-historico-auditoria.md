# Frontend: histórico de auditoria do módulo 1

Status: ready-for-agent

**Depends on:** [10 — consulta de auditoria, backend](../../modulo-1_backend/issues/10-consulta-auditoria.md)

## O que construir

- Disponibilizar uma consulta de histórico dentro de Equipe e Subsistemas, no design system existente e sem alterar a sidebar.
- Mostrar apenas os eventos que o servidor autoriza para a identidade atual: Capitão e Gestor veem o módulo todo; Líder vê somente eventos cujo escopo registrado inclua seu Subsistema.
- Representar transferências nos escopos da origem e do destino e preservar o escopo capturado no instante do evento.
- Oferecer paginação e filtros sobre os eventos recebidos, com estados de carregamento, vazio, falha e nova tentativa.
- Exibir descrições legíveis, sem JSON bruto, RA/SIAPE, hash ou senha. Registros antigos sem escopo aparecem somente para Capitão e Gestor.
- Preparar dados demonstrativos de auditoria na pasta de mocks, sem misturar estado de auditoria com componentes de tela.

## Pronto quando

- Uma pessoa não recebe nem vê eventos fora do seu escopo; o frontend não tenta completar a autorização do backend.
- Mudanças de perfil, liderança, integrantes, subsistemas, responsabilidade financeira e sucessão têm rótulos legíveis.
- A consulta se adapta a 320 px, temas claro/escuro, teclado e leitores de tela.
- Testes verificam escopo visual, privacidade, paginação e estados de consulta.
- A consulta usa mock neste estágio; API real e sessão ficam para a issue 11, executada por último.
