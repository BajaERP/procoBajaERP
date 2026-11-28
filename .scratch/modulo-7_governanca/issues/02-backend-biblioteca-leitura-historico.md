# 02: Consultar biblioteca, Versões e histórico

Status: ready-for-agent
Frente: Backend

**Especificação:** [Módulo 7 · Governança](../spec.md).
**Histórias cobertas:** 1–5.

**Blocked by:** [01 — Fechar o contrato compartilhado](01-contrato-api.md)

## Entrega

Expor pela API autenticada a biblioteca de Documentos de governança e a leitura das Versões autorizadas.

## Critérios de aceitação

- [ ] Buscar por título ou tipo e retornar a Versão com seu número, conteúdo, datas e situação de Vigência. Identificar qual Versão valia em um período pelo histórico.
- [ ] Permitir leitura da Versão publicada antes de entrar em vigor e consulta a Versões históricas conforme autorização.
- [ ] Aplicar a visibilidade de Rascunhos e conteúdo publicado à listagem, à busca, às contagens, ao histórico e ao acesso direto. Gestor Financeiro conserva as permissões de Gestor.
- [ ] Verificar pela API autenticada com PostgreSQL e Flyway, com Rascunhos e Versões vigentes, futuras e históricas em dados de teste.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
