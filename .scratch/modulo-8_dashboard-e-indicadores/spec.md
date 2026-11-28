# Módulo 8 · Dashboard e Indicadores

Status: ready-for-agent

## Problema

Ao entrar no ERP, a equipe precisa identificar o trabalho da Sprint, as pendências que pode resolver e os próximos compromissos. Hoje a rota do Dashboard exibe uma tela provisória. Informações de Atividades, Pessoas, Eventos, Governança e Financeiro têm períodos e permissões próprios, e a indisponibilidade de uma fonte precisa ser visível sem interromper a consulta às demais.

## Solução

Entregar um painel que mantém os períodos e as permissões de cada cartão. A primeira entrega cobre Sprint atual, Atividades atribuídas e atrasadas, Frequência, Carga horária validada, próximos Eventos e Aceites pendentes. Capitão e Gestor Financeiro também consultam saldo e Previsão de caixa. Um alerta destaca a ação de maior prioridade que o Usuário pode realizar.

Frontend e backend avançam após o contrato compartilhado. O frontend usa mocks em desenvolvimento. Cada cartão é integrado à fonte real e validado de forma independente.

## Histórias de usuário

1. Como Usuário autenticado, quero abrir o Dashboard ao entrar no ERP para consultar os indicadores autorizados para meu Perfil.
2. Como Capitão ou Gestor, quero visualizar o panorama operacional da equipe para acompanhar os Subsistemas.
3. Como Líder, quero começar a consulta pelo meu Subsistema para encontrar suas Atividades e indicadores.
4. Como Membro, quero começar pelos meus dados para identificar minhas Atividades, Frequência e horas validadas.
5. Como Orientador, quero consultar totais da equipe ou de Subsistemas ativos para acompanhar o projeto com dados agregados.
6. Como Usuário autorizado, quero consultar a Sprint atual para entender o andamento do trabalho.
7. Como Usuário autorizado, quero ver Atividades atribuídas e atrasadas da Sprint selecionada para saber o que requer atenção.
8. Como Usuário autorizado, quero selecionar outra Sprint e saber qual está selecionada para comparar com o contexto atual.
9. Como Usuário autorizado, quero identificar quando não há Sprint atual ou dados no recorte escolhido para interpretar o cartão.
10. Como Usuário autorizado, quero ver a Frequência do mês atual e consultar outro mês para acompanhar os registros validados.
11. Como Usuário autorizado, quero ver as horas validadas do mês escolhido para acompanhar a Carga horária no meu escopo.
12. Como Usuário, quero distinguir uma Frequência de zero de um período sem registros elegíveis para interpretar o indicador corretamente.
13. Como Usuário, quero consultar os Eventos autorizados dos próximos 30 dias para planejar a agenda.
14. Como Orientador, quero consultar as Competições dos próximos 30 dias para acompanhar o calendário autorizado.
15. Como Usuário, quero consultar meus Aceites pendentes e abrir a Versão correspondente para registrar a confirmação.
16. Como Usuário com Aceite pendente, quero continuar usando o ERP enquanto decido quando registrar o Aceite.
17. Como Capitão ou Gestor Financeiro, quero consultar o saldo efetivo atual para acompanhar os recursos disponíveis.
18. Como Capitão ou Gestor Financeiro, quero consultar a Previsão de caixa atual separadamente do saldo para entender os valores previstos.
19. Como Gestor Financeiro, quero conservar a visão operacional de Gestor junto dos indicadores financeiros autorizados.
20. Como Usuário sem permissão financeira, quero consultar os cartões operacionais autorizados sem receber valores financeiros protegidos.
21. Como Usuário com uma pendência que posso resolver, quero ver um alerta em destaque e seguir seu atalho até a ação autorizada.
22. Como Usuário com várias pendências, quero ver os demais avisos nos cartões correspondentes para acompanhar o que ainda está em aberto.
23. Como Usuário, quero entender o período de cada cartão e mudar o mês ou a Sprint sem alterar os demais cartões.
24. Como Usuário, quero distinguir carregamento, zero, ausência de dados e indisponibilidade para interpretar cada cartão.
25. Como Usuário, quero continuar vendo os cartões disponíveis quando uma fonte falhar e poder tentar novamente no cartão afetado.
26. Como Usuário, quero abrir o contexto autorizado de uma Sprint, Atividade, Evento, indicador ou Aceite no módulo responsável para consultar o detalhe.
27. Como Usuário, quero acessar os cartões já integrados à medida que suas fontes ficam prontas.
28. Como Usuário, quero consultar o Dashboard em desktop ou mobile, com navegação por teclado, foco visível e temas claro e escuro.

## Decisões de implementação

### Cartões e períodos

| Cartão | Período | Comportamento |
| --- | --- | --- |
| Sprint e Atividades | Sprint atual por padrão. Seleção de outra Sprint autorizada. | Mostrar andamento, Atividades atribuídas e atrasadas conforme a fonte. Usar o resultado histórico para Sprints encerradas e informar quando não há Sprint atual. |
| Frequência e horas validadas | Mês atual por padrão. Seleção de outro mês. | Usar Frequência e Carga horária do Módulo 4 com Validação vigente. Aplicar o escopo autorizado ao período selecionado. |
| Agenda | Próximos 30 dias. | Mostrar Eventos futuros autorizados. As Competições são o recorte do Orientador. |
| Aceites pendentes | Situação atual. | Mostrar somente as pendências pessoais do Usuário autenticado, inclusive as de Vigência futura quando a fonte as indicar. Oferecer atalho à Versão. |
| Saldo e Previsão de caixa | Situação atual. | Exibir separadamente saldo efetivo e Previsão de caixa para Capitão e Gestor Financeiro. |

- Exibir o período em cada cartão. Selecionar a Sprint ou o mês modifica apenas os cartões que usam aquele recorte. Aceites, saldo, Previsão de caixa e agenda mantêm seus próprios critérios de data.
- Reusar as definições dos módulos de origem. Em Pessoas e Participação, a Frequência usa Presente e Ausente validadas. Presente sem horários pode contar para a Frequência, e a Carga horária exige horários e Validação vigente. No Financeiro, a fonte separa saldo efetivo de Previsões pendentes.

### Permissões e alertas

- O servidor aplica as permissões de origem a indicadores, listas, contagens, escopos selecionáveis e atalhos. Capitão e Gestor consultam a visão operacional da equipe. Líder começa pelo próprio Subsistema. Membro começa pelos próprios dados. Orientador consulta agregados da equipe ou de Subsistemas ativos e vê apenas Competições na Agenda. Gestor Financeiro conserva o escopo operacional de Gestor e recebe o cartão financeiro pela atribuição vigente.
- Reusar as capacidades da sessão do Módulo 1. Oferecer escopos e atalhos autorizados e aplicar a mesma autorização à consulta real e à abertura direta. A consulta pessoal de Aceites corresponde à identidade da sessão, inclusive para Capitão e Gestor.
- Exibir um único alerta em destaque quando houver uma ação que o Usuário possa realizar. A ordem é Atividade atrasada, pouco progresso na Sprint e Aceite pendente. Usar as indicações autorizadas de Atividades e Sprints e as pendências pessoais de Governança. Os avisos permanecem nos cartões correspondentes enquanto a pendência existir. O atalho leva à ação autorizada no módulo de origem.
- Usar somente dados autorizados e atuais das fontes disponíveis para escolher o destaque. Na ausência de candidato que a pessoa possa resolver, omitir o destaque. Uma falha de consulta em um cartão deixa os candidatos válidos das outras fontes disponíveis.

### Estados e integração

- Cada cartão trata carregamento, resultado, ausência de dados e falha. Mostrar zero quando houver dados elegíveis e o resultado for zero. Mostrar “Sem dados no período” na ausência de registros elegíveis e “Sem dados para calcular” no caso específico de Frequência. Se uma fonte falhar, mostrar “Indisponível no momento” e oferecer nova tentativa somente no cartão afetado. Cartões fora do escopo do Usuário ficam ocultos.
- Antes de separar o trabalho, acordar os contratos de consulta, períodos, identificadores de abertura, capacidades, estados e erros por cartão. Reusar as interfaces autorizadas das fontes e compor a apresentação com consultas independentes. Os cálculos e critérios de elegibilidade continuam nos módulos responsáveis pelos dados.
- Reusar a rota inicial do ERP, a sessão real, os componentes do design system e as visões por Perfil do Figma. Aplicar os períodos por cartão aprovados no planejamento. Manter os mocks isolados em desenvolvimento e integrar cada cartão à consulta real quando sua dependência estiver disponível. A entrega integrada de um cartão independe das outras fontes.
- Usar o esquema existente no DBML v6 e nas migrações Flyway V1–V11. O Dashboard consulta os dados de origem.

## Decisões de verificação

- No frontend, verificar o Dashboard pela interface com respostas simuladas no contrato de cada cartão. Cobrir escopo e período inicial, troca independente de Sprint ou mês, destaque e atalhos, zero, vazio, falha parcial e nova tentativa. Verificar desktop, mobile a partir de 320 px, temas claro e escuro, teclado e foco.
- Na API autenticada, seguir os testes de integração de Equipe e Subsistemas. Verificar escopos por Perfil e Subsistema, inclusive agregados do Orientador, Aceites de outro Usuário, autorização financeira e acesso direto. Usar datas controladas para os limites de Sprint, mês e Agenda.
- Integrar e verificar os cartões com a fonte real conforme cada uma ficar disponível. Conferir que a Validação e a correção de presença alteram os indicadores conforme a fonte, que a Agenda do Orientador contém apenas Competições e que Aceites concluídos deixam de ser pendentes. Conferir que saldo e Previsão são apresentados separadamente.
- Testar a ordem dos alertas com três tipos concorrendo pelo destaque e a ausência de destaque para itens sem ação autorizada. Reproduzir a falha de uma fonte, manter os cartões saudáveis disponíveis e verificar que a tentativa recupera somente o cartão afetado.

## Fora de escopo

- Indicadores de compras, reuniões recentes e Documentação na primeira entrega.
- Dispensa manual de alertas.
- Alterações de tabelas, colunas, índices, restrições ou migrações nas issues funcionais.

## Referências e dependências

| Cartão | Entrega que fornece os dados reais |
| --- | --- |
| Sprint, Atividades e alertas | [Módulo 2 · issue 04 — Planejamento e Alocação](../modulo-2_atividades-e-sprints/issues/04-backend-planejamento-alocacao.md) e [issue 06 — Alertas e indicações](../modulo-2_atividades-e-sprints/issues/06-backend-alertas-indicacoes.md). |
| Frequência e horas validadas | [Módulo 4 · issue 03 — Validação e indicadores](../modulo-4_pessoas-e-participacao/issues/03-backend-validacao-indicadores.md). |
| Agenda | [Módulo 6 · issue 02 — Agenda e cadastro](../modulo-6_competicoes-e-eventos/issues/02-backend-agenda-cadastro.md). |
| Aceites pendentes | [Módulo 7 · issue 06 — Ciência, Aceite e pendências pessoais](../modulo-7_governanca/issues/06-backend-ciencia-aceite-pendencias.md). |
| Saldo e Previsão de caixa | [Módulo 3 · issue 07 — Saldo, Previsão e relatórios](../modulo-3_gestao-financeira/issues/07-backend-saldo-previsao-relatorios.md). |

- [Decisões do Dashboard](../modulos-restantes/map.md#dashboard-e-indicadores), [guia do módulo](../../docs/projeto/modulos/dashboard-e-indicadores.md), [glossário](../../CONTEXT.md) e [requisitos RF30–RF32](../../docs/projeto/requisitos/funcionais.md).
- [Figma do Dashboard](https://www.figma.com/design/NhEuGEDcNqW2NNMnP614YV/PROCOBAJA-ERP-%C2%B7-UI-Kit---Design-System?node-id=138-426), [sessão no servidor](../../docs/adr/0001-sessao-no-servidor.md) e [Gestor Financeiro](../../docs/adr/0002-gestor-financeiro-derivado-do-subsistema.md).

## Comments
