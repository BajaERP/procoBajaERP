# 16: Integrar o frontend à API de Competições e Eventos

Status: ready-for-agent
Frente: Frontend

**Especificação:** [Módulo 6 · Competições e Eventos](../spec.md).
**Histórias cobertas:** 1–14, 24–35, 39–40.

**Blocked by:** [03 — Designar responsáveis pela chamada](03-backend-responsaveis-chamada.md); [04 — Remarcar e cancelar compromissos](04-backend-remarcacao-cancelamento.md); [05 — Administrar Inscrições em Competições](05-backend-inscricoes.md); [06 — Gerenciar e delegar a Logística](06-backend-logistica.md); [07 — Registrar e consultar Resultados](07-backend-resultados.md); [09 — Gerenciar responsáveis com mocks](09-frontend-responsaveis-mocks.md); [10 — Remarcar e cancelar com mocks](10-frontend-remarcacao-cancelamento-mocks.md); [11 — Administrar Inscrições com mocks](11-frontend-inscricoes-mocks.md); [12 — Gerenciar Logística com mocks](12-frontend-logistica-mocks.md); [13 — Registrar e consultar Resultados com mocks](13-frontend-resultados-mocks.md)

## Entrega

Conectar os fluxos principais à API do Módulo 6 e verificar seu funcionamento com sessão real.

## Critérios de aceitação

- [ ] Usar a sessão do ERP, o padrão HTTP e CSRF e as capacidades retornadas pelo servidor. Manter os mocks restritos ao desenvolvimento.
- [ ] Integrar agenda, detalhe, cadastro, responsabilidades, remarcação, cancelamento, Inscrições, Logística e Resultados. Atualizar as consultas após comandos e tratar validação, autorização, conflito e falha.
- [ ] Verificar com sessão real em desktop e mobile, nos temas claro e escuro, incluindo dois Subsistemas, acesso direto restrito e ausência de dados financeiros protegidos.
- [ ] Fechar o aceite com as APIs do Módulo 6. Os fluxos com Pessoas e Participação, Documentação e Financeiro têm verificações próprias nas issues 17 a 21.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
