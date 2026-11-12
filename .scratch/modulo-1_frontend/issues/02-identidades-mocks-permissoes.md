# 02: Identidades demonstrativas e dados compartilhados

Status: ready-for-human

**Blocked by:** [01](01-navegacao-listagem-integrantes.md).

## O que construir

Permitir testar o módulo como diferentes pessoas fictícias, com dados compartilhados e visibilidade coerente com seus perfis.

- [x] O login demonstrativo mantém sua aparência e assume um Gestor fictício existente; o seletor Dev permite escolher perfil e usuário ativo, incluindo a visão de Gestor Financeiro como Gestor com atribuição adicional.
- [x] Header, sidebar e conta refletem a identidade selecionada e indicam a demonstração; se a identidade deixar de estar disponível, selecionar outra coerente ou informar a indisponibilidade.
- [x] Persistir alterações fictícias entre trocas de identidade e recargas; oferecer restauração com confirmação, retomando o usuário padrão, e simulação controlada de falhas.
- [x] Respeitar a visibilidade por perfil: apenas Capitão, Gestor e a própria pessoa veem seu RA ou SIAPE; buscas não revelam identificadores ocultos.
- [x] Ocultar ações sem permissão e permitir testar contas com troca de senha pendente. Os mecanismos demonstrativos ficam restritos ao desenvolvimento.
- [x] Verificar persistência, restauração, seleção de usuários, privacidade, falhas e comportamentos responsivos nos dois temas.

Consulte a [especificação do módulo](../spec.md) para as regras completas, o Figma e os critérios transversais de interface e verificação.

## Comments


### Implementação e verificação — 2026-11-11

Implementados os cinco perfis, a perspectiva adicional de Gestor Financeiro, seleção de pessoas ativas, identificação demonstrativa no shell/conta e dados compartilhados persistidos. Troca de senha pendente está disponível como estado demonstrativo; o fluxo de troca pertence às próximas issues. Ações de gestão ainda não implementadas não são apresentadas.

A seleção se recupera de mudança de perfil, desativação ou retirada de atribuição, tentando outra pessoa da mesma perspectiva e depois outra identidade ativa, com aviso e perspectiva coerente. Sem identidades ativas, informa indisponibilidade. Produção não cria nem recupera sessões demo; o login indica indisponibilidade até a integração.

Verificado: `npm run format:check`, `npm run build`, `node --experimental-strip-types --test src/services/*.test.ts src/mocks/*.test.ts` (16 testes) e `git diff --check`. No navegador: login e retorno à rota solicitada, seleção de Membro com troca pendente, RA próprio/oculto e busca sem vazamento, falha controlada/retry, dados de conta, Escape e foco, drawer/teclado, desktop e mobile de 320 px nos dois temas, inclusive altura de 320 px.

Persistência validada em duas abas: alterações em pessoas distintas foram preservadas após recarga. Cancelar a restauração conservou os dados; confirmar retornou ao Gestor padrão nas duas abas. O teste inicialmente revelou que uma atualização do objeto da identidade na aba secundária regravava a sessão antiga; a persistência passou a depender somente de ID e perspectiva, e a repetição do mesmo cenário confirmou a correção. A regressão de coordenação React entre abas foi verificada no navegador; o teste unitário do store cobre duas instâncias existentes antes das alterações e reset.

Preview de produção verificado com `proco.auth.user` antigo contendo `id: demo`: redirecionamento para login indisponível, formulário desabilitado e ausência de ferramentas Dev. Bundle não contém a base de pessoas fictícias nem os controles de restauração. Não houve integração com backend nesta issue.

Revisão: reproduzida perda da busca ao alterar `proco.theme` em outra aba. O listener agora ignora chaves não relacionadas e eventos de sessionStorage; somente sessão, dados demonstrativos ou limpeza de localStorage provocam sincronização. Após a correção, a busca `Ana` e sua linha permaneceram intactas ao alterar o tema na segunda aba. Também conferidos os eventos válidos: alteração de dados atualiza a lista, alteração de sessão muda a identidade e `localStorage.clear()` retorna ao login. Formatação, build e os 16 testes passaram novamente.
