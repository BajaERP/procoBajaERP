# 17: Integrar Aceites pendentes à fonte real

Status: blocked
Frente: Frontend

**Especificação:** [Módulo 8 · Dashboard e Indicadores](../spec.md).
**Histórias cobertas:** 15–16, 21–27.

**Blocked by:** [06 — Demonstrar Aceites pendentes com mocks](06-frontend-aceites-mocks.md); [12 — Verificar consulta pessoal de Aceites](12-backend-consulta-aceites.md) Dependência externa indireta via issue 12: [Módulo 7 · 06 — Registrar Ciência e Aceite e consultar pendências pessoais](../../modulo-7_governanca/issues/06-backend-ciencia-aceite-pendencias.md).

## Entrega

Ativar as pendências de Governança no Dashboard da pessoa autenticada.

## Critérios de aceitação

- [ ] Mostrar somente os Aceites atuais da sessão, sinalizar a Vigência futura da pendência atribuída e abrir a Versão conforme a autorização.
- [ ] Verificar que o Aceite completo deixa de aparecer no cartão após a consulta ser atualizada. Se o destaque estiver disponível, atualizar também o candidato de Aceite. O restante do ERP continua acessível.
- [ ] Testar com duas contas, estados vazio e de indisponibilidade e nova tentativa no próprio cartão.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
