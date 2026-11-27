# 18: Integrar a chamada na tela do Evento

Status: blocked
Frente: Frontend

**Especificação:** [Módulo 6 · Competições e Eventos](../spec.md).
**Histórias cobertas:** 14–23, 35, 40.

**Blocked by:** [14 — Demonstrar a chamada no detalhe do Evento](14-frontend-chamada-mocks.md); [16 — Integrar o frontend à API de Competições e Eventos](16-frontend-integracao-api.md); [17 — Conectar o contexto de Evento à Participação](17-backend-contexto-chamada.md) Dependência externa indireta via issue 17: Participação em Eventos do Módulo 4.

## Entrega

Conectar a chamada demonstrada à Participação real de Pessoas e Participação.

## Critérios de aceitação

- [ ] Integrar preparação da lista Prevista, registro de situações finais e consulta dos dados conforme o Perfil. Usar as capacidades do servidor para os estados antes do início, sem responsável e cancelado.
- [ ] Verificar lançamento pelo detalhe, encaminhamento à fila do Módulo 4 e consulta após Validação ou correção. Conferir a própria Participação do Integrante e os agregados do Orientador.
- [ ] Testar com sessão real a troca de responsável e a reunião conjunta, a consulta dos registros de Evento cancelado e o tratamento de alteração concorrente.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
