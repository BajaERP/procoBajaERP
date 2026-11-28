# Módulo 4 · Pessoas e Participação

Status: ready-for-agent

## Problema

A equipe precisa registrar presença em turnos, acompanhar Frequência e Carga horária e revisar os relatos de trabalho dos Membros. Hoje a entrada do módulo leva a uma tela provisória. Chamadas precisam acomodar exceções individuais e transferências de Subsistema. Registros administrativos precisam preservar autoria e histórico, com acesso restrito ao conteúdo confidencial.

## Solução

Entregar chamada de turno, Validação, indicadores, Diário de atividades, Observações, Ocorrências e Advertências em Pessoas e Participação. O módulo também mantém as regras de lançamento, Validação e histórico de Participação em Eventos. A conexão com a tela real de Evento pertence ao Módulo 6. A integração principal do Módulo 4 usa as próprias APIs e a base de identidade e Subsistemas já disponível.

## Histórias de usuário

1. Como Líder, quero abrir a chamada de um turno do meu Subsistema para lançar presença de seus Integrantes.
2. Como responsável pela chamada, quero usar o horário sugerido das 18h às 22h ou informar o horário real.
3. Como responsável pela chamada, quero aplicar um horário comum às pessoas que selecionei e conferir quantas serão afetadas.
4. Como responsável pela chamada, quero ajustar horários individuais sem perder essas exceções ao alterar o horário comum.
5. Como responsável pela chamada, quero salvar uma parte revisada e voltar depois para completar os demais lançamentos.
6. Como responsável pela chamada, quero identificar o registro inválido e manter minha seleção para corrigir e reenviar, sem gravação parcial do lote.
7. Como responsável pela chamada, quero marcar um Integrante como Presente sem horário quando só puder confirmar sua presença.
8. Como responsável pela chamada, quero registrar um turno que termina após a meia-noite, informando a data de saída.
9. Como responsável pela chamada, quero receber aviso de sobreposição e poder registrar turnos consecutivos.
10. Como responsável pela chamada, quero informar o motivo da situação Justificada e poder acrescentar um motivo opcional para Ausente.
11. Como Líder atual de um Subsistema, quero completar uma chamada passada com base nos vínculos da data do turno.
12. Como Capitão ou Gestor, quero confirmar com justificativa o Subsistema da época quando o vínculo histórico não puder ser verificado.
13. Como Capitão ou Gestor, quero registrar a presença do Capitão em turno sem associá-lo a um Subsistema.
14. Como Líder atual, quero corrigir um lançamento do meu Subsistema enquanto aguarda Validação.
15. Como Capitão ou Gestor, quero consultar os registros individuais da equipe e validar vários registros pendentes de uma vez.
16. Como Capitão ou Gestor, quero corrigir um registro já validado com justificativa, preservando o valor anterior e a autoria.
17. Como Capitão ou Gestor, quero poder validar minha própria presença ou Participação.
18. Como Integrante, quero consultar meus registros, a Frequência e as horas validadas para acompanhar meus resultados.
19. Como Líder, quero consultar presença em turno do meu Subsistema para acompanhar os registros sob minha responsabilidade.
20. Como Orientador, quero consultar indicadores agregados sem acesso a justificativas ou registros individuais.
21. Como Membro, quero manter um Diário por dia de trabalho, mesmo quando houver mais de um turno ou a presença ainda estiver pendente.
22. Como Membro, quero salvar um rascunho privado e enviar explicitamente o relato para Validação quando estiver pronto.
23. Como Capitão ou Gestor, quero validar o relato enviado, com comentário opcional, ou devolvê-lo com motivo para o Membro corrigir.
24. Como Membro, quero editar e reenviar um Diário devolvido ou reaberto, mantendo as mudanças privadas até o envio.
25. Como Capitão ou Gestor, quero reabrir um Diário validado e consultar a última versão enviada e o histórico durante a revisão.
26. Como Capitão, Gestor ou Líder autorizado, quero publicar uma Observação cotidiana no meu escopo.
27. Como Integrante citado, quero consultar a Observação que me diz respeito.
28. Como autor autorizado, Capitão ou Gestor, quero corrigir uma Observação com motivo e preservar a versão anterior.
29. Como Líder, quero encaminhar uma Ocorrência confidencial de um Integrante do meu Subsistema e receber confirmação do envio.
30. Como Capitão ou Gestor, quero consultar uma Ocorrência e poder encerrá-la sem emitir Advertência, mantendo a decisão no histórico confidencial.
31. Como Capitão ou Gestor, quero emitir uma Advertência motivada, com vínculo opcional a uma Ocorrência.
32. Como Capitão ou Gestor, quero comunicar separadamente uma Advertência para disponibilizar apenas seu texto formal ao Integrante.
33. Como Integrante, quero consultar minha Advertência comunicada e confirmar ciência sem precisar declarar concordância.
34. Como Capitão ou Gestor, quero revogar uma Advertência comunicada com justificativa, preservando o texto original no histórico do Integrante.
35. Como responsável designado, quero preparar a lista de Participações Previstas e lançar o resultado a partir do início do Evento.
36. Como Líder, quero registrar Participação nas Reuniões semanais somente para Integrantes do meu Subsistema, inclusive em Reuniões conjuntas.
37. Como novo responsável de um Evento, quero completar lançamentos pendentes, preservando os registros e a autoria de quem lançou antes.
38. Como Capitão ou Gestor, quero validar situações finais de Participação e consultar o histórico de correções.
39. Como Integrante, quero consultar minha Participação conforme as permissões, inclusive em Eventos cancelados com registros anteriores.
40. Como usuário, quero navegar pelos fluxos do módulo no desktop e no mobile e entender quando a consulta está carregando, vazia ou com falha.

## Decisões de implementação

### Perfis e acesso

| Perfil | Consultas e ações |
| --- | --- |
| Capitão e Gestor | Consultam registros individuais da equipe. Corrigem e validam presença e Participação conforme o estado, inclusive as próprias. Revisam, devolvem ou reabrem Diários enviados. Publicam e corrigem Observações, analisam Ocorrências e emitem, comunicam ou revogam Advertências. |
| Gestor Financeiro | Mantém as permissões de Gestor neste módulo. |
| Líder | Registra e corrige presença em turno do próprio Subsistema antes da Validação. Consulta seus Registros de presença em turno. Publica Observações e encaminha Ocorrências sobre Integrantes desse Subsistema. Registra Participação quando a função ou atribuição no Evento permitir. |
| Membro | Escreve, edita e envia o próprio Diário. Consulta os próprios registros e as Observações e Advertências que lhe forem disponibilizadas. |
| Orientador | Consulta indicadores agregados, sem dados individuais ou justificativas. |

- Cada Integrante pode consultar os próprios Registros de presença e de Participação, dentro das regras de visibilidade. As permissões de publicação, correção e Validação são aplicadas pelo servidor aos comandos e às consultas, inclusive filtros, históricos e indicadores.
- Sessão, Perfis, Integrantes, Subsistemas e vínculos vêm de Equipe e Subsistemas. O Gestor Financeiro continua sendo Gestor. Para as telas, usar capacidades retornadas pela API. Aplicar a especificação quando o Figma representar permissões antigas ou ação administrativa de edição do Diário.

### Chamada de turno, Validação e indicadores

- A chamada sugere 18h às 22h e aceita o horário real. Aplicar um horário comum apenas às pessoas selecionadas, mostrar a quantidade de registros afetados e preservar ajustes individuais quando o horário comum mudar. Pode-se salvar só a parte conferida. Integrantes ainda não conferidos ficam sem lançamento.
- Em cada envio de gravação ou Validação em lote, aplicar os registros selecionados em uma única transação. Um erro deixa todo o lote intacto. A resposta permite identificar o registro que precisa de ajuste dentro do escopo autorizado. O frontend mantém a seleção e os dados para nova tentativa.
- Presente pode ser gravada sem horários. Com horários, informar início e fim e a data de saída para turno que cruza meia-noite. A saída deve ser posterior à entrada. A duração integral pertence à data inicial. Justificada exige motivo e Ausente aceita motivo opcional. Turnos sobrepostos para o mesmo Integrante são rejeitados, e intervalos consecutivos são permitidos.
- Registro retroativo usa o Subsistema na data de início. Depois de uma transferência, o Líder atual do Subsistema de origem, o Capitão ou um Gestor pode completar a chamada. Usar o histórico de Equipe e Subsistemas para determinar o vínculo. Se ele não puder ser comprovado, manter a pendência até Capitão ou Gestor confirmar o Subsistema da época com justificativa. Capitão ou Gestor pode registrar a presença do Capitão sem Subsistema.
- Antes da Validação, Capitão, Gestor e o Líder atual do Subsistema de referência podem corrigir os registros no próprio escopo. A Validação é de Capitão ou Gestor e guarda autor e momento por registro. A correção de registro já validado é exclusiva de Capitão ou Gestor, exige justificativa e preserva o valor anterior, a autoria e o momento no histórico. O registro volta à fila e fica fora dos indicadores até a nova Validação.
- A Frequência é o total de Presente validadas dividido pelo total de Presente e Ausente validadas. Justificadas aparecem separadamente. Quando não houver registros elegíveis no período, mostrar “Sem dados para calcular”. Presente validada sem horários conta para a Frequência e fica sem Carga horária registrada. Carga horária soma a duração de turnos com horários e Validação vigente.

### Diário de atividades

- Um Diário por Membro e dia real de trabalho, mesmo com vários turnos. É permitido registrá-lo depois e independentemente da Validação de presença. Só o próprio Membro cria e altera o texto.
- O rascunho inicial é privado. Enviar explicitamente coloca a versão na fila e abre a consulta para Capitão e Gestor. Eles podem validar com comentário opcional, devolver com motivo ou reabrir um Diário validado para correção.
- Durante correção de Diário devolvido ou reaberto, Capitão e Gestor consultam a última versão enviada e o histórico. As mudanças em andamento ficam privadas até o reenvio. Preservar as versões enviadas e os atos de revisão no histórico. O texto do Membro é alterado exclusivamente por ele.

### Observações, Ocorrências e Advertências

- **Observação:** Capitão e Gestor podem publicar sobre qualquer Integrante. Líder pode publicar sobre Integrantes do próprio Subsistema. Consultam a Observação o Integrante citado, o Líder do Subsistema de referência, o Capitão e os Gestores. O autor que ainda tem acesso ao Subsistema de referência, o Capitão ou o Gestor pode corrigir com motivo e preservação da versão anterior.
- **Ocorrência:** o Líder pode encaminhar relato confidencial do próprio Subsistema e recebe confirmação do envio, sem acesso posterior ao relato. Capitão e Gestor consultam e podem decidir encerrar a Ocorrência sem Advertência. O relato e a decisão ficam no histórico confidencial.
- **Advertência:** Capitão ou Gestor emite com motivo formal e pode vincular uma Ocorrência. A comunicação é uma ação distinta e registra quando o texto foi disponibilizado. O Integrante vê somente o texto formal da própria Advertência comunicada. A Ocorrência de origem e as notas internas permanecem acessíveis apenas a Capitão e Gestores.
- O Integrante pode confirmar ciência com data e hora. Ciência registra conhecimento e não exige concordância. Capitão ou Gestor pode revogar uma Advertência comunicada com justificativa e emitir outra se necessário. O texto original permanece consultável pelo Integrante com situação Revogada.
- Aplicar a separação do conteúdo já na API, incluindo listagens, históricos, ações e erros. A resposta de confirmação ao Líder não concede consulta posterior à Ocorrência.

### Participação em Eventos

- O Módulo 6 fornece Evento, horário, situação, participantes esperados e responsáveis. O Módulo 4 mantém lançamento, Validação e histórico de Participação. As regras do Módulo 4 podem ser verificadas com Eventos e responsáveis de teste. A conexão com a tela real do Evento é entrega do Módulo 6 e fica fora do aceite da integração principal do Módulo 4.
- Em Reunião semanal, cada Líder registra para o próprio Subsistema, inclusive em Reunião conjunta. Em Reunião dos Gestores, registra o Gestor responsável. Para Competições, Eventos gerais e Reuniões avulsas, Capitão ou Gestor designa explicitamente um Capitão, Gestor ou Líder ativo. A atribuição vale no Evento indicado e é independente da responsabilidade pela Logística. Sem responsável definido, o lançamento fica bloqueado.
- A chamada sugere Integrantes dos Subsistemas envolvidos nas Reuniões semanais, Gestores nas suas Reuniões e Integrantes com Inscrição confirmada nas Competições. Em Eventos gerais e Reuniões avulsas, o responsável seleciona os esperados. A lista pode ser ajustada antes do lançamento. A situação inicial é Prevista, que fica fora da fila e dos indicadores, inclusive após o fim do Evento enquanto não houver confirmação.
- A partir do início do Evento, o responsável pode registrar Presente, Ausente ou Justificada. Justificada exige motivo e Ausente aceita motivo opcional. O responsável consulta apenas os dados necessários à chamada e pode ajustar lançamentos pendentes. Na troca de responsável, preservar lançamentos e autoria anterior e encerrar a permissão decorrente da atribuição anterior.
- Capitão e Gestor validam situações finais e são os únicos que podem corrigir Participação já validada. Aplicar justificativa, histórico e nova Validação conforme a regra de correção. Indicadores usam situações finais validadas. Evento cancelado bloqueia novos lançamentos e sai dos indicadores, mantendo os registros já existentes consultáveis conforme o escopo.

### Contrato compartilhado

- Frontend e backend acordam consultas, filtros, capacidades, comandos e erros antes das entregas separadas. Distinguir Registro de presença em turno de Participação em Evento. Definir datas do turno e da saída, data do Diário e data e hora dos atos de histórico. Prever erros de validação, sobreposição, autorização e conflito, inclusive por registro em lote, respeitando a visibilidade.
- As consultas separam dados individuais, agregados, rascunhos privados, versões enviadas e conteúdo disciplinar comunicável. Retornar o necessário para cada Perfil e dois resultados distintos quando aplicável: Frequência e Carga horária.
- A sidebar mantém uma entrada para o módulo. As telas seguem o design system e os fluxos responsivos do Figma, com as permissões consolidadas nesta especificação. O frontend pode trabalhar com mocks isolados em desenvolvimento após a definição do contrato.
- A última entrega principal do frontend liga os fluxos à API real com a sessão e o padrão HTTP e CSRF do ERP. Depende das APIs do Módulo 4 e da base de Equipe e Subsistemas, sem espera por Documentação, Eventos ou Dashboard. O consumo de indicadores pelo Dashboard é uma entrega do Módulo 8.
- Usar o DBML v6 e o esquema Flyway V1–V11 já disponível na develop. As regras de autorização, consistência em lote e histórico usam as estruturas existentes.

## Decisões de verificação

- No backend, exercitar a API autenticada com PostgreSQL e Flyway, seguindo os testes de integração do Módulo 1. Cobrir dois Subsistemas, situação de vínculo antigo ou em revisão, Capitão sem Subsistema, acessos próprios e agregados do Orientador. Verificar que erro ou filtro não expõe dados de outro escopo.
- Na chamada, verificar aplicação de horário e exceções no frontend, gravação parcial da chamada por seleção, rejeição de lote inválido sem gravação parcial, turno que cruza a meia-noite, sobreposição e intervalos consecutivos. Testar justificativa, presença sem horário, agregados sem dados, Validação em lote e retirada e retorno ao indicador após correção e nova Validação.
- No Diário, exercitar data de trabalho, unicidade por dia, rascunho privado, envio, devolução, reenvio, Validação e reabertura. Conferir que a última versão enviada fica consultável para os revisores sem expor alterações em andamento.
- Em registros administrativos, verificar publicação e correção de Observação conforme o escopo. Conferir confirmação de Ocorrência ao Líder sem acesso posterior, encerramento sem Advertência, emissão e comunicação separadas, ciência e revogação com preservação do texto e do histórico. Verificar a separação da Ocorrência de origem e das notas internas.
- Para Participação em Eventos, usar Eventos e responsáveis de teste para comprovar escopos de Reunião conjunta, atribuição independente da Logística, ausência e troca de responsável, início do Evento, situação Prevista, Validação, correção e cancelamento. A validação ponta a ponta da tela de Evento pertence à integração do Módulo 6.
- No frontend, verificar os fluxos pelo contrato dos adaptadores, com perfis distintos, estados de carregamento, vazio, falha e nova tentativa, preservação de seleção, teclado, desktop, mobile e temas claro e escuro. Na integração real do Módulo 4, verificar chamada → Validação → indicadores, Diário → revisão e Advertência → comunicação → ciência com sessões de perfis distintos.

## Fora de escopo

- Alterar o esquema ou criar migrações, tabelas, colunas, índices ou restrições. O limite vale para as issues funcionais de todos os módulos.
- Implementar a tela e o cadastro de Eventos, a gestão de Inscrições, a atribuição de responsáveis pela chamada de Evento ou o Dashboard. O Módulo 4 fornece suas regras e dados aos consumidores desses fluxos.
- Criar as issues de implementação ou implementar código nesta etapa. A divisão das issues de frontend e backend será proposta para revisão.

## Referências

- [Decisões aprovadas](../modulos-restantes/map.md#decisões-confirmadas) e [dependências entre módulos](../modulos-restantes/map.md#dependências-entre-entregas).
- [Glossário](../../CONTEXT.md#pessoas-e-participação), [guia do módulo](../../docs/projeto/modulos/pessoas-e-participacao.md), [requisitos RF19–RF22 e RF32](../../docs/projeto/requisitos/funcionais.md) e [base de modelagem vigente](../../docs/projeto/modelagem.md#base-das-especificações-dos-módulos).
- [Pessoas e Participação no Figma](https://www.figma.com/design/NhEuGEDcNqW2NNMnP614YV/PROCOBAJA-ERP-%C2%B7-UI-Kit---Design-System?node-id=126-426).

## Comments
