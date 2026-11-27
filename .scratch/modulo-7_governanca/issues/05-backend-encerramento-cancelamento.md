# 05: Encerrar ou cancelar uma Vigência

Status: ready-for-agent
Frente: Backend

**Especificação:** [Módulo 7 · Governança](../spec.md).
**Histórias cobertas:** 16–18, 26.

**Blocked by:** [04 — Publicar com Vigência imediata ou futura](04-backend-publicacao-vigencia.md)

## Entrega

Permitir ao Capitão encerrar uma norma sem substituta ou cancelar a entrada em vigor de uma Versão futura.

## Critérios de aceitação

- [ ] Exigir justificativa e autorização do Capitão nos dois comandos. Cancelamento futuro é permitido antes do início da Vigência.
- [ ] No cancelamento futuro, conservar a Versão anterior vigente quando houver. Registrar a justificativa e manter as Versões afetadas e os Aceites existentes consultáveis no histórico autorizado.
- [ ] Retirar as pendências do acompanhamento atual após o encerramento ou cancelamento, preservando os registros pessoais e históricos.
- [ ] Testar com datas controladas e confirmação de exemplo, incluindo concorrência na transição, falha que preserve o estado anterior, autorização e histórico.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
