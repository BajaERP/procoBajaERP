# 04: Publicar com Vigência imediata ou futura

Status: ready-for-agent
Frente: Backend

**Especificação:** [Módulo 7 · Governança](../spec.md).
**Histórias cobertas:** 2–4, 11–15, 19.

**Blocked by:** [03 — Criar e editar Rascunhos](03-backend-rascunhos.md)

## Entrega

Permitir ao Capitão publicar uma Versão oficial e atribuir a pendência inicial de Aceite aos Usuários ativos.

## Critérios de aceitação

- [ ] Autorizar aprovação final e publicação apenas ao Capitão. Exigir Pronto para publicação para o Rascunho preparado pelo Gestor e permitir a publicação direta do Rascunho preparado pelo próprio Capitão.
- [ ] Reverificar o conteúdo e a situação do Rascunho ao publicar. Retornar conflito se o Rascunho tiver mudado após a revisão e registrar aprovação, autoria e datas na publicação confirmada.
- [ ] Permitir Vigência imediata ou futura. Liberar a leitura na publicação, manter a Versão anterior vigente até a troca e exigir no máximo uma Versão futura publicada por Documento.
- [ ] Atribuir a pendência inicial de Aceite aos Usuários ativos, inclusive ao Capitão que publicou, na mesma transação da publicação.
- [ ] Verificar com datas controladas a transição de Vigência, publicação concorrente, imutabilidade do conteúdo publicado e preservação das Versões e confirmações anteriores.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
