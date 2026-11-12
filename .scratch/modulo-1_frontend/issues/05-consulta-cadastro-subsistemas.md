# 05: Consulta e administração básica de subsistemas

Status: ready-for-agent

**Blocked by:** [02](02-identidades-mocks-permissoes.md).

## O que construir

Permitir consultar subsistemas e preparar sua composição com dados fictícios compartilhados.

- [x] Listar subsistemas ativos e seus líderes, com busca, estados de carregamento, vazio e erro e ações conforme permissão.
- [x] Líder e Membro podem consultar seu próprio subsistema e composição mesmo inativo, sem ver usuários desativados ou identificadores restritos; uma conta ativa nesse subsistema continua acessando o ERP.
- [x] Capitão e Gestor podem criar e editar subsistemas, incluindo um subsistema inativo sem Líder, e preparar sua composição com integrantes autorizados.
- [x] Validar nome de até 120 caracteres e unicidade sem diferenciar maiúsculas e minúsculas; persistir dados e usar Sonner e erros próximos aos campos.
- [ ] Verificar consulta por diferentes perfis, privacidade, subsistema inativo, validação e interface responsiva nos dois temas.

Consulte a [especificação do módulo](../spec.md) para as regras completas, o Figma e os critérios transversais de interface e verificação.

## Comments

### Implementação — 2026-11-12

Adicionada consulta de subsistemas com busca por nome/Líder, composição conforme perfil, estados de carregamento, vazio e falha, e administração para Capitão/Gestor. Subsistemas novos são persistidos inativos e sem Líder; nome tem limite de 120 caracteres e é único sem diferenciar maiúsculas/minúsculas. A composição permite incluir Membros e Orientadores ativos ainda sem subsistema. Vínculos existentes e Líderes não são alterados nesta issue. Dados continuam na fronteira mock/service e o build de produção mantém o módulo indisponível.

Verificado: `npm run format:check`, `npm run build`, 32 testes com `node --experimental-strip-types --test src/services/*.test.ts src/mocks/*.test.ts` e `git diff --check`. A verificação visual desktop/mobile e dos dois temas ficou pendente porque o host de navegador do ambiente CUA estava indisponível.
