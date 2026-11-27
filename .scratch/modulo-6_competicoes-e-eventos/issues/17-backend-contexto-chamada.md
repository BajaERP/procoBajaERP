# 17: Conectar o contexto de Evento à Participação

Status: blocked
Frente: Backend

**Especificação:** [Módulo 6 · Competições e Eventos](../spec.md).
**Histórias cobertas:** 14–23, 31–35.

**Blocked by:** [03 — Designar responsáveis pela chamada](03-backend-responsaveis-chamada.md); [04 — Remarcar e cancelar compromissos](04-backend-remarcacao-cancelamento.md); [05 — Administrar Inscrições em Competições](05-backend-inscricoes.md); [Módulo 4 · 08 — Aplicar regras de Participação em Eventos](../../modulo-4_pessoas-e-participacao/issues/08-backend-participacao-eventos.md)

## Entrega

Fornecer ao Módulo 4 o contexto real do Evento para registrar, validar e consultar Participações.

## Critérios de aceitação

- [ ] Fornecer dados confiáveis de tipo, datas, cancelamento, responsáveis, Subsistemas envolvidos, Gestores e Inscrições confirmadas. Preservar a separação entre Inscrição e Participação.
- [ ] Consumir os serviços de Pessoas e Participação para lançamento, Validação, correção e histórico. Aplicar no servidor o escopo das consultas, incluindo agregados para o Orientador e registros próprios para o Integrante.
- [ ] Verificar que troca de responsável preserva os registros e revoga a capacidade decorrente da atribuição anterior. No lançamento, reavaliar autorização, horário e cancelamento.
- [ ] Testar chamada e cancelamento ou correção de data concorrentes, além de mudança de responsável após abertura da chamada. Confirmar que cancelados ficam fora dos indicadores e que os registros anteriores permanecem consultáveis conforme o escopo.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
