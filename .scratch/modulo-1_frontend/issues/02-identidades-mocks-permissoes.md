# 02: Identidades demonstrativas e dados compartilhados

Status: ready-for-agent

**Blocked by:** [01](01-navegacao-listagem-integrantes.md).

## O que construir

Permitir testar o módulo como diferentes pessoas fictícias, com dados compartilhados e visibilidade coerente com seus perfis.

- [ ] O login demonstrativo mantém sua aparência e assume um Gestor fictício existente; o seletor Dev permite escolher perfil e usuário ativo, incluindo a visão de Gestor Financeiro como Gestor com atribuição adicional.
- [ ] Header, sidebar e conta refletem a identidade selecionada e indicam a demonstração; se a identidade deixar de estar disponível, selecionar outra coerente ou informar a indisponibilidade.
- [ ] Persistir alterações fictícias entre trocas de identidade e recargas; oferecer restauração com confirmação, retomando o usuário padrão, e simulação controlada de falhas.
- [ ] Respeitar a visibilidade por perfil: apenas Capitão, Gestor e a própria pessoa veem seu RA ou SIAPE; buscas não revelam identificadores ocultos.
- [ ] Ocultar ações sem permissão e permitir testar contas com troca de senha pendente. Os mecanismos demonstrativos ficam restritos ao desenvolvimento.
- [ ] Verificar persistência, restauração, seleção de usuários, privacidade, falhas e comportamentos responsivos nos dois temas.

Consulte a [especificação do módulo](../spec.md) para as regras completas, o Figma e os critérios transversais de interface e verificação.

## Comments
