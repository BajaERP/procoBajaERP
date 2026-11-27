# 03: Gerenciar Categorias e classificação

Status: ready-for-agent
Frente: Backend

**Especificação:** [Módulo 5 · Documentação](../spec.md).
**Histórias cobertas:** 9–10, 14–16.

**Blocked by:** [02 — Consultar biblioteca e aplicar permissões](02-backend-biblioteca-permissoes.md)

## Entrega

Disponibilizar Categorias e reclassificação auditável de Documentos.

## Critérios de aceitação

- [ ] Capitão e Gestor podem criar e renomear Categorias. As demais pessoas com permissão de envio selecionam Categorias existentes. Alterar uma Categoria não muda o acesso ao Documento.
- [ ] Permitir reclassificação dentro das permissões de Capitão e Gestor. Somente Capitão ou Gestor Financeiro pode reclassificar de ou para Financeiro confidencial. Guardar classificação anterior, nova classificação, autor e data.
- [ ] Solicitar conferência do conteúdo e do histórico antes de ampliar o acesso. Manter a classificação do original quando somente o conteúdo atual puder ser divulgado e orientar o cadastro separado de uma cópia revisada.
- [ ] Verificar pela API as permissões e o histórico das mudanças de classificação, incluindo a negativa de reclassificação financeira por Gestor sem responsabilidade financeira.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
