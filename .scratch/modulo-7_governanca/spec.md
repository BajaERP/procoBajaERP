# Módulo 7 · Governança

Status: ready-for-agent

## Problema

A equipe precisa consultar o regimento, as normas e as diretrizes, identificar qual versão vale em cada período e registrar a Ciência e o Aceite do texto correto. Capitão e Gestor precisam preparar novas Versões e acompanhar pendências, preservando o conteúdo publicado e os registros anteriores. A entrada de Governança no ERP ainda exibe uma tela provisória.

## Solução

Entregar uma biblioteca de Documentos de governança com busca, leitura, histórico de Versões, edição de Rascunhos, publicação e gestão de Vigência. Oferecer Ciência e Aceite por Usuário e Versão, comprovante no ERP e acompanhamento da equipe por Capitão e Gestor. A integração principal usa a API de Governança e as contas do Módulo 1. O Dashboard consome a consulta pessoal de pendências em sua própria entrega.

## Histórias de usuário

1. Como Usuário ativo, quero buscar Documentos de governança por título ou tipo para localizar o texto que preciso consultar.
2. Como Usuário ativo, quero identificar se uma Versão publicada está vigente, tem vigência futura ou está no histórico para saber qual texto vale hoje.
3. Como Usuário ativo, quero ler uma Versão publicada antes de ela entrar em vigor para me preparar para a mudança.
4. Como Usuário ativo, quero consultar Versões publicadas anteriores e seus períodos de Vigência para saber qual texto valia em determinada data.
5. Como Líder, Membro ou Orientador, quero consultar somente conteúdo publicado para distinguir as normas oficiais do trabalho em elaboração.
6. Como Capitão ou Gestor, quero cadastrar título, tipo e descrição de um Documento de governança e preparar seu primeiro Rascunho.
7. Como Capitão ou Gestor, quero preparar outra Versão a partir do texto publicado para corrigi-lo ou atualizá-lo.
8. Como Capitão ou Gestor, quero editar um Rascunho e consultar o resumo, o autor e a data das alterações para acompanhar sua elaboração.
9. Como Gestor, quero marcar o Rascunho como Pronto para publicação para encaminhá-lo ao Capitão.
10. Como Capitão ou Gestor, quero que uma edição posterior retire a marcação de Pronto para publicação para que o novo conteúdo seja revisado.
11. Como Capitão, quero revisar e publicar um Rascunho preparado pelo Gestor e marcado como Pronto para publicação.
12. Como Capitão, quero aprovar e publicar diretamente um Rascunho que preparei para concluir a publicação.
13. Como Capitão, quero escolher Vigência imediata para tornar aplicável a nova Versão no momento da publicação.
14. Como Capitão, quero publicar com Vigência futura e manter a Versão atual aplicável até a data escolhida.
15. Como Capitão, quero identificar se já existe uma Versão futura publicada para respeitar o limite de uma por Documento.
16. Como Capitão, quero cancelar, com justificativa, a entrada em vigor de uma Versão futura publicada por engano.
17. Como Capitão, quero encerrar a Vigência de uma norma sem substituta, com justificativa, para registrar que ela deixou de valer.
18. Como Usuário autorizado, quero consultar conteúdo, motivo e Aceites preservados no histórico após encerramento ou cancelamento da Vigência, conforme meu acesso.
19. Como Usuário ativo na publicação, quero receber uma pendência para cada nova Versão, inclusive quando eu tiver sido o Capitão que publicou.
20. Como Usuário ativo na publicação de uma Versão futura, quero poder aceitá-la desde a publicação e identificar a data em que passa a valer.
21. Como Usuário que entrou após uma publicação, quero receber as Versões vigentes no ingresso e receber as futuras quando entrarem em vigor.
22. Como Usuário, quero confirmar apenas a Ciência para registrar que conheço a Versão antes de decidir se a aceito.
23. Como Usuário, quero registrar Ciência e Aceite juntos, ou aceitar depois, para confirmar a Versão no momento adequado.
24. Como Usuário, quero identificar quais Versões aguardam meu Aceite, inclusive quando a Ciência já tiver sido registrada.
25. Como Usuário, quero consultar no ERP o comprovante e as datas das minhas confirmações para verificar o que foi registrado.
26. Como Usuário, quero consultar meus Aceites anteriores mesmo depois de uma substituição, de um encerramento ou de um cancelamento.
27. Como Usuário reativado, quero retomar apenas os Aceites faltantes para Versões vigentes e conservar os que já registrei.
28. Como Capitão ou Gestor, quero acompanhar Ciência e Aceite da equipe por Versão, distinguindo quem já aceitou e quem ainda tem pendência.
29. Como Capitão ou Gestor, quero que contas desativadas saiam do acompanhamento atual e que os registros anteriores permaneçam no histórico autorizado.
30. Como Usuário, quero consultar as pendências em Governança e, quando o cartão do Dashboard estiver disponível, abrir a Versão pendente por ele enquanto continuo usando o ERP.
31. Como Usuário, quero usar a biblioteca e seus fluxos em desktop e mobile, com estados de carregamento, lista vazia, restrição de acesso e falha recuperável.

## Decisões de implementação

### Biblioteca, permissões e Rascunhos

- Manter texto, Versões e histórico dentro do ERP. Oferecer busca por título ou tipo, leitura da Versão e acesso ao histórico, com número, situação de Vigência e datas. Aplicar as permissões também aos resultados de busca, contagens, históricos e acessos diretos.
- Capitão e Gestor criam Documentos, consultam e editam Rascunhos, consultam o histórico de edições e acompanham pendências da equipe. Gestor Financeiro mantém as permissões de Gestor. Líder, Membro e Orientador consultam conteúdo publicado e o histórico autorizado. Todos os Usuários ativos podem registrar as próprias confirmações.
- Registrar as alterações de Rascunho com resumo, autor e data. Um Rascunho preparado pelo Gestor precisa da marcação Pronto para publicação. Alterar o conteúdo retira essa marcação. O Capitão pode publicar diretamente um Rascunho que ele próprio preparou. O servidor verifica o conteúdo e a situação atual antes de publicar, inclusive se a revisão já estiver aberta no navegador.
- A aprovação final e a publicação são exclusivas do Capitão. Na publicação, registrar aprovação, autor e datas. Conteúdo publicado é imutável. Uma correção ou atualização passa por novo Rascunho e nova publicação, preservando o texto anterior e seus Aceites.

### Publicação e Vigência

- A leitura é liberada na publicação. A Vigência pode começar na publicação ou em data futura. Na substituição, a Versão anterior vale até o início da nova e a troca ocorre sem sobreposição. O servidor define qual Versão está vigente a partir das datas e usa o mesmo critério nas consultas e nos comandos.
- Cada Documento admite uma única Versão publicada aguardando o início da Vigência. O Capitão pode cancelar essa entrada em vigor antes da data, com justificativa. A Versão segue consultável no histórico com a justificativa e os Aceites já registrados. As pendências encerram e a Versão anterior continua vigente quando houver.
- O Capitão pode encerrar a Vigência de uma norma sem substituta, com justificativa. A operação preserva conteúdo, histórico e Aceites e retira as pendências atuais dessa Versão.
- Executar publicação, substituição e cancelamento como operações transacionais. Em caso de conflito ou ação concorrente, preservar a consistência das Vigências, a autoria e as confirmações já registradas. Reusar as estruturas existentes do DBML v6 e das migrações Flyway V1–V11.

### Ciência, Aceite e acompanhamento

- Usar o par Usuário e Versão como identidade da confirmação. Registrar só Ciência ou Ciência e Aceite juntos. Ao aceitar depois, conservar a data inicial da Ciência e registrar a data do Aceite. A confirmação é pessoal. Repetir uma ação já concluída conserva o registro e suas datas originais.
- Exibir Ciência registrada e Aceite pendente como situação intermediária. A consulta pessoal separa as pendências das confirmações concluídas e do histórico, incluindo o comprovante no ERP com Documento, Versão, Usuário e datas registradas.
- Atribuir o Aceite aos Usuários ativos na publicação, inclusive ao Capitão que publicou. Com Vigência futura, permitir confirmação antecipada a esse grupo, informar a data de início e conservar o Aceite quando a norma entrar em vigor.
- Quem ingressa depois recebe as Versões vigentes no ingresso. Uma Versão futura passa a ser exigida desse Usuário quando entrar em vigor. Ao desativar uma conta, retirar suas pendências do acompanhamento atual e preservar os registros. Na reativação, retomar apenas os Aceites faltantes das Versões vigentes e aplicar a regra de início às Versões futuras.
- Quando uma Versão deixa de valer por substituição ou encerramento, suas pendências deixam de ser exigidas. O mesmo vale para uma Versão futura cancelada. Aceites concluídos continuam consultáveis no histórico.
- Capitão e Gestor consultam o acompanhamento da equipe por Versão, com contas elegíveis, pendências, Ciência e Aceites concluídos. Outros Perfis acessam apenas suas próprias confirmações. O Dashboard recebe somente as pendências pessoais do Usuário autenticado, com Documento, Versão, data de início e referência para abrir a Versão. A pendência permite continuar usando o ERP.

### Contrato e entregas

- Definir um contrato compartilhado para busca, biblioteca, leitura, Rascunhos, publicação, Vigência, históricos, comandos de Ciência e Aceite, acompanhamento e consulta pessoal. Acordar a representação de datas com fuso explícito, as capacidades por Perfil e os erros de validação, autorização, conflito e indisponibilidade.
- Reusar a sessão e os Perfis do Módulo 1, o padrão HTTP e CSRF do ERP e as regras de autorização no servidor. Reusar a entrada Governança na sidebar e os componentes do design system. Usar as telas do Figma para biblioteca, leitura, edição, acompanhamento e comprovante.
- Depois do contrato, o frontend avança com mocks isolados em desenvolvimento e o backend implementa a API com base no esquema atual. A integração principal liga as telas à API real de Governança. O Módulo 8 entrega o cartão de pendências a partir da consulta pessoal já disponibilizada pelo Módulo 7.

## Decisões de verificação

- Verificar comportamento do backend pela API autenticada com PostgreSQL e Flyway, seguindo os testes de integração de Equipe e Subsistemas. Exercitar biblioteca, leitura, históricos, edição e comandos com Capitão, Gestor, Gestor Financeiro, Líder, Membro e Orientador. Conferir dono das confirmações, visibilidade do Rascunho e autorização de acesso direto.
- Verificar marcação de Pronto para publicação e sua retirada após edição, publicação direta pelo Capitão, rejeição de concorrência sobre Rascunho alterado e imutabilidade do conteúdo publicado.
- Usar datas controladas para verificar publicação imediata e futura, cancelamento antes da entrada em vigor, encerramento sem substituta, consultas históricas e a transição no instante de início. Cobrir o limite de uma futura por Documento e tentativas concorrentes. Conferir a preservação da Versão anterior e dos Aceites.
- Verificar Ciência seguida de Aceite, registro conjunto, repetição, Aceite antecipado e consulta pessoal. Cobrir ingresso e reativação antes e depois da Vigência, retirada de contas desativadas do acompanhamento e preservação de confirmações anteriores. Confirmar que cada Usuário recebe apenas seus dados na consulta consumida pelo Dashboard.
- No frontend, verificar primeiro pelo contrato com mocks e depois com sessão e API reais. Conferir biblioteca, leitura, revisão, confirmação, pendências e histórico em desktop e mobile a partir de 320 px, nos temas claro e escuro, com teclado e foco visível. Exercitar carregamento, vazio, acesso restrito, conflito e nova tentativa.

## Fora de escopo

- Mudanças de tabelas, colunas, índices, restrições ou migrações nas issues funcionais.
- Armazenamento dos Documentos de governança no Drive. O conteúdo e os comprovantes previstos são consultados dentro do ERP.
- Interface do cartão de pendências, entregue no Módulo 8.

## Referências

- [Decisões de Governança](../modulos-restantes/map.md#governança), [glossário](../../CONTEXT.md#governança), [guia do módulo](../../docs/projeto/modulos/governanca.md), [requisitos RF28–RF29](../../docs/projeto/requisitos/funcionais.md) e [base de modelagem](../../docs/projeto/modelagem.md#base-das-especificações-dos-módulos).
- [Figma de Governança](https://www.figma.com/design/NhEuGEDcNqW2NNMnP614YV/PROCOBAJA-ERP-%C2%B7-UI-Kit---Design-System?node-id=127-7211), [sessão no servidor](../../docs/adr/0001-sessao-no-servidor.md) e [Gestor Financeiro](../../docs/adr/0002-gestor-financeiro-derivado-do-subsistema.md).
- [Dependências entre módulos](../modulos-restantes/map.md#dependências-entre-entregas) e [Dashboard e Indicadores](../../docs/projeto/modulos/dashboard-e-indicadores.md).

## Comments
