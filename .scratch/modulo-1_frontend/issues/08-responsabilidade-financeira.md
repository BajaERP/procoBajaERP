# 08: Atribuição de responsabilidade financeira

Status: ready-for-human

**Blocked by:** [04](04-administracao-integrantes.md).

## O que construir

Permitir ao Capitão atribuir, retirar ou transferir a responsabilidade financeira de um Gestor fictício.

- [x] Tratar Gestor Financeiro como Gestor com atribuição adicional, nunca como perfil ou usuário separado; preservar suas permissões de Gestor.
- [x] Somente Capitão pode atribuir a responsabilidade a Gestor ativo, independentemente do estado de seu subsistema; pode haver zero ou um responsável.
- [x] Permitir retirada sem desativar a conta e transferência entre Gestores ativos em uma confirmação e operação única.
- [x] Bloquear e explicar a desativação ou mudança de perfil do responsável até que a atribuição seja retirada ou transferida.
- [x] Atualizar identidade e permissões demonstrativas, persistir alterações e verificar atribuição, retirada, transferência, concorrência de responsáveis e bloqueios.

Consulte a [especificação do módulo](../spec.md) para as regras completas, o Figma e os critérios transversais de interface e verificação.

## Comments
