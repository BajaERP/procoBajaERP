# 09: Consulta da matriz de permissões

Status: ready-for-human

**Blocked by:** [02](02-identidades-mocks-permissoes.md).

## O que construir

Disponibilizar a consulta das permissões fixas dos perfis, respeitando a visibilidade da pessoa autenticada.

- [x] Exibir a matriz de forma somente leitura para as pessoas com acesso, sem controles de edição.
- [x] Representar Capitão, Gestor, Líder, Membro e Orientador e a atribuição adicional de Gestor Financeiro conforme a especificação e o glossário.
- [x] Não apresentar ações de gestão a perfis sem permissão; garantir legibilidade e navegação por teclado em mobile e desktop, nos dois temas.
- [x] Verificar a coerência da matriz com os fluxos implementados e seus estados de acesso.

Consulte a [especificação do módulo](../spec.md) para as regras completas, o Figma e os critérios transversais de interface e verificação.

## Comments

### Implementação e verificação — 2026-11-12

A consulta abre dentro de Equipe e Subsistemas e está disponível apenas a Capitão e Gestor, incluindo Gestor Financeiro. O seletor muda somente a matriz consultada; não há controles de concessão ou edição. A matriz representa os cinco perfis e a atribuição adicional financeira conforme o catálogo do módulo. Format check e build passaram. Na revisão, conferi o painel no Chrome em 320 px, nos temas claro e escuro, incluindo seleção de Membro e Gestor Financeiro. O painel mantém conteúdo legível, sem rolagem horizontal, oferece apenas controles de consulta e fecha pelo botão com alvo de 44 px. Navegação por Escape segue o comportamento nativo de dialog.
