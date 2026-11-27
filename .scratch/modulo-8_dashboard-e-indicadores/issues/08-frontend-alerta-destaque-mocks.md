# 08: Priorizar o alerta em destaque com mocks

Status: ready-for-agent
Frente: Frontend

**Especificação:** [Módulo 8 · Dashboard e Indicadores](../spec.md).
**Histórias cobertas:** 21–22, 25–26, 28.

**Blocked by:** [03 — Demonstrar Sprint e Atividades com mocks](03-frontend-sprint-atividades-mocks.md); [06 — Demonstrar Aceites pendentes com mocks](06-frontend-aceites-mocks.md)

## Entrega

Mostrar uma ação disponível à pessoa sem tirar os demais avisos dos cartões.

## Critérios de aceitação

- [ ] Selecionar um destaque entre os candidatos atuais e autorizados, na ordem Atividade atrasada, pouco progresso na Sprint e Aceite pendente.
- [ ] Manter os outros avisos nos cartões correspondentes. Mostrar o atalho para a ação autorizada e omitir o destaque quando faltar candidato elegível.
- [ ] Verificar com os três tipos simultâneos, itens que a pessoa pode consultar mas não resolver e alternância de fonte indisponível. Uma fonte saudável continua gerando candidatos mesmo se a outra falhar.
- [ ] Conferir com teclado e nos dois temas, preservando a navegação quando um alerta deixar de existir.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
