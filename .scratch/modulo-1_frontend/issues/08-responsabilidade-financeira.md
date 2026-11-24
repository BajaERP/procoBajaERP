# 08: Responsabilidade financeira derivada do Subsistema Financeiro

Status: ready-for-human

**Blocked by:** [04](04-administracao-integrantes.md).

## O que construir

Apresentar a responsabilidade financeira como consequência da associação de um Gestor ativo ao Subsistema Financeiro, sem controles de concessão manual.

- [x] Tratar Gestor Financeiro como Gestor associado ao Subsistema Financeiro, nunca como Perfil ou Usuário separado; preservar suas permissões de Gestor.
- [x] Consultar e exibir o Gestor ativo associado ao Subsistema Financeiro ou o estado vago.
- [x] Remover operações manuais de atribuição, retirada e transferência da interface e dos serviços de dados.
- [x] Derivar identidade e permissões demonstrativas da associação atual ao Subsistema Financeiro.
- [x] Atualizar mocks e validar transições decorrentes de cadastro, transferência, troca de Perfil, desativação e reativação.

Consulte a [especificação do módulo](../spec.md), a [issue 06 do backend](../../modulo-1_backend/issues/06-correcao-gestor-financeiro-banco.md) e o [ADR 0002](../../../docs/adr/0002-gestor-financeiro-derivado-do-subsistema.md).
