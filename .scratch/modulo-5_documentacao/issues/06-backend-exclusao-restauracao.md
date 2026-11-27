# 06: Solicitar exclusão e restaurar Documentos

Status: ready-for-agent
Frente: Backend

**Especificação:** [Módulo 5 · Documentação](../spec.md).
**Histórias cobertas:** 25–29.

**Blocked by:** [02 — Consultar biblioteca e aplicar permissões](02-backend-biblioteca-permissoes.md)

## Entrega

Disponibilizar solicitação de exclusão, decisão, confirmação da lixeira e restauração pela API.

## Critérios de aceitação

- [ ] Líder pode solicitar exclusão de Documento do próprio contexto com motivo. Capitão ou Gestor autorizado decide. Preservar solicitação, justificativa, decisão e histórico.
- [ ] Manter o Documento na biblioteca ativa até a confirmação pelo Drive. Só então marcar a exclusão como executada. Se o Drive falhar, registrar o estado, retornar feedback e permitir nova tentativa.
- [ ] Permitir restauração por Capitão ou Gestor autorizado enquanto o arquivo estiver na lixeira. Após confirmação do Drive, recuperar cadastro, Associações e permissões anteriores e gravar histórico.
- [ ] Verificar com Documentos de teste e Drive simulado a rejeição por falta de acesso, a confirmação tardia, a falha sem remoção prematura e a restauração.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
