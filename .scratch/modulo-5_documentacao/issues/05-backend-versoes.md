# 05: Publicar, consultar e baixar Versões

Status: ready-for-agent
Frente: Backend

**Especificação:** [Módulo 5 · Documentação](../spec.md).
**Histórias cobertas:** 5–6, 18–22, 29.

**Blocked by:** [04 — Enviar e importar Documentos](04-backend-envio-importacao.md)

## Entrega

Disponibilizar a publicação e o histórico de Versões do mesmo Documento, com abertura e download autorizados.

## Critérios de aceitação

- [ ] Permitir ao autor do envio publicar enquanto mantiver acesso ao Documento, e a Capitão ou Gestor autorizado publicar dentro de seu escopo. Registrar autor e data e manter as Associações no mesmo cadastro.
- [ ] Listar Versões expostas pelo Drive, inclusive de arquivos anteriores ao ERP. Preservar as Versões já registradas e retornar indisponibilidade quando uma delas não puder mais ser baixada.
- [ ] Revalidar autorização no servidor em cada consulta, abertura e download. Aplicar o Nível de confidencialidade a cada Versão, inclusive quando houver um identificador ou link conhecido.
- [ ] Publicar a nova Versão somente após confirmação do Drive. Em caso de falha, manter a Versão anterior publicada e permitir nova tentativa. Verificar os casos pela API com Drive simulado.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
