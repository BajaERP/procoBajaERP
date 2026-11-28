# 04: Remarcar e cancelar compromissos

Status: ready-for-agent
Frente: Backend

**Especificação:** [Módulo 6 · Competições e Eventos](../spec.md).
**Histórias cobertas:** 31–35.

**Blocked by:** [02 — Consultar e cadastrar compromissos](02-backend-agenda-cadastro.md)

## Entrega

Alterar datas ou cancelar um compromisso, preservando vínculos e histórico.

## Critérios de aceitação

- [ ] Remarcar o mesmo Evento, com histórico contendo datas anteriores e novas, autor e momento. Preservar Inscrições e Participações Previstas. Aceitar motivo opcional na remarcação comum.
- [ ] Quando existir Presente, Ausente ou Justificada, mesmo pendente de Validação, permitir apenas a Capitão ou Gestor corrigir a data com justificativa. Salvar a alteração e o histórico na mesma transação.
- [ ] Permitir cancelamento por Capitão ou Gestor e por Líder somente em Reunião exclusiva do próprio Subsistema. Exigir motivo e registrar autor e momento. Manter o Evento no Histórico e preservar as Participações existentes.
- [ ] Testar remarcação, correção e cancelamento pela API, com Participações Previstas e finais no banco de teste, incluindo Reunião conjunta, perfil sem acesso e ausência de justificativa.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
