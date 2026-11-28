# 15: Integrar Frequência e horas à fonte real

Status: blocked
Frente: Frontend

**Especificação:** [Módulo 8 · Dashboard e Indicadores](../spec.md).
**Histórias cobertas:** 2–5, 10–12, 23–27.

**Blocked by:** [04 — Demonstrar Frequência e horas validadas com mocks](04-frontend-frequencia-horas-mocks.md); [10 — Verificar consulta mensal de Frequência e horas](10-backend-consulta-frequencia-horas.md) Dependência externa indireta via issue 10: [Módulo 4 · 03 — Validar presença e calcular indicadores](../../modulo-4_pessoas-e-participacao/issues/03-backend-validacao-indicadores.md).

## Entrega

Ativar os indicadores validados do Módulo 4 e seu filtro mensal.

## Critérios de aceitação

- [ ] Com sessão real, conferir o mês padrão e a troca independente de mês. Verificar os escopos pessoais e agregados e o contexto autorizado no módulo de origem.
- [ ] Validar o efeito de uma Validação e de uma correção sobre os indicadores. Distinguir 0%, “Sem dados para calcular”, ausência de horas validadas e falha.
- [ ] Verificar falha e nova tentativa isoladas. Conferir filtro e apresentação no desktop e mobile.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
