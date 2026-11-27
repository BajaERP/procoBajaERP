# Gestão Financeira

O Módulo 03 está planejado para atender RF13 a RF18 e aplicar RF32 aos dados de compras e caixa. A navegação atual oferece telas provisórias. [Matriz acadêmica, seção 4.1.3](../documento-de-projeto.pdf#page=22) · [Guia de modelagem](../modelagem.md)

## Solicitações, Revisões e aprovação

- Qualquer Integrante ativo com Subsistema pode abrir uma Solicitação de compra para o próprio Subsistema. Capitão e Gestor também abrem Solicitações gerais ou para vários Subsistemas. Compras compartilhadas têm o valor integral atribuído aos Subsistemas envolvidos.
- A Solicitação começa Planejada. Para enviar a Revisão, são necessários ao menos três Orçamentos de Fornecedores distintos para os mesmos itens e quantidades. A primeira entrega usa BRL e inclui o frete no total. O ERP preserva a Revisão enviada com seus itens, Orçamentos e decisões.
- Capitão e Gestor Financeiro aprovam a mesma Revisão e o mesmo Orçamento. Escolhas divergentes mantêm a Solicitação Aguardando aprovação. A ausência de Gestor Financeiro aparece como pendência. Durante a análise, a decisão cabe ao titular atual de cada responsabilidade. Compras já aprovadas conservam a aprovação.
- O Solicitante pode retirar uma Revisão da análise para preparar outra. A Reprovação exige justificativa e encerra a análise da Revisão. O reenvio inicia nova rodada e preserva as decisões anteriores.
- O Solicitante pode cancelar a própria Solicitação em Planejada, Aguardando aprovação ou Reprovada. Entre aprovação e Pagamento, a ação fica com Capitão ou Gestor Financeiro. Todo cancelamento registra motivo.

## Pagamento, correção e Reembolso

- Capitão ou Gestor Financeiro registra um Pagamento integral com data, valor efetivo e referência. Um total acima do aprovado, incluindo frete, ou uma troca de Fornecedor exige nova Revisão e aprovação. O desconto do mesmo Fornecedor para os mesmos itens e quantidades pode ser registrado com observação.
- O Pagamento muda a Compra para Realizada/Paga e gera uma única Saída ativa, na mesma transação que realiza a Previsão vinculada quando houver. O banco protege a unicidade da Saída ativa de Pagamento por Compra.
- Para corrigir um Pagamento lançado por engano, Capitão ou Gestor Financeiro cancela a Saída com motivo, autor e data, devolve a Compra para Aprovada e ajusta a Previsão vinculada. A Saída cancelada permanece no histórico.
- Um Reembolso real gera uma Entrada vinculada à Compra e preserva a Saída original. A soma dos Reembolsos fica limitada ao valor efetivamente pago.
- Comprovantes e notas fiscais podem ser vinculados após o Pagamento. A consulta a cada arquivo segue a autorização da biblioteca. [Documentação](documentacao.md)

## Caixa, Previsões e relatórios

- Capitão e Gestor Financeiro registram Entradas, Saídas e Previsões avulsas com Categoria compatível, data, valor e descrição. Cancelar uma Movimentação exige justificativa e preserva o registro com autor e data.
- Compra aprovada com data prevista de Pagamento gera Previsão vinculada. O Pagamento realiza a Previsão e registra a Saída correspondente. Cancelar a Compra aprovada antes de pagar cancela a Previsão. A Previsão de caixa usa as Previsões pendentes.
- Nos gastos por período e Subsistema, uma Compra compartilhada aparece pelo valor integral em cada Subsistema e é contada uma vez no total da equipe. [Dashboard e Indicadores](dashboard-e-indicadores.md)

## Permissões

| Perfil ou contexto | Acesso planejado |
|---|---|
| Capitão e Gestor Financeiro | Consultam valores restritos, decidem sobre Revisões, cancelam Compras aprovadas ainda sem Pagamento e operam Pagamentos, caixa e Previsões. |
| Gestor | Abre Solicitações gerais ou de vários Subsistemas e acompanha as informações administrativas autorizadas. A consulta de valores nas próprias Solicitações segue a regra do Solicitante. |
| Líder e Membro | Abrem e acompanham Solicitações no escopo autorizado do próprio Subsistema. |
| Orientador | Consulta informações gerais não financeiras disponibilizadas ao Perfil. |
| Solicitante | Consulta preços e Orçamentos da própria Solicitação durante o processo, inclusive em Reprovada quando puder corrigir e reenviar. Após Pagamento ou cancelamento, consulta itens, situação e o histórico permitido. |

O servidor aplica o escopo em consultas, relatórios e comandos, inclusive links, anexos e justificativas que revelem valores. A responsabilidade financeira acompanha o Gestor ativo do Subsistema Financeiro. [ADR do Gestor Financeiro](../../adr/0002-gestor-financeiro-derivado-do-subsistema.md)

## Referências

- [Caso de uso](../../diagramas/Diagramas%20de%20Caso%20de%20Uso/Casos_de_Uso-03%20-%20Financeiro.drawio.png) · [Diagrama de Compras e Aprovações](../../diagramas/Diagramas%20de%20Classe/03A%20Financeiro%20%E2%80%94%20Compras%20e%20Aprova%C3%A7%C3%B5es.drawio.png) · [Diagrama de Pagamentos e Previsões](../../diagramas/Diagramas%20de%20Classe/03B%20Financeiro%20%E2%80%94%20Pagamentos%20e%20Previs%C3%B5es.drawio.png) · [Modelo relacional acadêmico](../../diagramas/Diagramas%20de%20Banco%20de%20Dados/01_Figuras_Principais/Figura_28_Financeiro_Solicitacoes_e_Revisoes.png)
- [Requisitos funcionais](../requisitos/funcionais.md) · [Gestão Financeira no Figma](https://www.figma.com/design/NhEuGEDcNqW2NNMnP614YV/PROCOBAJA-ERP-%C2%B7-UI-Kit---Design-System?node-id=127-426)

## Cenários para validar

- Enviar uma Revisão incompleta e depois uma com três Orçamentos de Fornecedores distintos. Exercitar a divergência de Orçamento, a troca de titulares durante a análise e a aprovação conjunta.
- Reprovar, corrigir e reenviar, preservando o histórico. Conferir o escopo do Solicitante antes e depois do encerramento, inclusive nos vínculos, anexos e justificativas.
- Registrar um Pagamento concorrente ou repetido e confirmar uma única Saída ativa. Exercitar correção de lançamento, novo Pagamento, Reembolso parcial e limite do total reembolsado.
- Conferir o ciclo da Previsão no Pagamento, na correção e no cancelamento e verificar o total da equipe com uma Compra compartilhada.
