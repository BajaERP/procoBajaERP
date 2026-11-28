# 06: Demonstrar Aceites pendentes com mocks

Status: ready-for-agent
Frente: Frontend

**Especificação:** [Módulo 8 · Dashboard e Indicadores](../spec.md).
**Histórias cobertas:** 15–16, 21–24, 26, 28.

**Blocked by:** [02 — Montar a tela inicial e os estados dos cartões](02-frontend-tela-estados-mocks.md)

## Entrega

Mostrar as pendências pessoais atuais e demonstrar a navegação para a Versão correspondente.

## Critérios de aceitação

- [ ] Simular pendências da pessoa autenticada, inclusive de Vigência futura quando atribuída, com data de início e referência de abertura da Versão.
- [ ] Mostrar lista atual e fornecer ao destaque os Aceites que a pessoa pode resolver. Demonstrar que o ERP continua disponível mesmo com pendências e que a confirmação retira o item da lista.
- [ ] Verificar estado vazio, falha e nova tentativa no próprio cartão, em desktop e mobile.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
