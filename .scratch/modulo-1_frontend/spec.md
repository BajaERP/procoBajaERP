# Módulo 1 — frontend de Equipe e Subsistemas

Status: ready-for-agent

## Problema

A equipe precisa consultar e administrar integrantes, subsistemas, lideranças e a responsabilidade financeira em uma interface que represente as regras do ERP. As rotas atuais do módulo exibem telas provisórias; a sessão do frontend é demonstrativa e ainda não consome a API de aplicação. O backend já tem autenticação e endpoints de gestão de Usuários, Subsistemas e Vínculos, incorporados à `develop`; parte das regras e contratos ainda precisa ser corrigida conforme as decisões posteriores.

## Solução

Construir o módulo conforme a página [01 · Equipe e Subsistemas no Figma](https://www.figma.com/design/NhEuGEDcNqW2NNMnP614YV/PROCOBAJA-ERP-%C2%B7-UI-Kit---Design-System?node-id=52-400), o design system e as decisões deste documento. Desenvolver primeiro os fluxos com dados fictícios compartilhados e persistidos no navegador, disponíveis exclusivamente em desenvolvimento. A integração real será a última etapa e dependerá dos contratos e endpoints do backend. Até ela, o build de produção deve apresentar o módulo como indisponível, sem oferecer operações mockadas.

As decisões desta especificação e do glossário prevalecem sobre os documentos acadêmicos, o modelo v4, o comportamento anterior do backend e telas antigas onde divergirem. O Figma foi corrigido quanto ao Gestor Financeiro, mas ainda há exemplos que mostram RA de terceiros em perfis sem permissão, digitam senha inicial no cadastro ou exigem troca prévia de perfil para definir Líder; o frontend deve aplicar as regras acordadas nesses casos. Não há tela específica para troca obrigatória de senha, que deve seguir o design system existente.

## Histórias de usuário

1. Como integrante, quero acessar Equipe e Subsistemas pela sidebar, para encontrar a área do módulo.
2. Como integrante, quero navegar entre Integrantes e Subsistemas dentro do módulo, para encontrar as informações sem submenus na sidebar.
3. Como integrante, quero usar a interface em desktop e mobile, nos temas claro e escuro, para trabalhar no dispositivo e tema disponíveis.
4. Como integrante, quero usar a interface com teclado e tecnologias assistivas, para consultar dados e executar ações acessíveis.
5. Como integrante, quero ver os estados de carregamento, ausência de dados e erro, para entender o que acontece e como continuar.
6. Como Capitão ou Gestor, quero listar, pesquisar e filtrar integrantes permitidos, para localizar uma conta.
7. Como pessoa com permissão de consulta, quero abrir os detalhes de integrantes visíveis, para consultar apenas informações autorizadas.
8. Como Capitão ou Gestor, quero ver o RA ou SIAPE permitido, para identificar e administrar contas.
9. Como Membro, Líder ou Orientador, quero consultar meu próprio identificador sem expor o de outras pessoas, para preservar a privacidade.
10. Como usuário sem acesso ao RA de outras pessoas, não quero que uma pesquisa pelo RA delas revele seus registros.
11. Como Capitão, quero cadastrar integrantes com perfil permitido, para incluir pessoas na equipe.
12. Como Gestor, quero cadastrar e administrar os perfis sob minha responsabilidade, sem alterar contas de Capitão ou Gestor.
13. Como administrador, quero informar RA numérico para alunos e SIAPE numérico para Orientadores, para identificar corretamente as contas.
14. Como administrador, quero receber uma senha provisória gerada uma única vez no cadastro ou redefinição, para entregá-la ao usuário.
15. Como usuário, quero trocar minha senha provisória antes de acessar os módulos, para passar a usar uma senha própria.
16. Como Capitão inicial, quero trocar a senha configurada na inicialização no primeiro acesso, para usar uma senha própria.
17. Como administrador, quero corrigir nome e identificador e alterar o perfil de contas permitidas, para manter os registros atualizados.
18. Como administrador, quero desativar ou reativar contas permitidas, preservando seu histórico e conhecendo os bloqueios aplicáveis.
19. Como Capitão, quero manter pelo menos um Capitão ativo, para que a equipe não perca a administração do ERP.
20. Como integrante, quero consultar os subsistemas ativos e seus líderes, para conhecer a organização da equipe.
21. Como Líder ou Membro, quero consultar meu próprio subsistema e sua composição, inclusive se ele estiver inativo, sem ver usuários desativados ou dados restritos.
22. Como usuário ativo de um subsistema inativo, quero acessar o ERP, para continuar usando as funções permitidas à minha conta.
23. Como Capitão ou Gestor, quero criar e editar subsistemas, para organizar as áreas da equipe.
24. Como administrador, quero cadastrar um subsistema inativo sem Líder e incluir integrantes antes da ativação, para preparar sua composição.
25. Como administrador, quero definir um Membro ativo como Líder em uma confirmação, para ativar ou atualizar a liderança do subsistema.
26. Como administrador, quero ver que o Líder anterior volta a Membro e que um novo Líder de outro subsistema será transferido, para conferir as consequências antes de confirmar.
27. Como administrador, quero transferir integrantes autorizados, inclusive para um subsistema inativo em uma transferência comum, para organizar as equipes.
28. Como administrador, quero ser informado de que um Líder precisa ser substituído antes de sair, para manter a regra de liderança.
29. Como administrador, quero desativar um subsistema e escolher destinos ativos individuais para seus usuários, inclusive os desativados, para preservar os registros.
30. Como administrador, quero saber por que uma desativação está bloqueada quando não há destino ativo para usuários associados.
31. Como administrador, quero desativar um subsistema vazio sem exigir outro como destino.
32. Como Capitão, quero atribuir a responsabilidade financeira a um Gestor ativo, para designar quem acumulará as funções de Gestor Financeiro.
33. Como Capitão, quero deixar a responsabilidade financeira vaga, para poder retirar uma atribuição sem escolher substituto imediatamente.
34. Como Capitão, quero transferir a responsabilidade financeira entre Gestores ativos em uma confirmação, para mudar o responsável sem criar duas atribuições simultâneas.
35. Como Capitão, quero retirar a responsabilidade financeira sem desativar a conta do Gestor, para que ele permaneça Gestor comum.
36. Como Capitão, quero ser impedido de desativar ou mudar o perfil do Gestor Financeiro antes de retirar ou transferir a atribuição.
37. Como Gestor Financeiro, quero conservar as funções de Gestor e receber as funções financeiras autorizadas, inclusive com subsistema inativo se minha conta estiver ativa.
38. Como integrante, quero consultar as permissões fixas dos perfis conforme meu acesso, sem uma matriz editável.
39. Como pessoa sem permissão de gestão, quero uma interface de consulta sem botões de gestão indevidos.
40. Como desenvolvedor, quero escolher perfis e usuários fictícios ativos coerentes com seus subsistemas, para testar diferentes perspectivas.
41. Como desenvolvedor, quero escolher Gestor Financeiro no seletor como uma visão demonstrativa, sabendo que é um Gestor com atribuição adicional.
42. Como desenvolvedor, quero que as alterações nos mocks apareçam para os demais usuários demonstrativos após trocar de identidade ou recarregar.
43. Como desenvolvedor, quero simular falhas de maneira controlada, para conferir a recuperação e as mensagens.
44. Como desenvolvedor, quero restaurar os dados fictícios após confirmação e voltar ao usuário padrão, para recomeçar os testes.
45. Como pessoa que utiliza o build de produção antes da integração, quero ver o módulo como indisponível, para não confundir dados fictícios com dados reais.
46. Como pessoa da equipe, quero notificações de sucesso e falha e erros de validação próximos aos campos, para compreender o resultado de minhas ações.
47. Como usuário autenticado, quero trocar minha própria senha voluntariamente em Configurações, para atualizar minha credencial quando desejar.

## Decisões de implementação

- Preservar a identidade do projeto e o Figma corrigido; adaptar telas que ainda contrariem as regras acordadas. Usar componentes, tokens semânticos, ícones Lucide, português brasileiro, temas claro e escuro e responsividade a partir de 320 px. Preservar acessibilidade, foco, teclado, Escape e comportamento do drawer.
- Remover todos os subitens da sidebar, inclusive dos demais módulos, mantendo uma entrada principal por módulo e os módulos visíveis para todos os perfis nesta etapa. A navegação interna do módulo 1 segue os fluxos do Figma. Atualizar a documentação de arquitetura e design afetada.
- Separar mocks em pasta própria e acessá-los por uma interface de serviços de dados, sem imports diretos das telas. Usar o modelo relacional v4 como referência de dados, exceto onde a regra corrigida de Gestor Financeiro exige o modelo v5 e uma nova migração no backend. Não tratar o modelo como prova de API implementada.
- Os cinco perfis são Capitão, Gestor, Líder, Membro e Orientador. Gestor Financeiro é Gestor com atribuição adicional, não outro usuário nem outro perfil. Apenas o Capitão atribui, retira ou transfere essa responsabilidade; há no máximo um responsável, que pode estar ausente. A transferência é uma operação única. Somente Gestor ativo pode recebê-la; o estado do subsistema não impede a atribuição.
- Ações sem permissão ficam ocultas. Se uma ação permitida for bloqueada por regra de negócio, explicar o motivo. Dados e buscas respeitam a visibilidade; Líder e Membro veem a composição do próprio subsistema, inclusive inativo, sem expor usuários desativados. Somente Capitão, Gestor e o próprio usuário veem o respectivo RA ou SIAPE.
- A API atual de usuários retorna uma lista autorizada, sem paginação ou busca por texto no servidor; o RA pode vir ausente. Na integração, filtros, busca e paginação devem operar apenas sobre dados efetivamente recebidos e autorizados, salvo contrato novo acordado com o backend. Não inferir ou buscar identificadores ocultos.
- Não permitir que um usuário altere seu próprio perfil, desative sua conta ou corrija seu próprio nome ou RA; a troca da própria senha é permitida. A definição de Líder é um fluxo separado de uma troca de perfil comum. A desativação de usuário ou subsistema preserva histórico; não há exclusão.
- A desativação do subsistema transfere todos os usuários, inclusive desativados, a destinos ativos, individualmente se necessário, e o Líder passa a Membro. Sem destino ativo para usuários associados, bloquear; subsistema vazio não exige destino. Uma transferência comum pode ir para subsistema inativo.
- Usar Sonner para toasts de sucesso e falha; erros de formulário devem ficar associados aos campos. Não gerar falhas aleatórias nos mocks: prever uma forma controlada de simulação.
- O login demonstrativo mantém seus campos e aparência e, após entrar, assume um Gestor fictício existente. O seletor Dev escolhe perfil e usuário ativo coerente com os dados compartilhados; se uma pessoa mudar de perfil ou for desativada, selecionar outra disponível ou indicar indisponibilidade. Header, sidebar e conta devem refletir a identidade selecionada e sinalizar a demonstração. Deve permitir testar contas com troca de senha pendente. A restauração requer confirmação e retorna ao usuário padrão.
- A senha provisória é gerada e exibida uma única vez no cadastro e redefinição; não expira por prazo. Após cadastro ou redefinição, inclusive para o Capitão inicial, exigir troca antes de acessar módulos. A redefinição encerra sessões reais ativas. Simular esses estados sem apresentar a sessão mockada como autenticação real; não persistir senhas em texto no armazenamento dos mocks nem em logs. A senha exibida uma vez deve existir somente pelo tempo necessário à apresentação.
- Disponibilizar em Configurações, na área de conta, a troca voluntária da própria senha, independente do fluxo obrigatório. Solicitar a senha atual e a nova, apresentar erros junto aos campos e confirmar o resultado. No modo demonstrativo, simular a operação sem persistir senhas em texto nem tratar a simulação como autenticação real; na integração, usar o contrato de troca da própria senha do backend.
- Validar RA e SIAPE numéricos, com até 20 caracteres, e tratar identificadores repetidos. Ao encontrar conta desativada com o mesmo identificador, orientar sua reativação apenas a quem tiver permissão para consultá-la e reativá-la. Os contratos atuais limitam o nome do Usuário a 150 caracteres e o do Subsistema a 120; o nome do Subsistema é único sem diferenciar maiúsculas. As regras atuais de senha escolhida pelo usuário são 8 a 64 caracteres, até 72 bytes em UTF-8 e valor diferente da senha atual. Conferir os contratos corrigidos na integração; o backend é responsável pela validação definitiva.
- Após a integração, manter o modo demonstrativo separado apenas em desenvolvimento. As sessões reais usam backend, cookie de sessão, proteção CSRF e validação de permissões no servidor conforme o ADR de sessão. Configurar a mesma origem para frontend e API tanto no proxy de desenvolvimento quanto no roteamento de produção com HTTPS; não presumir que já estejam configurados. Não guardar credenciais ou sessão real no armazenamento local. Mudanças de atribuição devem valer no servidor para sessões abertas e refletir-se na interface ao receber atualização ou na próxima requisição.
- Na inicialização da sessão real, aguardar a consulta do usuário atual antes de decidir se uma rota protegida deve redirecionar. Diferenciar ausência ou expiração da sessão de falha de rede, preservar a rota protegida solicitada para retorno após o login e atualizar ou limpar a identidade no logout. Não rotular como demonstrativa uma sessão real. Os erros de API devem apresentar mensagens compreensíveis e associar erros de campo quando fornecidos; conferir o contrato vigente, que atualmente usa ProblemDetail.
- A integração é a última issue e depende dos ajustes de Gestor Financeiro, identificação, senha e Subsistemas nos endpoints de gestão já implementados. A resposta atual de usuário autenticado informa Perfil, Subsistema e permissões, mas ainda não informa a atribuição financeira nem a troca de senha pendente. Conferir os contratos existentes e suas alterações com o responsável pelo backend; não pressupor que o comportamento antigo represente as regras atuais.

## Verificação

- Testar comportamento pela interface e pelas operações de serviço, sem acoplar testes à estrutura interna dos componentes: preferir os pontos de interação existentes e uma única fronteira substituível para dados reais e mocks. A arquitetura exata dos testes pode ser definida na implementação; o frontend ainda não possui script de testes configurado.
- Cobrir criação, edição, pesquisa, filtros, permissões e privacidade do RA; ações bloqueadas; liderança e transferências; desativação de subsistemas com destinos individuais; atribuição, retirada e transferência financeira; persistência, troca de usuário e restauração dos mocks.
- Cobrir senha provisória, troca obrigatória, troca voluntária em Configurações e erros; carregamento, vazio e falha; sucesso e erros dos formulários. Verificar que a senha em texto não fica persistida após sua exibição e que buscas não revelam identificadores ocultos. Não assumir que mocks comprovam autorização real.
- Verificar no navegador desktop e mobile a partir de 320 px, ambos os temas, teclado, foco, Escape e drawer; verificar sidebar sem subitens. Executar as verificações de formatação e build do frontend. Conferir que build de produção não oferece operações mockadas do módulo.
- Na última etapa, testar login real, CSRF, inicialização e expiração de sessão, logout, retorno à rota solicitada, troca obrigatória e voluntária de senha, autorização e mudanças de permissão com o backend e contas apropriadas, além de falhas de rede e roteamento da API na mesma origem. O botão Dev não altera identidade ou permissões do servidor.

## Fora do escopo

- Implementação dos demais módulos e ajuste de suas regras de acesso; suas entradas permanecem visíveis na sidebar nesta etapa.
- Implementação do backend pelo frontend ou alteração de migrações já versionadas.
- Criar uma tela de troca de senha no Figma; a tela no frontend seguirá o design system.
- Tratar mocks, dados locais ou ocultação de botões como proteção de dados reais.

## Referências e dependências

- [Glossário](../../CONTEXT.md) e [ADR de sessão no servidor](../../docs/adr/0001-sessao-no-servidor.md).
- [Backend: Gestor Financeiro e modelo v5](../modulo-1_backend/issues/06-correcao-gestor-financeiro-banco.md).
- [Backend: identificação e senha provisória](../modulo-1_backend/issues/07-identificacao-e-senha-provisoria.md).
- [Backend: ajustes de desativação e visibilidade de subsistemas](../modulo-1_backend/issues/08-ajustar-desativacao-e-visibilidade-subsistemas.md) e histórico das issues de usuários, autenticação e liderança.
- A [especificação anterior de backend](../modulo-1_backend/spec.md) contém trechos sinalizados como desatualizados e precisa ser revisada; o modelo v5 proposto não é a migration Flyway V5 já existente.

## Comments
