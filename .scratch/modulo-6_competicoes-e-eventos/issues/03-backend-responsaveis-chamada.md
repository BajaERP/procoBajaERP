# 03: Designar responsáveis pela chamada

Status: ready-for-agent
Frente: Backend

**Especificação:** [Módulo 6 · Competições e Eventos](../spec.md).
**Histórias cobertas:** 11–16, 18.

**Blocked by:** [02 — Consultar e cadastrar compromissos](02-backend-agenda-cadastro.md)

## Entrega

Permitir atribuir e trocar quem registra a chamada, com escopo por Evento ou Subsistema.

## Critérios de aceitação

- [ ] Em Competições, Eventos gerais e Reuniões avulsas, permitir que Capitão ou Gestor designe um Capitão, Gestor ou Líder ativo. Em Reunião dos Gestores, usar o Gestor responsável. Em Reunião semanal, cada Líder registra para seu Subsistema, inclusive em Reunião conjunta.
- [ ] Expor no detalhe a situação da atribuição e as capacidades do usuário. Manter o Evento na agenda e indicar que a chamada aguarda responsável quando for o caso.
- [ ] Na troca, preservar Participações e autoria e substituir a capacidade decorrente da atribuição. A atribuição de chamada e a de Logística são independentes e seguem seus próprios escopos.
- [ ] Testar a atribuição e a troca pela API, incluindo pessoa inativa, Líder de outro Subsistema e preservação dos registros existentes.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
