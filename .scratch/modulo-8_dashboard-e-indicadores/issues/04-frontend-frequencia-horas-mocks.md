# 04: Demonstrar Frequência e horas validadas com mocks

Status: ready-for-agent
Frente: Frontend

**Especificação:** [Módulo 8 · Dashboard e Indicadores](../spec.md).
**Histórias cobertas:** 2–5, 10–12, 23–24, 26, 28.

**Blocked by:** [02 — Montar a tela inicial e os estados dos cartões](02-frontend-tela-estados-mocks.md)

## Entrega

Demonstrar Frequência e Carga horária por mês no escopo autorizado.

## Critérios de aceitação

- [ ] Usar o mês atual por padrão e permitir selecionar outro mês. Indicar o período do cartão e preservar a seleção dos demais cartões.
- [ ] Demonstrar 0% com registros elegíveis, “Sem dados para calcular” quando faltarem registros elegíveis para Frequência e ausência de horas validadas quando aplicável.
- [ ] Simular dados da equipe, do Subsistema, do próprio Usuário e agregados do Orientador. Verificar falha, nova tentativa e atalho autorizado.
- [ ] Conferir o filtro e a apresentação em desktop e mobile, com teclado.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
