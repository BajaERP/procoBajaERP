# 19: Associar Documentos ao Evento

Status: blocked
Frente: Backend

**Especificação:** [Módulo 6 · Competições e Eventos](../spec.md).
**Histórias cobertas:** 36–37.

**Blocked by:** [02 — Consultar e cadastrar compromissos](02-backend-agenda-cadastro.md); [Módulo 5 · 02 — Consultar biblioteca e aplicar permissões](../../modulo-5_documentacao/issues/02-backend-biblioteca-permissoes.md)

## Entrega

Permitir associar e consultar atas, regulamentos e outros Documentos autorizados no contexto do Evento.

## Critérios de aceitação

- [ ] Usar a Associação opcional entre Documento e Evento. Validar permissões do Evento e de Documentação ao criar ou consultar o vínculo.
- [ ] Usar a consulta autorizada do Módulo 5 e filtrar também metadados de Documentos fora do escopo. A Associação não concede acesso ao Documento.
- [ ] Testar pela API autenticada com dois Perfis, incluindo Documento confidencial em Evento acessível, tentativa direta e acesso aos dados operacionais sem Documentos.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
