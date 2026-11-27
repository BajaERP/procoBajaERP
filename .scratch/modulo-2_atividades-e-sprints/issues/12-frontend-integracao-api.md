# 12: Integrar à API real e validar ponta a ponta

Status: ready-for-agent
Frente: Frontend

**Especificação:** [Módulo 2 · Atividades e Sprints](../spec.md).

**Blocked by:** [06 — Expor alertas e indicações](06-backend-alertas-indicacoes.md), [11 — Alertas e indicações com mocks](11-frontend-alertas-mocks.md)

## Entrega

Conectar o módulo à API real seguindo o contrato compartilhado e verificar os fluxos integrados em PostgreSQL com o backend entregue.

## Critérios de aceitação

- [ ] Usar a sessão real do ERP, o padrão HTTP e CSRF e as capacidades retornadas pelo servidor. Selecionar mocks apenas em desenvolvimento, de acordo com o padrão do Módulo 1.
- [ ] Conectar consultas e comandos de Atividades, Backlog, Quadro, histórico, planejamento, Alocação, retirada, transferência, encerramento e alertas. Atualizar as consultas afetadas e apresentar erros de validação, permissão e conflito.
- [ ] Verificar ponta a ponta uma Atividade do Backlog ao Quadro, uma mudança feita por Responsável, retirada ou encerramento, e consulta do histórico preservado.
- [ ] Usar contas com escopos distintos. Confirmar que o servidor rejeita ações indisponíveis na interface e que um encerramento inválido preserva os dados. Registrar os cenários verificados e conferir os fluxos principais em desktop e mobile.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de banco e novas migrações ficam fora desta issue.

## Comments
