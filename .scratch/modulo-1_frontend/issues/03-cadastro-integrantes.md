# 03: Cadastro de integrantes e senha provisória

Status: ready-for-human

**Blocked by:** [02](02-identidades-mocks-permissoes.md).

## O que construir

Permitir que administradores autorizados cadastrem integrantes e entreguem uma senha provisória gerada uma única vez.

- [x] Capitão e Gestor só cadastram perfis sob sua responsabilidade; Gestor não administra contas de Capitão ou Gestor. Ações não autorizadas ficam ocultas.
- [x] Validar nome conforme contrato e RA de aluno ou SIAPE de Orientador numérico, com até 20 caracteres; tratar identificador duplicado sem revelar conta desativada a quem não tem permissão.
- [x] Gerar senha provisória sem exigir sua digitação, apresentá-la uma única vez e marcar a conta para troca obrigatória; não persisti-la em texto nem registrá-la em logs.
- [x] Persistir o integrante fictício para as demais identidades e após recarga; informar sucesso e falha com Sonner e erros junto aos campos.
- [x] Verificar criação, restrições, duplicidade, estados de erro, exibição única da senha e ausência de senha em texto no armazenamento.

Consulte a [especificação do módulo](../spec.md) para as regras completas, o Figma e os critérios transversais de interface e verificação.

## Comments
