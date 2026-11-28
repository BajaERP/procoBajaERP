# 21: Abrir registros financeiros relacionados ao Evento

Status: blocked
Frente: Frontend

**Especificação:** [Módulo 6 · Competições e Eventos](../spec.md).
**Histórias cobertas:** 38–40.

**Blocked by:** [15 — Demonstrar vínculos de Documentos e Financeiro](15-frontend-documentos-financeiro-mocks.md); [16 — Integrar o frontend à API de Competições e Eventos](16-frontend-integracao-api.md); [Módulo 3 · 14 — Integrar o frontend à API real](../../modulo-3_gestao-financeira/issues/14-frontend-integracao-api.md); [Módulo 3 · 17 — Consultar registros financeiros por Evento](../../modulo-3_gestao-financeira/issues/17-backend-consulta-por-evento.md)

## Entrega

Encaminhar Capitão e Gestor Financeiro à consulta autorizada por Evento no Financeiro.

## Critérios de aceitação

- [ ] Disponibilizar o acesso para os Perfis autorizados e abrir a consulta do Financeiro filtrada pelo Evento. Usar os registros e as permissões do Módulo 3.
- [ ] Preservar o detalhe operacional para os demais Perfis sem expor valores, totais, comprovantes ou metadados protegidos. Não efetuar lançamentos no Módulo 6.
- [ ] Verificar com sessão real a navegação a partir de dois Eventos, os estados de consulta vazia ou indisponível e a rejeição de acesso direto sem autorização.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
