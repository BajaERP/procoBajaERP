# 08: Aplicar regras de Participação em Eventos

Status: ready-for-agent
Frente: Backend

**Especificação:** [Módulo 4 · Pessoas e Participação](../spec.md).
**Histórias cobertas:** 10, 16–17, 35–39.

**Blocked by:** [01 — Fechar o contrato da API](01-contrato-api.md)

## Entrega

Implementar as regras de lançamento, Validação e histórico de Participação para consumo pelo Módulo 6, verificadas com Eventos e responsáveis de teste.

## Critérios de aceitação

- [ ] Consumir contexto confiável do Evento conforme o contrato. Em Reunião semanal, restringir cada Líder ao próprio Subsistema, inclusive em Reunião conjunta. Em Reunião dos Gestores, usar o Gestor responsável. Para Competições, Eventos gerais e Reuniões avulsas, exigir a atribuição explícita por Capitão ou Gestor a Capitão, Gestor ou Líder ativo. A atribuição de Logística é independente da chamada.
- [ ] Aceitar a preparação da lista Prevista com base nas sugestões de Subsistemas, Gestores ou Inscrições confirmadas fornecidas pelo Módulo 6. Em Eventos gerais e Reuniões avulsas, o responsável seleciona os participantes esperados. Prevista fica fora da fila e dos indicadores mesmo depois do Evento, até confirmação.
- [ ] Bloquear lançamento final antes do início, sem responsável ou em Evento cancelado. Exigir motivo para Justificada. Na troca de responsável, preservar lançamentos e autoria, revogar o acesso ligado à atribuição anterior e permitir que o novo responsável complete pendências.
- [ ] Autorizar Validação de situações finais, inclusive da própria Participação, a Capitão e Gestor. Só eles podem corrigir Participação validada, com justificativa, histórico e nova Validação. Indicadores usam apenas situações finais validadas de Eventos não cancelados. A consulta aos registros existentes respeita o escopo.
- [ ] Verificar as regras com cenários de Eventos e responsáveis de teste, sem depender do cadastro real, da interface de Eventos ou do Dashboard. A integração com a tela real pertence ao Módulo 6 e não bloqueia a issue 15.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
