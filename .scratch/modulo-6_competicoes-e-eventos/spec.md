# Módulo 6 · Competições e Eventos

Status: ready-for-agent

## Problema

A equipe precisa consultar os próximos compromissos e preservar o histórico de Reuniões, Competições e Eventos gerais. Quem organiza precisa manter horários, responsáveis, Inscrições, Logística e Resultados em um só lugar. A chamada precisa respeitar o tipo de Evento e a responsabilidade de cada pessoa. A entrada do módulo no ERP ainda exibe uma tela provisória.

## Solução

Entregar uma agenda com busca, filtros e histórico, além de detalhes e operações próprias de cada tipo de Evento. Os responsáveis poderão preparar e registrar a chamada pelo detalhe, usando as regras de Pessoas e Participação. Documentos e dados financeiros relacionados serão consultados conforme as permissões dos módulos de origem.

Frontend e backend avançam em paralelo após o contrato compartilhado. A integração principal entrega os fluxos próprios de Competições e Eventos. A chamada real e os vínculos com Documentação e Financeiro terão entregas próprias.

## Histórias de usuário

1. Como usuário ativo, quero consultar os próximos compromissos que posso acessar para planejar minha participação.
2. Como usuário autorizado, quero buscar por nome, local ou responsável e filtrar por tipo para localizar um Evento.
3. Como usuário autorizado, quero consultar Eventos anteriores e Competições por edição para recuperar informações da equipe.
4. Como Orientador, quero consultar somente Competições atuais e históricas para acompanhar a equipe.
5. Como Capitão ou Gestor, quero cadastrar Reuniões, Competições e Eventos gerais com nome e horário inicial para publicá-los na agenda.
6. Como organizador autorizado, quero completar local, horário de término e descrição depois de cadastrar o Evento.
7. Como Capitão ou Gestor, quero cadastrar uma Reunião dos Gestores ou uma Reunião conjunta de Subsistemas para reunir os participantes certos.
8. Como Líder, quero criar e editar Reuniões do meu Subsistema para organizar suas atividades.
9. Como organizador autorizado, quero registrar a pauta e o resumo de uma Reunião para consultar seus encaminhamentos.
10. Como Capitão ou Gestor, quero informar edição, período de Inscrição, desafio técnico e veículo de uma Competição para organizar a preparação da equipe.
11. Como Capitão ou Gestor, quero definir quem registra a chamada de uma Competição, Evento geral ou Reunião avulsa para atribuir essa responsabilidade.
12. Como organizador, quero abrir um Evento da agenda e ver no detalhe se a chamada ainda está sem responsável para poder designar alguém.
13. Como Líder, quero consultar as minhas responsabilidades no Evento para saber se posso registrar a chamada ou manter a Logística.
14. Como Capitão ou Gestor, quero transferir a responsabilidade pela chamada, preservando a autoria dos lançamentos já feitos.
15. Como Líder de um Subsistema envolvido em Reunião semanal conjunta, quero registrar somente a Participação dos Integrantes do meu Subsistema.
16. Como Gestor responsável por uma Reunião dos Gestores, quero receber uma lista sugerida dos Gestores para preparar a chamada.
17. Como responsável pela chamada de uma Competição, quero usar as Inscrições confirmadas como sugestão de participantes.
18. Como responsável por uma Reunião avulsa ou Evento geral, quero selecionar os participantes esperados para preparar a chamada.
19. Como responsável pela chamada, quero ajustar a lista de Participações Previstas antes do lançamento para registrar quem é esperado.
20. Como responsável pela chamada, quero registrar Presente, Ausente ou Justificada a partir do início e voltar às Participações que ainda ficaram Previstas.
21. Como Capitão ou Gestor, quero que os lançamentos finais apareçam na fila de Validação do Módulo 4 e que as correções preservem o histórico.
22. Como Integrante, quero consultar minha Participação em um Evento, inclusive se o compromisso for cancelado depois.
23. Como Orientador, quero acompanhar a Participação agregada de uma Competição para entender o envolvimento da equipe.
24. Como Capitão ou Gestor, quero cadastrar uma Inscrição por Integrante em cada Competição e atualizar sua situação.
25. Como Integrante inscrito, quero consultar minha Inscrição para saber se está Pendente, Confirmada ou Cancelada.
26. Como Capitão ou Gestor, quero cancelar uma Inscrição quando houver desistência, preservando o registro e a Participação já lançada.
27. Como Capitão ou Gestor, quero gerenciar a Logística e atribuir essa responsabilidade a um Líder ativo para um Evento específico.
28. Como responsável pela Logística, quero registrar transporte, compartilhamento com outra equipe, hospedagem, alimentação, condições operacionais da Inscrição e Auxílios.
29. Como Capitão ou Gestor, quero registrar vários Resultados por edição, com modalidade e ao menos posição, pontuação ou descrição.
30. Como usuário autorizado, quero consultar os Resultados de uma Competição atual ou histórica para acompanhar o desempenho.
31. Como organizador autorizado, quero remarcar um Evento mantendo suas Inscrições, suas Participações Previstas e a data anterior no histórico.
32. Como Capitão ou Gestor, quero corrigir a data após um lançamento final, com justificativa, para preservar a rastreabilidade da alteração.
33. Como Capitão ou Gestor, quero cancelar qualquer compromisso com motivo e mantê-lo consultável no histórico.
34. Como Líder, quero cancelar uma Reunião exclusiva do meu Subsistema com motivo para comunicar que ela foi desmarcada.
35. Como usuário autorizado, quero saber por que um Evento foi cancelado e acessar os registros anteriores que posso consultar.
36. Como organizador autorizado, quero vincular atas, regulamentos e outros Documentos ao Evento para facilitar a consulta.
37. Como usuário autorizado, quero abrir um Documento pelo Evento com as mesmas permissões da biblioteca.
38. Como Capitão ou Gestor Financeiro, quero consultar os registros financeiros relacionados pelo Financeiro, a partir do Evento.
39. Como usuário sem autorização financeira, quero consultar os dados operacionais que me cabem sem receber valores, totais ou metadados financeiros protegidos.
40. Como usuário, quero usar os fluxos em desktop e mobile e distinguir carregamento, ausência de resultados, acesso restrito e falha recuperável.

## Decisões de implementação

### Agenda e permissões

- A agenda unificada oferece Próximos e Histórico, busca por nome, local ou responsável e filtros de Competições, Reuniões e Eventos gerais. O detalhe exibe os dados e as operações que cabem ao tipo e ao perfil. Na agenda do Orientador, a consulta se limita a Competições atuais e históricas. O Figma orienta a apresentação, incluindo desktop, mobile e estados de feedback.
- O cadastro exige tipo, nome e data e hora de início. Término, local e descrição são opcionais. Validar a ordem entre início e término e, em Competições, entre as datas do período de Inscrição. Reuniões podem ter pauta, resumo e Subsistemas envolvidos. Uma nova edição de Competição é um novo Evento.
- Capitão e Gestor gerenciam os compromissos de todos os tipos. Líder pode criar e editar Reuniões do próprio Subsistema. A atribuição de chamada autoriza a operação de Participação, e a atribuição de Logística autoriza a operação logística. O acesso à edição dos demais dados do Evento segue as permissões do perfil.
- Membro consulta os dados não confidenciais autorizados, a própria Inscrição e a própria Participação. Orientador consulta dados autorizados de Competições e, quando a integração de Participação estiver disponível, indicadores agregados sem justificativas ou registros individuais. Aplicar o escopo na busca, na listagem e no acesso direto, inclusive no histórico.
- Gestor Financeiro mantém todas as permissões operacionais de Gestor. Sua autorização financeira vem do vínculo ativo com o Subsistema Financeiro, conforme o ADR 0002.

### Inscrições, Logística e Resultados

- Capitão ou Gestor registra e atualiza uma Inscrição por Integrante e Competição, nas situações Pendente, Confirmada ou Cancelada. Só Confirmada entra na sugestão da chamada. Cancelar mantém o registro de Inscrição e as Participações já lançadas. A própria Inscrição fica disponível ao Integrante.
- Capitão e Gestor gerenciam a Logística e podem delegá-la a um Líder ativo por Evento. Registrar transporte, compartilhamento, hospedagem, alimentação, Inscrição e demais arranjos como dados operacionais. Registrar Auxílios com a instituição e a descrição quando disponíveis. Auxílio operacional fica sem valor e sem geração automática de Entrada.
- Capitão e Gestor registram vários Resultados por edição, por prova, categoria ou modalidade. Cada Resultado exige modalidade e pelo menos um dado entre posição, pontuação e descrição.

### Remarcação e cancelamento

- A remarcação conserva o Evento, suas Inscrições e Participações Previstas. Registrar datas anteriores e novas, autor, momento e motivo quando informado. O motivo é opcional na remarcação comum.
- Com lançamento de Presente, Ausente ou Justificada, mesmo pendente de Validação, alterar a data passa a ser uma correção de erro reservada a Capitão ou Gestor, com justificativa obrigatória. O backend verifica essa condição pelos registros existentes no esquema, inclusive quando a interface da chamada ainda estiver pendente. A alteração do horário e o registro de histórico devem ser atômicos.
- Capitão e Gestor podem cancelar qualquer compromisso. O Líder pode cancelar Reunião exclusiva do próprio Subsistema. O cancelamento de Reunião conjunta cabe a Capitão ou Gestor. Registrar motivo, autor e horário. Manter o Evento no Histórico e conservar as Participações existentes. O cancelamento bloqueia novos lançamentos e retira o Evento dos indicadores de Participação.

### Participação em Eventos

| Tipo de compromisso | Quem registra | Como a lista é preparada |
| --- | --- | --- |
| Reunião semanal de Subsistema | Cada Líder registra para o próprio Subsistema, inclusive em Reunião conjunta. | Sugerir Integrantes dos Subsistemas envolvidos, respeitando o escopo de cada Líder. |
| Reunião dos Gestores | Gestor responsável. | Sugerir os Gestores. |
| Competição | Capitão, Gestor ou Líder ativo designado por Capitão ou Gestor. | Sugerir Integrantes com Inscrição confirmada. |
| Evento geral ou Reunião avulsa | Capitão, Gestor ou Líder ativo designado por Capitão ou Gestor. | O responsável seleciona os participantes esperados. |

- A atribuição de chamada vale para o Evento e é independente da de Logística. O Evento pode constar na agenda antes da atribuição. O detalhe informa a pendência e bloqueia a chamada até haver responsável. Na troca de responsável, preservar lançamentos e autoria, revogar o acesso ligado à atribuição anterior e permitir que o novo responsável ajuste ou complete lançamentos pendentes.
- A lista sugerida pode ser ajustada e salva como Prevista antes do Evento. A partir do início, registrar Presente, Ausente ou Justificada. Justificada exige motivo e Ausente aceita motivo opcional. Prevista permanece assim até confirmação, inclusive após o fim do Evento, e fica fora da fila de Validação e dos indicadores.
- Competições e Eventos fornece tipo, datas, cancelamento, responsáveis e dados para a lista de esperados. Pessoas e Participação mantém os lançamentos, a Validação e o histórico. Capitão e Gestor validam, inclusive a própria Participação, e podem corrigir registros validados com justificativa e nova Validação. Os indicadores consideram situações finais validadas de Eventos não cancelados.
- A integração na tela do Evento depende da entrega de Participação em Eventos do Módulo 4. Reavaliar horário, cancelamento, atribuição e escopo no servidor ao salvar, inclusive quando mudarem após a abertura da chamada. As duas áreas devem testar alterações concorrentes entre lançamento, cancelamento e correção de data.

### Contrato e entregas

- Acordar o contrato antes das trilhas de frontend e backend. Especificar consultas, filtros, datas com fuso explícito, campos por tipo, capacidades e comandos, históricos e erros de autorização, datas inconsistentes, Inscrição duplicada, conflito de estado e indisponibilidade. Reusar a sessão e as permissões do Módulo 1 e o padrão HTTP e CSRF do ERP. O servidor é a fonte das permissões.
- Implementar as telas com mocks isolados e com formatos compatíveis com o contrato. Reusar a entrada Competições e Eventos na sidebar e os componentes do design system. Manter os fluxos demonstrativos em desenvolvimento até a integração à API.
- A integração principal do frontend depende da API do próprio módulo para agenda, detalhe, cadastro, responsabilidades, remarcação, cancelamento, Inscrições, Logística e Resultados. As integrações com os Módulos 3, 4 e 5 têm dependências próprias e podem avançar conforme seus contratos reais ficarem disponíveis. A agenda também fornece uma consulta autorizada que o Dashboard poderá consumir em sua própria entrega.
- Associações com Documentos são opcionais no cadastro e no encerramento. A entrega de vínculo a atas, regulamentos e outros arquivos depende da biblioteca, da consulta autorizada e da abertura das Versões pelo Módulo 5. A Associação preserva as permissões de Documentação. Falhas do Drive têm feedback no fluxo de Documentos e preservam o acesso aos dados do Evento.
- A entrega financeira usa os registros vinculados do Módulo 3 e encaminha o usuário autorizado ao Financeiro para consultar valores e pagamentos. Logística fica sem valores. O Evento não replica totais, preços, comprovantes ou metadados financeiros protegidos para perfis sem acesso. A entrega deve indicar a consulta por Evento de que precisa no contrato de Gestão Financeira.
- Usar o DBML v6 e o esquema Flyway V1–V11. Usar as estruturas existentes para subtipos, responsabilidades, Inscrições, Resultados, histórico e vínculos. As regras de situação da Inscrição e as permissões por Evento ficam nos serviços.

## Decisões de verificação

- No backend, testar pelo limite da API autenticada, com PostgreSQL e Flyway, seguindo os testes de integração de Equipe e Subsistemas. Exercitar consulta e comandos com Capitão, Gestor, Gestor Financeiro, Líderes de dois Subsistemas, Membro e Orientador, incluindo acesso direto e ausência de dados protegidos nas respostas.
- Cobrir campos obrigatórios e datas, histórico por edição, duplicidade de Inscrição, preservação após cancelamento, Resultados incompletos, independência das duas atribuições e autorização de Líder em Reuniões exclusivas e conjuntas. Preparar registros de Participação no banco de teste para validar remarcação e correção com ou sem lançamento final antes da integração com o Módulo 4.
- No frontend, testar comportamento pelo contrato compartilhado com mocks. Conferir agenda, filtros, detalhe, formulários e operações permitidas. No navegador, verificar desktop, mobile a partir de 320 px, temas claro e escuro, teclado, foco e feedback para carregamento, vazio, erro, conflito, restrição e nova tentativa.
- Na integração principal, verificar os mesmos fluxos com a API do Módulo 6 e sessão real. Nas entregas externas, verificar cada integração ponta a ponta. Na chamada, cobrir lista Prevista, início, troca de responsável, cancelamento, correção de data, Validação e histórico. Nos vínculos, comprovar que um Evento acessível mantém Documentos e dados financeiros protegidos e que as operações autorizadas continuam acessíveis.

## Fora de escopo

- Alterar tabelas, colunas, índices, restrições ou migrações nas issues funcionais.
- Autoinscrição, duplicação de valores na Logística ou geração automática de Entrada por Auxílio operacional.
- Reimplementar Validação, histórico de Participação, gestão de arquivos, lançamentos financeiros ou o Dashboard dentro do Módulo 6.

## Referências

- [Decisões e dependências aprovadas](../modulos-restantes/map.md#dependências-entre-entregas), [glossário](../../CONTEXT.md#competições-e-eventos), [guia do módulo](../../docs/projeto/modulos/competicoes-e-eventos.md) e [modelagem vigente](../../docs/projeto/modelagem.md#base-das-especificações-dos-módulos).
- [Figma de Competições e Eventos](https://www.figma.com/design/NhEuGEDcNqW2NNMnP614YV/PROCOBAJA-ERP-%C2%B7-UI-Kit---Design-System?node-id=126-3399) e [ADR 0002 · Gestor Financeiro](../../docs/adr/0002-gestor-financeiro-derivado-do-subsistema.md).
- [Participação em Eventos · Módulo 4](../modulo-4_pessoas-e-participacao/issues/08-backend-participacao-eventos.md), [Gestão Financeira · Módulo 3](../modulo-3_gestao-financeira/spec.md) e [Documentação · Módulo 5](../modulo-5_documentacao/spec.md).

## Comments
