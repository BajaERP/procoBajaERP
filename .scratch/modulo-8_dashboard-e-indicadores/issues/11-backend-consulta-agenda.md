# 11: Verificar consulta de próximos Eventos

Status: blocked
Frente: Backend

**Especificação:** [Módulo 8 · Dashboard e Indicadores](../spec.md).
**Histórias cobertas:** 13–14, 26.

**Blocked by:** [01 — Fechar o contrato dos cartões](01-contrato-cartoes.md); [Módulo 6 · 02 — Consultar e cadastrar compromissos](../../modulo-6_competicoes-e-eventos/issues/02-backend-agenda-cadastro.md)

## Entrega

Garantir que a Agenda use a consulta autorizada de Eventos do Módulo 6.

## Critérios de aceitação

- [ ] Verificar a janela dos próximos 30 dias pela API autenticada, com datas de teste nos limites, Evento passado e dados fora do recorte.
- [ ] Verificar que o Orientador recebe somente Competições e que os outros Perfis recebem apenas os Eventos autorizados, inclusive por acesso direto.
- [ ] Conferir a referência autorizada para abertura e ajustar na consulta de origem filtros ou campos que estiverem faltando.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
