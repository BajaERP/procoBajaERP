# 14: Integrar Sprint e Atividades à fonte real

Status: blocked
Frente: Frontend

**Especificação:** [Módulo 8 · Dashboard e Indicadores](../spec.md).
**Histórias cobertas:** 2–9, 21–27.

**Blocked by:** [03 — Demonstrar Sprint e Atividades com mocks](03-frontend-sprint-atividades-mocks.md); [09 — Verificar consulta de Sprint, Atividades e avisos](09-backend-consulta-sprint-atividades.md) Dependência externa indireta via issue 09: [Módulo 2 · 04 — Planejar, iniciar e alocar em Sprints](../../modulo-2_atividades-e-sprints/issues/04-backend-planejamento-alocacao.md) e [Módulo 2 · 06 — Expor alertas e indicações](../../modulo-2_atividades-e-sprints/issues/06-backend-alertas-indicacoes.md).

## Entrega

Ativar Sprint, Atividades e avisos do Módulo 2 para o cartão do Dashboard.

## Critérios de aceitação

- [ ] Usar sessão real, os períodos do cartão e as capacidades do servidor. Verificar Sprint atual, seleção, histórico, ausência e os recortes por Perfil.
- [ ] Conectar avisos de atraso e pouco progresso e as referências autorizadas de Sprint e Atividade. Os dados seguem o contrato consumido pelo destaque, quando ele estiver disponível.
- [ ] Verificar que uma falha afeta somente este cartão e que nova tentativa recupera sua consulta. A ativação deste cartão depende da própria fonte.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
