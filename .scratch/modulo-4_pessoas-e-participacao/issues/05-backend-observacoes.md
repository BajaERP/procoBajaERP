# 05: Publicar e corrigir Observações

Status: ready-for-agent
Frente: Backend

**Especificação:** [Módulo 4 · Pessoas e Participação](../spec.md).
**Histórias cobertas:** 26–28.

**Blocked by:** [01 — Fechar o contrato da API](01-contrato-api.md)

## Entrega

Permitir publicação, consulta e correção de Observações cotidianas conforme as regras de acesso.

## Critérios de aceitação

- [ ] Capitão e Gestor podem publicar para qualquer Integrante. Líder pode publicar para Integrantes do próprio Subsistema.
- [ ] Restringir consulta ao Integrante citado, ao Líder do Subsistema de referência, ao Capitão e aos Gestores. Aplicar a regra também ao histórico.
- [ ] Autor pode corrigir enquanto tiver acesso ao Subsistema de referência. Capitão e Gestor também podem corrigir. Exigir motivo e preservar a versão anterior.
- [ ] Verificar pela API publicação, consulta e correção autorizadas e tentativas em outro escopo, inclusive depois que o autor perde acesso ao Subsistema.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
