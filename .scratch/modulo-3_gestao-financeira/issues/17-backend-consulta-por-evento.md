# 17: Consultar registros financeiros por Evento

Status: ready-for-agent
Frente: Backend

**Especificações:** [Gestão Financeira](../spec.md) e [Competições e Eventos](../../modulo-6_competicoes-e-eventos/spec.md).
**Histórias cobertas:** Módulo 6 · 38–39.

**Blocked by:** [05 — Registrar Pagamento e Previsão vinculada](05-backend-pagamento-previsao-vinculada.md).

## Entrega

Disponibilizar a consulta autorizada de registros financeiros vinculados a um Evento, para consumo pelo fluxo de Competições e Eventos.

## Critérios de aceitação

- [ ] Usar o identificador do Evento para filtrar Solicitações e Compras pela Revisão aplicável, além de Movimentações e Previsões vinculadas. Usar a consulta e a autorização do Financeiro.
- [ ] Aceitar a referência opcional ao Evento nos comandos financeiros existentes que possuem esse vínculo no esquema. Validar a referência no servidor e conservar o vínculo na Saída e na Previsão geradas a partir da Compra, quando aplicável.
- [ ] Restringir a consulta financeira por Evento a Capitão e Gestor Financeiro. Aplicar a autorização antes de retornar valores, totais ou metadados protegidos.
- [ ] Testar pela API autenticada com dois Eventos de teste, registros vinculados e sem vínculo, e Perfis com e sem acesso financeiro. Os testes podem usar Eventos cadastrados como dados de teste, sem depender da API de Competições e Eventos.
- [ ] Documentar o filtro e os estados vazio e indisponível para consumo pela [issue 21 do Módulo 6](../../modulo-6_competicoes-e-eventos/issues/21-frontend-integracao-financeiro.md).

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue. A navegação a partir do detalhe do Evento pertence à issue 21 do Módulo 6.

## Comments
