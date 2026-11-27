# Atividades e Sprints

O Módulo 02 está planejado para atender RF06 a RF12. A navegação atual oferece telas provisórias. O esquema Flyway inclui a base de Sprints, Alocações e históricos. [Matriz acadêmica, seção 4.1.2](../documento-de-projeto.pdf#page=21) · [Guia de modelagem](../modelagem.md)

## Backlog e Quadro

- Toda Atividade pertence a pelo menos um Subsistema. Pode envolver vários Subsistemas e ter vários Responsáveis, inclusive de fora deles. Prazo, Estimativa de esforço e Responsável são opcionais no Backlog. A Alocação exige prazo, estimativa em 1, 2, 3, 5, 8, 13 ou 21 e ao menos um Responsável ativo. A perda do último Responsável ativo sinaliza necessidade de reatribuição.
- Uma Atividade pode ter uma única Alocação vigente. Ela sai do Backlog ao ser alocada, inclusive em Sprint planejada, e volta quando é retirada sem outra Alocação. O arquivamento exige motivo, autor e data e preserva a Atividade no histórico.
- O Quadro usa o estado atual do trabalho, com os estados Não iniciada, Em andamento, Pausada e Concluída. Iniciar ou retomar leva a Em andamento. Reabrir uma Atividade concluída exige motivo e também volta a Em andamento. Mudanças registram autor e data. Não concluída identifica o resultado histórico de uma pendência no encerramento da Sprint.

## Ciclo da Sprint

- A Sprint tem datas planejadas e datas efetivas. A duração sugerida é de 15 dias e pode ser ajustada. A equipe pode planejar Sprints futuras e ter uma única Sprint em andamento. Início e fechamento exigem confirmação. A data final sinaliza que o prazo chegou.
- Capitão e Gestor podem incluir ou retirar Atividades durante a Sprint. A retirada registra motivo, autor e destino, que pode ser o Backlog ou outra Sprint planejada.
- No fechamento, Capitão ou Gestor decide o destino de cada pendência, entre Backlog e Sprint futura planejada. O servidor salva o resultado de cada Alocação e movimenta as Atividades em uma única transação. Um destino inválido mantém o fechamento pendente e as Alocações intactas.
- A transferência preserva origem, passagens, estado de trabalho e prazo. Ajustes de prazo são explícitos e ficam no histórico.

## Indicadores

- A partir do primeiro dia da segunda metade da Sprint, Atividades Não iniciadas ou Pausadas recebem o alerta de pouco progresso. O dia central conta na segunda metade quando a Sprint tem duração ímpar. Em uma Sprint de 1 a 15, o alerta começa no dia 8.
- Atividades Em andamento ficam atrasadas a partir do dia seguinte ao prazo. As decisões por data usam o fuso `America/Sao_Paulo`. Transferência entre Sprints e falta de Responsável ativo têm indicações próprias. [Dashboard e Indicadores](dashboard-e-indicadores.md)

## Permissões

| Perfil | Acesso planejado |
|---|---|
| Capitão e Gestor | Consultam e administram as Atividades e Sprints da equipe, inclusive planejamento compartilhado, Alocação, retirada e encerramento. Gestor Financeiro mantém essas permissões. |
| Líder | Consulta outros Subsistemas e atualiza o andamento das Atividades que envolvem o seu. Cria, planeja e reabre Atividades exclusivas do próprio Subsistema e pode arquivá-las no Backlog. |
| Membro | Consulta Atividades do próprio Subsistema e as atribuídas a ele. Atualiza o andamento daquelas pelas quais é Responsável. |
| Orientador | Consulta o andamento dos Subsistemas ativos. |

O servidor aplica o escopo à listagem, filtros, detalhes, histórico, indicadores e comandos. Mudanças de planejamento de Atividades compartilhadas são exclusivas de Capitão e Gestor.

## Referências

- [Caso de uso](../../diagramas/Diagramas%20de%20Caso%20de%20Uso/Casos_de_Uso-02%20-%20Atividades%20e%20Sprints.drawio.png) · [Diagrama de classes](../../diagramas/Diagramas%20de%20Classe/02%20Atividades%20e%20Sprints.drawio.png) · [Modelo relacional acadêmico](../../diagramas/Diagramas%20de%20Banco%20de%20Dados/01_Figuras_Principais/Figura_27_Atividades_e_Sprints.png)
- [Requisitos funcionais](../requisitos/funcionais.md) · [Atividades e Sprints no Figma](https://www.figma.com/design/NhEuGEDcNqW2NNMnP614YV/PROCOBAJA-ERP-%C2%B7-UI-Kit---Design-System?node-id=124-426)

## Cenários para validar

- Alocar uma Atividade em Sprint futura, testar campos faltantes e conferir a retirada do Backlog ao confirmar a Alocação.
- Atualizar o andamento de uma Atividade compartilhada com Líder e Membro responsável, conferindo os limites de edição do planejamento pelo acesso direto à API.
- Retirar uma Atividade ou encerrar com pendências e destinos diferentes. Verificar que um destino inválido impede todas as mudanças e que o histórico sobrevive à reabertura e à transferência.
- Testar os limites de data dos alertas, incluindo a metade da Sprint, o dia seguinte ao prazo e a mudança de dia em Brasília.
