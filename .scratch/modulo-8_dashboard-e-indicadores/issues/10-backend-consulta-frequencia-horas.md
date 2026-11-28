# 10: Verificar consulta mensal de Frequência e horas

Status: blocked
Frente: Backend

**Especificação:** [Módulo 8 · Dashboard e Indicadores](../spec.md).
**Histórias cobertas:** 2–5, 10–12, 23–24, 26.

**Blocked by:** [01 — Fechar o contrato dos cartões](01-contrato-cartoes.md); [Módulo 4 · 03 — Validar presença e calcular indicadores](../../modulo-4_pessoas-e-participacao/issues/03-backend-validacao-indicadores.md)

## Entrega

Garantir indicadores mensais autorizados de Frequência e horas validadas enviados pelo Módulo 4.

## Critérios de aceitação

- [ ] Verificar mês atual e mês selecionado, com datas controladas nos limites do período e respeito aos escopos por Usuário e Subsistema.
- [ ] Verificar o indicador do Orientador em agregado da equipe ou de Subsistema ativo, sem registros individuais ou justificativas. Verificar que o acesso direto também respeita o escopo de origem.
- [ ] Usar casos com zero, ausência de registros elegíveis, Presente sem horários e correção de registro que volte à fila de Validação. Conferir a Frequência e a Carga horária sem duplicar as fórmulas.
- [ ] Ajustar na consulta de origem os campos ou filtros previstos no contrato que estiverem faltando.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
