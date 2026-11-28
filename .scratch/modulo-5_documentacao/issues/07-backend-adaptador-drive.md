# 07: Implementar o adaptador do Google Drive

Status: ready-for-agent
Frente: Backend

**Especificação:** [Módulo 5 · Documentação](../spec.md).

**Blocked by:** [01 — Fechar os contratos da API e do Drive](01-contratos-api-drive.md)

## Entrega

Implementar a ligação entre o contrato do backend e as operações do Drive compartilhado.

## Critérios de aceitação

- [ ] Implementar as operações aprovadas no contrato para pasta autorizada, verificação de compartilhamento, envio, importação, Versões, downloads, lixeira e restauração.
- [ ] Preparar a configuração do Drive compartilhado e da identidade usada pelo backend. As credenciais ficam no ambiente responsável pela integração. Informar de forma segura quando o acesso ou configuração estiver indisponível.
- [ ] Traduzir erros e confirmações do Drive ao contrato do backend. Verificar o adaptador com respostas simuladas do provedor. A confirmação com arquivos e credenciais reais fica na issue 14.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
