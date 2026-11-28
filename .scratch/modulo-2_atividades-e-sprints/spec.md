# Módulo 2 · Atividades e Sprints

Status: ready-for-agent

## Problema

A equipe precisa organizar o trabalho de vários Subsistemas, planejar Sprints e acompanhar responsabilidades, prazos e mudanças de estado. O ERP já tem uma entrada para Atividades e Sprints, mas ainda exibe uma tela provisória. Quem planeja precisa saber quais Atividades podem entrar em uma Sprint e o que ficou pendente ao encerrá-la. Quem executa precisa encontrar suas Atividades e atualizar o andamento conforme seu Perfil.

## Solução

Entregar um módulo com Quadro, Backlog e Sprints. O Quadro mostra o andamento, o Backlog reúne Atividades sem Alocação vigente, e Sprints reúne planejamento, execução e histórico de encerramentos. A API aplica permissões por Perfil, Subsistema e atribuição. O frontend apresenta os dados e ações autorizados, com os mesmos contratos nas respostas simuladas e na integração real.

## Histórias de usuário

1. Como Capitão ou Gestor, quero consultar e filtrar as Atividades da equipe para planejar o trabalho dos Subsistemas.
2. Como Capitão ou Gestor, quero cadastrar uma Atividade no Backlog sem preencher prazo, Estimativa de esforço ou Responsável para detalhá-la depois.
3. Como Capitão ou Gestor, quero vincular vários Subsistemas a uma Atividade para planejar trabalho em conjunto.
4. Como Capitão ou Gestor, quero atribuir Responsáveis de outros Subsistemas para organizar a colaboração.
5. Como Líder, quero criar e planejar Atividades exclusivas do meu Subsistema para organizar seu trabalho.
6. Como Líder, quero consultar Atividades de outros Subsistemas para acompanhar dependências.
7. Como Líder, quero atualizar o andamento de Atividades que envolvem meu Subsistema, inclusive nas compartilhadas.
8. Como Membro, quero consultar as Atividades do meu Subsistema e as atribuídas a mim para acompanhar o que afeta meu trabalho.
9. Como Membro responsável, quero iniciar, pausar, retomar e concluir minhas Atividades para manter o Quadro atualizado.
10. Como Membro corresponsável, quero ver quem alterou o estado para acompanhar mudanças feitas por outro responsável.
11. Como Orientador, quero consultar o andamento dos Subsistemas ativos para acompanhar o projeto.
12. Como Gestor Financeiro, quero conservar as permissões de Gestor para atuar no planejamento da equipe.
13. Como Capitão ou Gestor, quero criar uma Sprint futura com datas ajustáveis e sugestão de 15 dias.
14. Como Capitão ou Gestor, quero alocar uma Atividade com prazo, estimativa e responsável ativo para montar o planejamento da Sprint.
15. Como Capitão ou Gestor, quero identificar quais campos faltam para poder alocar uma Atividade.
16. Como pessoa que consulta o Backlog, quero que uma Atividade já alocada apareça na Sprint correspondente, inclusive quando ela é futura.
17. Como Capitão ou Gestor, quero confirmar o início da Sprint e saber se outra ainda está em andamento.
18. Como Capitão ou Gestor, quero incluir Atividades durante a Sprint quando surgirem novas prioridades.
19. Como Capitão ou Gestor, quero retirar uma Atividade com motivo e indicar o destino para registrar a mudança de escopo.
20. Como Capitão ou Gestor, quero ser avisado de que a Sprint chegou à data final para revisar o Quadro e decidir quando encerrar.
21. Como Capitão ou Gestor, quero escolher o destino de cada pendência antes de confirmar o encerramento.
22. Como Capitão ou Gestor, quero que o encerramento seja integral para evitar mover parte das Atividades se um destino for inválido.
23. Como pessoa com acesso à Sprint, quero consultar o resultado registrado no encerramento mesmo que o trabalho continue em outra Sprint.
24. Como pessoa com acesso a uma Atividade transferida, quero ver sua origem, as passagens e o prazo preservado.
25. Como Capitão, Gestor ou Líder autorizado, quero reabrir uma Atividade concluída com motivo para corrigir o andamento sem alterar resultados passados.
26. Como Capitão ou Gestor, quero arquivar uma Atividade com motivo para mantê-la no histórico e retirá-la do Quadro ativo.
27. Como Líder, quero arquivar uma Atividade exclusiva do meu Subsistema no Backlog para retirar trabalho que perdeu relevância.
28. Como responsável pelo planejamento, quero identificar Atividades que perderam seu último Responsável ativo para poder reatribuí-las.
29. Como pessoa com acesso ao Quadro, quero distinguir pouco progresso, atraso e transferência para interpretar cada indicação.
30. Como usuário em desktop ou mobile, quero navegar entre Quadro, Backlog, Sprints e detalhes com estados claros quando a consulta estiver vazia, carregando ou falhar.

## Decisões de implementação

### Permissões

| Perfil | Consultas | Ações |
| --- | --- | --- |
| Capitão e Gestor | Atividades e Sprints da equipe, inclusive históricos. | Criar, editar e arquivar Atividades. Alterar andamento e reabrir. Planejar, iniciar e encerrar Sprints, alocar, retirar e transferir Atividades. |
| Gestor Financeiro | Mesmo escopo de Gestor. | Mesmas permissões de Gestor. |
| Líder | Atividades do próprio Subsistema e consulta dos demais. | Criar, editar o planejamento e reabrir Atividades exclusivas do próprio Subsistema. Pode arquivá-las quando estiverem no Backlog. Pode atualizar o andamento de Atividades que envolvam seu Subsistema. |
| Membro | Atividades do próprio Subsistema e as atribuídas a ele. | Alterar o andamento das Atividades pelas quais é Responsável. |
| Orientador | Andamento dos Subsistemas ativos, com consultas limitadas a esse escopo. | Consulta. |

- A matriz se aplica a listagens, filtros, detalhes, histórico e indicadores. Em Atividade compartilhada, prazo, prioridade ou vínculo com Subsistemas são mudanças de planejamento reservadas a Capitão ou Gestor. Autorização é verificada no servidor a cada operação.
- A sessão, os Perfis e os Subsistemas vêm de Equipe e Subsistemas. Gestor Financeiro continua sendo Gestor. A interface pode omitir ou desabilitar ações indisponíveis, conforme o contexto, usando as capacidades retornadas pela API.

### Backlog, Atividades e Quadro

- Toda Atividade exige ao menos um Subsistema. Pode ter vários Subsistemas e vários Responsáveis, inclusive de fora deles. Prazo, estimativa e Responsável são opcionais no Backlog.
- A Estimativa de esforço aceita 1, 2, 3, 5, 8, 13 e 21. A Alocação exige prazo, estimativa válida e pelo menos um Responsável ativo. Se o último Responsável ativo for desativado depois, a Atividade permanece onde está, e o ERP sinaliza que precisa de nova atribuição.
- Uma Atividade sai do Backlog ao receber uma Alocação, inclusive para Sprint planejada. A retirada sem outra Alocação a devolve ao Backlog. As Atividades arquivadas saem das visões ativas e permanecem no histórico. Arquivar registra motivo, autor e data.
- O fluxo de execução passa por Não iniciada, Em andamento, Pausada e Concluída. Iniciar e retomar levam a Em andamento, pausar leva a Pausada e concluir leva a Concluída. A mudança de estado tem autoria e data. Reabrir exige motivo e volta a Em andamento. O resultado de Sprints encerradas é preservado.
- Não concluída é o resultado histórico de uma Atividade pendente no fechamento da Sprint. O Quadro usa o estado de trabalho atual. O histórico mostra o resultado de cada passagem, as retiradas e as alterações de planejamento, como o ajuste de prazo.

### Ciclo da Sprint

- A Sprint tem datas planejadas e registros efetivos de início e fim. A duração sugerida de 15 dias pode ser ajustada por Capitão ou Gestor. É possível planejar Sprints futuras e ter uma só Sprint em andamento. Início e encerramento exigem confirmação. A data final prevista gera sinalização de que o prazo da Sprint chegou.
- Uma Atividade pode ter uma só Alocação vigente. Capitão e Gestor podem ajustar a composição de uma Sprint em andamento. A retirada registra autor, motivo e destino, que pode ser Backlog ou outra Sprint já planejada. O histórico distingue retirada de pendência no encerramento.
- No encerramento, o servidor registra o resultado de cada Alocação. Para cada Atividade pendente, Capitão ou Gestor escolhe Backlog ou uma Sprint futura já planejada. A Atividade mantém seu estado de trabalho. A transferência preserva a origem, a cadeia de passagens e o prazo. Ajuste de prazo é uma ação explícita, com registro no histórico.
- O encerramento e as movimentações resultantes ocorrem em uma única transação. O backend verifica todos os destinos e requisitos de Alocação antes de concluir. Se houver destino inválido, mudança concorrente ou Atividade sem os requisitos para o destino escolhido, o encerramento falha e a Sprint continua em andamento, com as Alocações intactas.

### Alertas

- O alerta de pouco progresso aparece para Atividades Não iniciadas ou Pausadas a partir do dia que marca a metade do período planejado da Sprint. Contar as datas inicial e final e usar o primeiro dia da segunda metade, incluindo o dia central quando houver número ímpar de dias. Para uma Sprint de 1 a 15, o alerta começa no dia 8.
- Para Atividade Em andamento, o atraso começa no dia seguinte ao prazo. O horário de Brasília, `America/Sao_Paulo`, é a referência para determinar o dia. Transferida é uma indicação separada, derivada da passagem da Atividade entre Sprints. A indicação de falta de Responsável ativo é separada dos alertas de data.

### Contrato compartilhado

- Consultas cobrem Quadro, Backlog, Sprints planejadas, Sprint em andamento, Sprints encerradas e detalhes com histórico. A resposta distingue o estado atual da Atividade do resultado histórico na Sprint. Campos de consulta incluem prioridade, prazo, estimativa, Subsistemas, Responsáveis, Alocação e alertas aplicáveis, sempre no escopo autorizado.
- Comandos cobrem criar, editar e arquivar Atividade, atualizar estado, reabrir, planejar e iniciar Sprint, alocar, retirar e encerrar. A solicitação de encerramento identifica a Sprint e o destino de cada pendência. Respostas de erro permitem distinguir validação, ação sem permissão e conflito com o estado atual. Datas planejadas e prazos são datas de calendário; eventos do histórico têm data e hora.
- Frontend e backend alinham os formatos de consulta, comandos, capacidades e erros antes de criar dependências de integração nas issues. O frontend pode desenvolver com mocks isolados seguindo esse contrato. A integração usa a sessão real, os padrões HTTP e CSRF do ERP e atualiza as consultas afetadas após uma alteração.
- A navegação mantém uma entrada do módulo na sidebar. Quadro, Backlog e Sprints ficam dentro do módulo. A interface segue o design system, as telas de desktop e mobile e os estados de feedback do Figma. A matriz de permissões desta especificação orienta as ações quando o design divergir dela.
- A persistência utiliza o DBML v6 e o esquema Flyway V1–V11 da develop. Usar os registros existentes de Atividade, Alocação e históricos para representar os fluxos. As issues de backend podem mapear, consultar e gravar nessas estruturas.

## Decisões de verificação

- No backend, validar os fluxos pela API autenticada com PostgreSQL e Flyway, seguindo os testes de integração de Equipe e Subsistemas. Cobrir escopo por Perfil e Subsistema, caso de Atividade compartilhada, Responsável de outro Subsistema, tentativa de ação sem permissão e a equivalência entre Gestor e Gestor Financeiro neste módulo.
- Exercitar Alocação antes do início, requisitos incompletos, duas tentativas de iniciar Sprint, retirada durante a execução, encerramento com destino inválido e encerramento com destinos mistos. Conferir tanto a resposta quanto o estado consultado após a operação. Verificar que reabertura e transferência preservam o histórico anterior.
- Usar datas fixas para verificar o dia anterior e o dia inicial do alerta, o prazo e o dia seguinte, e a virada da data em Brasília. Verificar que Transferida, atraso e falta de Responsável são apresentados como sinais distintos.
- No frontend, verificar comportamentos visíveis pelo contrato de consultas e ações, reaproveitando o padrão de adaptadores do Módulo 1. Cobrir filtro, falta de permissão, validação de campos, atualização após alterações e estados de carregamento, vazio, falha e nova tentativa. Conferir navegação e fluxos principais em desktop e mobile, com teclado e temas claro e escuro.
- Na integração real, verificar uma Atividade do Backlog até o Quadro, transição por Responsável, retirada ou fechamento da Sprint e consulta do histórico preservado. Usar contas com escopos distintos e verificar que o servidor rejeita ações que a interface não oferece.

## Fora de escopo

- Alterar o esquema do banco, criar novas migrações ou modificar tabelas, colunas, índices e restrições. Essa regra se aplica às issues funcionais de todos os módulos.
- Implementar o Dashboard do Módulo 8, que consumirá os indicadores conforme os contratos e permissões do Módulo 2.
- Criar as issues locais ou implementar código nesta etapa. A divisão será proposta para revisão antes de gravar issues separadas de frontend e backend.

## Referências

- [Decisões aprovadas do Módulo 2](../modulos-restantes/map.md#atividades-e-sprints) e [escopo das issues](../modulos-restantes/map.md#escopo-das-issues).
- [Glossário do domínio](../../CONTEXT.md#atividades-e-sprints), [requisitos RF06–RF12](../../docs/projeto/modulos/atividades-e-sprints.md) e [base de modelagem vigente](../../docs/projeto/modelagem.md#base-das-especificações-dos-módulos).
- [Atividades e Sprints no Figma](https://www.figma.com/design/NhEuGEDcNqW2NNMnP614YV/PROCOBAJA-ERP-%C2%B7-UI-Kit---Design-System?node-id=124-426).

## Comments
