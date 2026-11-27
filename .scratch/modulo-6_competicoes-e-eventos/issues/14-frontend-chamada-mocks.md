# 14: Demonstrar a chamada no detalhe do Evento

Status: ready-for-agent
Frente: Frontend

**Especificação:** [Módulo 6 · Competições e Eventos](../spec.md).
**Histórias cobertas:** 12–23, 35, 40.

**Blocked by:** [09 — Gerenciar responsáveis com mocks](09-frontend-responsaveis-mocks.md); [10 — Remarcar e cancelar com mocks](10-frontend-remarcacao-cancelamento-mocks.md); [11 — Administrar Inscrições com mocks](11-frontend-inscricoes-mocks.md)

## Entrega

Simular a preparação da chamada, os lançamentos e as consultas por Perfil.

## Critérios de aceitação

- [ ] Simular sugestões nos tipos previstos na especificação, inclusive a partir de Inscrições confirmadas, e seleção pelo responsável em Evento geral e Reunião avulsa. Permitir ajustar e salvar a lista como Prevista.
- [ ] Demonstrar o bloqueio de lançamentos finais antes do início, sem responsável ou quando cancelado. A partir do início, simular Presente, Ausente e Justificada, com motivo obrigatório para Justificada e opcional para Ausente.
- [ ] Demonstrar encaminhamento à Validação, consulta da própria Participação e da Participação agregada pelo Orientador. Manter registros anteriores autorizados consultáveis em Evento cancelado.
- [ ] Verificar mudança de responsável, reunião conjunta, carregamento, restrição e conflito com dados simulados em desktop e mobile.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
