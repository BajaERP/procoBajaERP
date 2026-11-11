# 10: Troca obrigatória e voluntária de senha

Status: ready-for-agent

**Blocked by:** [03](03-cadastro-integrantes.md).

## O que construir

Permitir que usuários fictícios troquem uma senha provisória antes de acessar módulos e alterem voluntariamente sua senha em Configurações.

- [ ] Restringir acesso aos módulos enquanto a troca obrigatória estiver pendente, inclusive para o Capitão inicial e contas cadastradas ou redefinidas; permitir testar esse estado no seletor Dev.
- [ ] Oferecer troca voluntária na área de conta de Configurações, solicitando senha atual e nova; usar o design system para a tela obrigatória sem exigir tela nova no Figma.
- [ ] Validar senha escolhida com 8 a 64 caracteres, até 72 bytes UTF-8 e diferente da atual; mostrar erros junto aos campos e resultado com Sonner.
- [ ] Simular operações sem persistir senhas em texto ou em logs e sem apresentar o fluxo como autenticação real; limpar o estado pendente após sucesso.
- [ ] Verificar bloqueio de rotas, sucesso e falhas das duas trocas, acessibilidade e ausência de senha em texto no armazenamento.

Consulte a [especificação do módulo](../spec.md) para as regras completas, o Figma e os critérios transversais de interface e verificação.

## Comments
