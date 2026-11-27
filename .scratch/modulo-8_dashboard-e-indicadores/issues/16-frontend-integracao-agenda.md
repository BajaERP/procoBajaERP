# 16: Integrar a Agenda à fonte real

Status: blocked
Frente: Frontend

**Especificação:** [Módulo 8 · Dashboard e Indicadores](../spec.md).
**Histórias cobertas:** 13–14, 23–27.

**Blocked by:** [05 — Demonstrar próximos Eventos com mocks](05-frontend-agenda-mocks.md); [11 — Verificar consulta de próximos Eventos](11-backend-consulta-agenda.md) Dependência externa indireta via issue 11: [Módulo 6 · 02 — Consultar e cadastrar compromissos](../../modulo-6_competicoes-e-eventos/issues/02-backend-agenda-cadastro.md).

## Entrega

Ativar os próximos Eventos autorizados no Dashboard.

## Critérios de aceitação

- [ ] Verificar com sessão real e Eventos de teste o recorte dos próximos 30 dias, incluindo um Evento fora da janela e a exibição somente de Competições ao Orientador.
- [ ] Conectar referências ao detalhe autorizado. Conferir os estados vazio, indisponível e de recuperação sem alterar os demais cartões.
- [ ] Verificar a consulta e a abertura por teclado em desktop e mobile.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
