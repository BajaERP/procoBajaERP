# 09: Verificar consulta de Sprint, Atividades e avisos

Status: blocked
Frente: Backend

**Especificação:** [Módulo 8 · Dashboard e Indicadores](../spec.md).
**Histórias cobertas:** 2–9, 21–23, 26.

**Blocked by:** [01 — Fechar o contrato dos cartões](01-contrato-cartoes.md); [Módulo 2 · 04 — Planejar, iniciar e alocar em Sprints](../../modulo-2_atividades-e-sprints/issues/04-backend-planejamento-alocacao.md); [Módulo 2 · 06 — Expor alertas e indicações](../../modulo-2_atividades-e-sprints/issues/06-backend-alertas-indicacoes.md)

## Entrega

Garantir o fornecimento autorizado de Sprint, Atividades e avisos pelo Módulo 2.

## Critérios de aceitação

- [ ] Verificar pela API autenticada a Sprint atual e as selecionáveis, a ausência de Sprint em andamento, o resultado histórico de Sprints encerradas e as Atividades atribuídas e atrasadas no escopo.
- [ ] Verificar os recortes de Capitão, Gestor, Líder, Membro e Orientador nas listas, agregados e consultas diretas. Respeitar Subsistemas ativos para a visão agregada do Orientador.
- [ ] Reusar as indicações oficiais de atraso e pouco progresso e as capacidades que permitem agir sobre cada candidato. Testar os limites temporais da Sprint com datas controladas.
- [ ] Ajustar a consulta de origem caso falte campo, aviso, filtro ou capacidade prevista no contrato.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
