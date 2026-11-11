# 04: Detalhes e administração de integrantes

Status: ready-for-agent

**Blocked by:** [02](02-identidades-mocks-permissoes.md).

## O que construir

Permitir consultar detalhes autorizados e administrar contas fictícias sem perder histórico.

- [ ] Exibir detalhes apenas de integrantes visíveis e campos autorizados, respeitando a privacidade de identificadores.
- [ ] Permitir editar nome e identificador, alterar perfil permitido, ativar e desativar contas e redefinir senha provisória, conforme as permissões do administrador.
- [ ] Impedir alteração do próprio nome, identificador ou perfil e a própria desativação; preservar ao menos um Capitão ativo e explicar bloqueios de negócio.
- [ ] Tratar liderança por fluxo próprio, sem alteração comum de perfil para ou de Líder; manter o histórico e não oferecer exclusão.
- [ ] Validar identificadores e duplicidade, orientar reativação de conta duplicada apenas quando autorizada e exibir senha redefinida uma única vez sem persistir texto; marcar troca obrigatória.
- [ ] Comunicar resultados com Sonner, erros associados aos campos e verificar permissões, bloqueios e persistência.

Consulte a [especificação do módulo](../spec.md) para as regras completas, o Figma e os critérios transversais de interface e verificação.

## Comments
