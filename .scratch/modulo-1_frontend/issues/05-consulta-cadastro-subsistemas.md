# 05: Consulta e administração básica de subsistemas

Status: ready-for-agent

**Blocked by:** [02](02-identidades-mocks-permissoes.md).

## O que construir

Permitir consultar subsistemas e preparar sua composição com dados fictícios compartilhados.

- [ ] Listar subsistemas ativos e seus líderes, com busca, estados de carregamento, vazio e erro e ações conforme permissão.
- [ ] Líder e Membro podem consultar seu próprio subsistema e composição mesmo inativo, sem ver usuários desativados ou identificadores restritos; uma conta ativa nesse subsistema continua acessando o ERP.
- [ ] Capitão e Gestor podem criar e editar subsistemas, incluindo um subsistema inativo sem Líder, e preparar sua composição com integrantes autorizados.
- [ ] Validar nome de até 120 caracteres e unicidade sem diferenciar maiúsculas e minúsculas; persistir dados e usar Sonner e erros próximos aos campos.
- [ ] Verificar consulta por diferentes perfis, privacidade, subsistema inativo, validação e interface responsiva nos dois temas.

Consulte a [especificação do módulo](../spec.md) para as regras completas, o Figma e os critérios transversais de interface e verificação.

## Comments
