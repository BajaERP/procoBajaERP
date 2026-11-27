# 04: Enviar e importar Documentos

Status: ready-for-agent
Frente: Backend

**Especificação:** [Módulo 5 · Documentação](../spec.md).
**Histórias cobertas:** 7–8, 11–13, 17, 29.

**Blocked by:** [03 — Gerenciar Categorias e classificação](03-backend-categorias-classificacao.md)

## Entrega

Permitir envio e importação de arquivos do Drive com classificação autorizada e cadastro único no ERP.

## Critérios de aceitação

- [ ] Permitir envio a usuários ativos com Categoria existente e classificação que possam consultar. No caso de Documento comum restrito, registrar os Subsistemas autorizados.
- [ ] Permitir a Capitão ou Gestor autorizado selecionar arquivos de uma pasta autorizada, confirmar classificação e Categoria e importar pelo identificador do Drive, sem duplicar o arquivo ou cadastro.
- [ ] Para importação confidencial, verificar o compartilhamento efetivo no Drive. Se o acesso for mais amplo que a classificação pretendida, impedir a importação até ajuste na origem e devolver um erro acionável.
- [ ] Guardar conteúdo no Drive e metadados no ERP. Permitir o cadastro separado de uma cópia revisada preservando o original restrito. Testar pela API com Drive simulado envio, duplicidade, classificação incompatível, falha e nova tentativa.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
