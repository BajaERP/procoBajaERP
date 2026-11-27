# 03: Criar e editar Rascunhos

Status: ready-for-agent
Frente: Backend

**Especificação:** [Módulo 7 · Governança](../spec.md).
**Histórias cobertas:** 6–10.

**Blocked by:** [02 — Consultar biblioteca, Versões e histórico](02-backend-biblioteca-leitura-historico.md)

## Entrega

Permitir criar Documentos e preparar Versões, com histórico de edição e indicação de prontidão.

## Critérios de aceitação

- [ ] Autorizar Capitão e Gestor a cadastrar título, tipo e descrição do Documento, criar o primeiro Rascunho e preparar nova Versão a partir de conteúdo publicado.
- [ ] Permitir a edição de Rascunhos e registrar resumo, autor e data de cada alteração no histórico autorizado.
- [ ] Permitir a marcação Pronto para publicação pelo Gestor e retirar a marcação quando o conteúdo mudar. Salvar a mudança e o histórico de forma consistente.
- [ ] Verificar pela API que os Perfis sem permissão não acessam o Rascunho ou seu histórico nem conseguem alterá-lo, inclusive por acesso direto.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
