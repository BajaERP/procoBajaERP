# Módulo 3 · Gestão Financeira

Status: ready-for-agent

## Problema

A equipe precisa comparar Orçamentos, aprovar Solicitações de compra e acompanhar o caixa sem perder o histórico de decisões ou expor valores a quem não tem acesso. O ERP tem uma entrada de Gestão Financeira, mas ainda exibe uma tela provisória. Um Solicitante precisa entender o que falta para a compra avançar, enquanto Capitão e Gestor Financeiro precisam distinguir valores planejados de valores efetivamente pagos.

## Solução

Reunir Solicitações de compra, Compras e aprovações, Movimentações e Previsão de caixa no módulo de Gestão Financeira. O ERP preserva as Revisões enviadas e exige aprovação conjunta sobre o mesmo Orçamento. O Pagamento gera uma única Saída ativa; a Previsão vinculada deixa de compor os valores pendentes quando for realizada. O servidor aplica permissões por Perfil, escopo, autoria e estado da Solicitação.

## Histórias de usuário

1. Como Integrante ativo, quero abrir uma Solicitação de compra para o meu Subsistema para registrar o que precisamos adquirir.
2. Como Capitão ou Gestor, quero abrir Solicitações gerais ou para vários Subsistemas para atender necessidades compartilhadas.
3. Como Solicitante, quero planejar uma Solicitação antes de reunir todos os Orçamentos para retomar o trabalho depois.
4. Como Solicitante, quero indicar itens, quantidades, Fornecedores, links e valores para permitir a comparação.
5. Como Solicitante, quero saber quais itens faltam em um Orçamento e quantos Fornecedores distintos já registrei para enviar uma Revisão completa.
6. Como Solicitante, quero enviar uma Revisão que possa ser consultada depois com os mesmos dados que os aprovadores receberam.
7. Como Solicitante, quero retirar da análise uma Revisão que precisa de ajuste e preparar outra, preservando o histórico.
8. Como Solicitante, quero consultar o motivo de uma Reprovação para corrigir a Solicitação e reenviá-la.
9. Como Solicitante, quero cancelar uma Solicitação própria nas situações permitidas e registrar o motivo.
10. Como Solicitante, quero consultar preços e Orçamentos das minhas Solicitações abertas, inclusive após uma Reprovação que permita correção.
11. Como Solicitante, quero acompanhar itens, situação e histórico permitido de uma Solicitação encerrada.
12. Como Gestor sem responsabilidade financeira, quero consultar os dados administrativos autorizados para acompanhar o andamento das Solicitações.
13. Como Orientador, quero consultar informações gerais não financeiras disponibilizadas ao meu Perfil.
14. Como Capitão ou Gestor Financeiro, quero comparar Orçamentos da mesma Revisão com os totais em BRL, incluindo frete.
15. Como Capitão ou Gestor Financeiro, quero aprovar um Orçamento específico da Revisão enviada para identificar a opção autorizada.
16. Como aprovador, quero ver quando escolhemos Orçamentos diferentes para saber que a aprovação conjunta continua pendente.
17. Como aprovador, quero reprovar com justificativa para que o Solicitante possa corrigir o que falta.
18. Como Solicitante, quero saber quando falta um Gestor Financeiro para que eu possa entender a pendência.
19. Como novo Capitão ou Gestor Financeiro, quero decidir sobre as Revisões ainda pendentes e conservar o histórico das decisões anteriores.
20. Como Capitão ou Gestor Financeiro, quero que Compras já aprovadas mantenham a aprovação após uma troca de titular.
21. Como Capitão ou Gestor Financeiro, quero cancelar com motivo uma Compra aprovada que ainda não foi paga.
22. Como Capitão ou Gestor Financeiro, quero que um aumento do total ou uma troca de Fornecedor exija nova Revisão para que as condições novas sejam aprovadas.
23. Como Capitão ou Gestor Financeiro, quero registrar um desconto do mesmo Fornecedor para os mesmos itens e quantidades e explicar a diferença.
24. Como Capitão ou Gestor Financeiro, quero registrar o Pagamento integral com data, valor e referência e consultar a Saída correspondente.
25. Como Capitão ou Gestor Financeiro, quero corrigir uma Saída indevida sem perder o histórico e poder registrar o Pagamento correto.
26. Como Capitão ou Gestor Financeiro, quero registrar Reembolsos totais ou parciais vinculados à Compra e consultar tanto a Saída original quanto as devoluções.
27. Como Capitão ou Gestor Financeiro, quero vincular posteriormente comprovante ou nota fiscal autorizados, mesmo depois de pagar.
28. Como Capitão ou Gestor Financeiro, quero registrar Entradas e Saídas avulsas com Categoria, data, valor e descrição.
29. Como Capitão ou Gestor Financeiro, quero cancelar uma Movimentação indevida com justificativa e consultar a autoria e a data.
30. Como Capitão ou Gestor Financeiro, quero registrar e acompanhar Previsões avulsas para planejar Entradas e Saídas futuras.
31. Como Capitão ou Gestor Financeiro, quero que uma Compra aprovada com data prevista componha a Previsão de caixa até o Pagamento ou cancelamento.
32. Como Capitão ou Gestor Financeiro, quero consultar gastos por Subsistema e período para acompanhar como os recursos foram usados.
33. Como Capitão ou Gestor Financeiro, quero que uma Compra compartilhada apareça integralmente em cada Subsistema e seja contada apenas uma vez no total da equipe.
34. Como usuário, quero consultar os fluxos permitidos no desktop e no mobile e entender quando uma operação está carregando, não encontrou dados ou falhou.

## Decisões de implementação

### Permissões e confidencialidade

| Perfil ou contexto | Acesso |
| --- | --- |
| Capitão | Consulta os dados financeiros restritos. Pode abrir Solicitações gerais ou de vários Subsistemas, aprovar ou reprovar, cancelar Compras aprovadas antes do Pagamento e operar Compras, caixa e Previsão. |
| Gestor Financeiro | Exerce as ações financeiras enquanto for o Gestor ativo associado ao Subsistema Financeiro. Mantém o Perfil Gestor e suas demais permissões. |
| Gestor sem responsabilidade financeira | Pode abrir Solicitações gerais ou de vários Subsistemas e consultar os dados administrativos autorizados. A visibilidade de valores das próprias Solicitações segue a exceção do Solicitante. |
| Líder e Membro | Abrem e acompanham Solicitações para o próprio Subsistema conforme o escopo autorizado. Preços e Orçamentos seguem a exceção do Solicitante. |
| Orientador | Consulta informações gerais não financeiras disponibilizadas ao Perfil. |
| Solicitante | Pode consultar preços e Orçamentos das próprias Solicitações em andamento, inclusive Reprovadas que possam ser corrigidas e reenviadas. Depois do Pagamento ou cancelamento, continua consultando itens, situação e histórico permitido. Capitão e Gestor Financeiro mantêm o acesso em virtude de suas permissões financeiras. |

- O servidor aplica esse escopo em listagens, filtros, detalhes, histórico, relatórios, indicadores e comandos. Uma resposta que omite preços também filtra links, anexos e justificativas cujo conteúdo revele valores restritos. Vínculos com Eventos, Subsistemas e Documentação preservam as permissões de origem.
- As ações e consultas usam a sessão de Equipe e Subsistemas. O servidor verifica o titular atual de cada responsabilidade financeira ou de aprovação no momento da operação. A interface usa as capacidades devolvidas pela API.

### Solicitação, Revisão e aprovação

- Qualquer Integrante ativo com Subsistema pode abrir uma Solicitação para o próprio Subsistema. Solicitações gerais da equipe ou de vários Subsistemas ficam com Capitão e Gestor. O escopo define a atribuição do valor, sem rateio.
- A Solicitação começa Planejada. Para enviar a Revisão, exigir pelo menos três Orçamentos de Fornecedores distintos, cada um cobrindo os mesmos itens e quantidades. A primeira entrega usa BRL. O total do Orçamento inclui frete.
- Uma Revisão enviada preserva título, descrição, escopo, vínculos, itens e Orçamentos. Retirar da análise permite preparar nova Revisão. Reprovar encerra a análise da Revisão imediatamente e exige justificativa. Correção e reenvio iniciam nova rodada, preservando Revisões e decisões anteriores.
- Capitão e Gestor Financeiro precisam aprovar a mesma Revisão e o mesmo Orçamento. Se aprovarem opções diferentes, a Solicitação continua Aguardando aprovação até que as decisões vigentes coincidam. Preservar as decisões anteriores. Na ausência de Gestor Financeiro, manter a Solicitação aguardando e informar a pendência.
- Se o Capitão ou o Gestor Financeiro mudar durante a análise, a aprovação pendente precisa da decisão do titular atual. Compras aprovadas conservam a aprovação já concluída.
- O Solicitante pode cancelar a própria Solicitação em Planejada, Aguardando aprovação ou Reprovada. Após a aprovação e antes do Pagamento, a ação fica com Capitão ou Gestor Financeiro. Todo cancelamento exige motivo e fica no histórico.

### Pagamento, correção e Reembolso

- Capitão ou Gestor Financeiro registra o Pagamento integral com data, valor efetivo em BRL e referência. A Compra usa o Orçamento aprovado. Se o total a pagar com frete superar o aprovado ou se o Fornecedor mudar, exigir nova Revisão e aprovação. Um desconto do mesmo Fornecedor para os mesmos itens e quantidades pode ser registrado com observação.
- Registrar o Pagamento, atualizar a Compra para Realizada/Paga e gerar exatamente uma Saída ativa vinculada em uma única transação. Quando houver Previsão vinculada, realizá-la e apontá-la para essa Saída na mesma operação. Repetições ou operações concorrentes não podem gerar outra Saída ativa.
- Para corrigir Pagamento lançado por engano, Capitão ou Gestor Financeiro cancela a Saída com motivo, autor e data e devolve a Compra para Aprovada. A Saída cancelada permanece consultável no histórico. Manter a Previsão vinculada consistente com o novo estado da Compra, sem contabilizar a Saída cancelada como pagamento efetivo.
- Quando o dinheiro foi pago e devolvido, o Reembolso total ou parcial entra como Entrada vinculada à Compra e conserva a Saída original. A soma dos Reembolsos não pode exceder o valor efetivamente pago.
- Comprovantes e notas fiscais podem ser vinculados depois do Pagamento. A consulta ao arquivo usa as permissões de Documentação. O vínculo é opcional e sua integração não bloqueia o registro do Pagamento.

### Caixa, Previsões e relatórios

- Capitão e Gestor Financeiro podem registrar Entradas, Saídas e Previsões avulsas, com Categoria compatível com o tipo, data, valor e descrição. Para uma Compra vinculada, a Saída nasce do Pagamento. Movimentações canceladas ficam no histórico com autor, data e justificativa e deixam de compor os valores ativos.
- Uma Compra aprovada com data prevista de Pagamento gera Previsão financeira vinculada, do tipo Saída. O Pagamento realiza a Previsão e a vincula à Movimentação efetiva. O cancelamento da Compra antes do Pagamento cancela a Previsão. A Previsão de caixa considera apenas Previsões pendentes para evitar contar de novo o que já entrou ou saiu.
- Oferecer saldo, Previsão de caixa, histórico de Solicitações e Compras e gastos por Subsistema e período, com o escopo autorizado. Em cada Subsistema de uma Compra compartilhada, mostrar o valor integral e indicar que a Compra é compartilhada. No total geral da equipe, contar o valor uma única vez.

### Contrato compartilhado

- Frontend e backend acordam consultas, filtros, campos, capacidades, comandos, erros e representação exata de valores em BRL antes de implementar suas respectivas entregas. O contrato distingue situação da Solicitação, Revisão, decisões, Pagamento, Movimentação e Previsão. Respostas distinguem falhas de validação, falta de autorização e conflito de estado.
- O frontend mantém uma entrada para Gestão Financeira na sidebar, com navegação interna para os fluxos do módulo. Usa o design system e os fluxos de desktop e mobile do Figma. A matriz desta especificação orienta quais ações e dados podem aparecer.
- O frontend pode avançar com mocks isolados em desenvolvimento, no mesmo contrato das APIs. A integração real fica na última entrega do frontend, depende das APIs correspondentes e usa a sessão e o padrão HTTP e CSRF do ERP.
- O backend usa o DBML v6 e o esquema Flyway V1–V11 da develop para consultar, gravar e preservar histórico. As regras de aprovação, permissões e consistência entre Compra, Pagamento e Previsão são aplicadas no serviço com as estruturas existentes.

## Decisões de verificação

- Verificar o backend pela API autenticada com PostgreSQL e Flyway, seguindo os testes de integração do Módulo 1. Usar perfis distintos e pelo menos dois Subsistemas. Conferir a autorização em respostas completas, filtros, histórico e comandos, incluindo acesso do Solicitante antes e depois do encerramento. Testar que links, anexos, justificativas e agregações não revelem valores restritos.
- Exercitar Revisão incompleta, três Orçamentos comparáveis, retirada, Reprovação, reenvio e cancelamento em cada estado autorizado. Cobrir escolhas diferentes, aprovação conjunta, ausência de Gestor Financeiro, mudança de cada titular com Revisão pendente e preservação de Compra já aprovada.
- Exercitar Pagamento igual ao aprovado, desconto permitido, total maior com frete, troca de Fornecedor, repetição de Pagamento e concorrência. Conferir o estado persistido e a Saída ativa após cada caso. Cobrir correção por cancelamento, novo Pagamento, Reembolso parcial e soma de Reembolsos acima do efetivamente pago.
- Verificar a Previsão vinculada ao aprovar com data prevista, pagar e cancelar a Compra, além das Previsões avulsas. Conferir Categoria compatível, cancelamento rastreável e total geral que não duplica Compras compartilhadas.
- No frontend, verificar os resultados que o usuário vê pelo contrato dos adaptadores, como formulários, ações por Perfil, histórico, campos filtrados e estados de carregamento, vazio, falha e nova tentativa. Conferir desktop, mobile, teclado e temas claro e escuro.
- Na integração real, percorrer Solicitante → Revisão → duas decisões → Pagamento → Saída e Previsão. Usar contas distintas, validar a visibilidade após o Pagamento e confirmar que uma ação negada no servidor permanece negada mesmo quando solicitada diretamente.

## Fora de escopo

- Mudanças de esquema ou migrações, incluindo tabelas, colunas, índices e restrições. O limite vale para as issues funcionais de todos os módulos.
- Parcelamento, conversão de moedas e execução do pagamento por integração bancária. O ERP registra o Pagamento integral.
- Implementar o módulo de Documentação, a Logística de Eventos ou o Dashboard nesta entrega. Os vínculos usam os contratos desses módulos conforme cada integração ficar disponível.
- Gravar issues de implementação ou implementar código nesta etapa. A divisão de frontend e backend será proposta para revisão.

## Referências

- [Decisões aprovadas de Gestão Financeira](../modulos-restantes/map.md#gestão-financeira) e [regra de escopo das issues](../modulos-restantes/map.md#escopo-das-issues).
- [Glossário](../../CONTEXT.md#financeiro), [requisitos do módulo](../../docs/projeto/modulos/gestao-financeira.md) e [base de modelagem vigente](../../docs/projeto/modelagem.md#base-das-especificações-dos-módulos).
- [ADR 0002 · Gestor Financeiro derivado do Subsistema](../../docs/adr/0002-gestor-financeiro-derivado-do-subsistema.md) e [Gestão Financeira no Figma](https://www.figma.com/design/NhEuGEDcNqW2NNMnP614YV/PROCOBAJA-ERP-%C2%B7-UI-Kit---Design-System?node-id=127-426).

## Comments
