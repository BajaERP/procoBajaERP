# 07: Acompanhar Ciência e Aceite da equipe

Status: ready-for-agent
Frente: Backend

**Especificação:** [Módulo 7 · Governança](../spec.md).
**Histórias cobertas:** 18, 28–29.

**Blocked by:** [06 — Registrar Ciência e Aceite e consultar pendências pessoais](06-backend-ciencia-aceite-pendencias.md)

## Entrega

Permitir que Capitão e Gestor consultem a situação das confirmações da equipe por Versão.

## Critérios de aceitação

- [ ] Exibir contas elegíveis, Ciência registrada, Aceites concluídos e pendências por Versão. Considerar Ciência sem Aceite como pendência.
- [ ] Retirar contas desativadas do acompanhamento atual e preservar os registros anteriores no histórico autorizado. Conferir a reativação de conta e a troca de Vigência.
- [ ] Verificar pela API a matriz de Perfis, incluindo Gestor Financeiro com as permissões de Gestor e tentativa de acesso direto de Perfil sem autorização.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
