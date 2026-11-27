# Planejamento dos módulos restantes

## Objetivo

Preparar as especificações e as issues dos módulos 02 a 08 antes de iniciar a implementação de qualquer um deles. Cada issue deve ter uma entrega verificável, critérios de aceitação e dependências explícitas.

## Fontes para o planejamento

- [Documentação dos módulos](../../docs/projeto/modulos/README.md), [requisitos funcionais](../../docs/projeto/requisitos/funcionais.md) e [documento de projeto](../../docs/projeto/documento-de-projeto.pdf).
- [Glossário](../../CONTEXT.md), [decisões de arquitetura](../../docs/adr/) e [modelo relacional v6](../../docs/diagramas/Diagramas%20de%20Banco%20de%20Dados/modelo_relacional_v6.dbml). A migração V11 expressa as mudanças sobre a base atual V10.
- Conferir as telas do Figma, a implementação e as migrações na `develop` atual antes de fechar cada especificação. Registrar divergências que mudem o comportamento esperado.
- [Issue 11 do Módulo 1](../modulo-1_frontend/issues/11-integracao-backend.md): a integração já foi mesclada. A validação ponta a ponta com backend real segue como pendência de aceite do Módulo 1.

## Módulos e decisões a esclarecer

| Módulo | Escopo de partida | Decisões iniciais |
| --- | --- | --- |
| 02 · [Atividades e Sprints](../../docs/projeto/modulos/atividades-e-sprints.md) | Backlog, Kanban, Sprints e histórico de transferências. | Regras levantadas. Consolidar na especificação, com as dependências de Equipe e Subsistemas e dos indicadores do Dashboard. |
| 03 · [Gestão Financeira](../../docs/projeto/modulos/gestao-financeira.md) | Solicitações, Revisões, Orçamentos, aprovação dupla, pagamentos e caixa. | Regras levantadas. Consolidar na especificação, com as dependências de Equipe e Subsistemas, Documentação e Dashboard. |
| 04 · [Pessoas e Participação](../../docs/projeto/modulos/pessoas-e-participacao.md) | Presença, horas, diário, validações e ocorrências. | Regras levantadas. Consolidar na especificação, incluindo as dependências com Eventos e Dashboard. |
| 05 · [Documentação](../../docs/projeto/modulos/documentacao.md) | Google Drive, metadados, versões, vínculos e confidencialidade. | Regras levantadas. Consolidar na especificação, incluindo falhas da integração e permissões dos vínculos. |
| 06 · [Competições e Eventos](../../docs/projeto/modulos/competicoes-e-eventos.md) | Competições, eventos, reuniões e dados operacionais. | Regras levantadas. Consolidar na especificação, incluindo as dependências com Pessoas e Participação, Documentação e Financeiro. |
| 07 · [Governança](../../docs/projeto/modulos/governanca.md) | Versões, publicação, vigência, ciência e aceite. | Regras levantadas. Consolidar na especificação e explicitar os dados de aceite consumidos pelo Dashboard. |
| 08 · [Dashboard e Indicadores](../../docs/projeto/modulos/dashboard-e-indicadores.md) | Indicadores, alertas e atalhos por perfil e subsistema. | Primeira entrega, períodos, visibilidade e estados definidos. Consolidar na especificação com dependências por indicador. |

## Decisões confirmadas

- Competições e Eventos define quem pode registrar a Participação pela tela do Evento. Pessoas e Participação mantém o registro, a Validação e o histórico.
- Nas Reuniões semanais, cada Líder registra apenas os Integrantes do seu Subsistema, inclusive quando a Reunião é conjunta. Nas Reuniões dos Gestores, registra o Gestor responsável. Em Competições e Eventos gerais, Capitão ou Gestor designa explicitamente quem pode registrar. A responsabilidade pela logística, por si só, não concede essa permissão.
- Só Capitão ou Gestor corrige um Registro de presença ou uma Participação já validada. A correção exige justificativa, preserva o valor anterior, o autor e o momento da alteração, e exige nova Validação antes que o valor corrigido conte nos indicadores.
- Participações nas situações Presente, Ausente e Justificada exigem Validação por Capitão ou Gestor. Prevista é planejamento e fica fora da fila. O Dashboard usa somente Participações validadas.
- Capitão e Gestor podem validar a própria presença ou Participação.
- O formulário de Registro de presença sugere o período das 18h às 22h e aceita os horários reais do turno, inclusive fora dessa faixa.
- Um Registro de presença marcado como Presente pode ficar sem horários. Quando validado, conta para a Frequência e fica sem Carga horária registrada.
- Na chamada do turno, o responsável pode aplicar o horário comum às pessoas selecionadas, conferir quantos registros serão preenchidos antes de salvar e ajustar exceções por pessoa. Mudanças no horário comum preservam os ajustes individuais.
- A chamada pode ser salva parcialmente. Quem ainda não foi conferido fica sem lançamento até o responsável completar a chamada.
- Antes da Validação, o Líder atual pode corrigir lançamentos do próprio Subsistema. Capitão e Gestor também podem corrigi-los.
- Um turno pode terminar após a meia-noite, com data de saída explícita. A duração integral fica na data de início do turno. A V11 usa data e hora para validar a ordem e impedir sobreposição.
- A Frequência usa a proporção de registros validados como Presente entre os validados como Presente ou Ausente. Ausências Justificadas ficam fora da proporção e aparecem separadamente.
- A chamada retroativa usa o vínculo do Integrante na data de início do turno. Após transferência, o lançamento continua associado ao Subsistema de origem. O Líder atual desse Subsistema, o Capitão ou um Gestor pode completar a chamada.
- Capitão e Gestor podem validar vários registros pendentes em uma ação. Cada registro conserva o autor e o momento da Validação.
- O mesmo Integrante não pode ter turnos com horários sobrepostos, inclusive quando um turno vira o dia. Turnos consecutivos são permitidos. Quando houver sobreposição, o ERP identifica o registro que precisa de ajuste, respeitando as permissões de consulta.
- A chamada sugere os Integrantes dos Subsistemas envolvidos nas Reuniões semanais, os Gestores nas Reuniões dos Gestores e os inscritos nas Competições. Nos Eventos gerais, o responsável seleciona os participantes esperados. A lista pode ser ajustada antes do lançamento e os participantes esperados começam como Prevista.
- Capitão ou Gestor pode designar um Capitão, Gestor ou Líder ativo para registrar Participações em Competições e Eventos gerais. A atribuição só vale no Evento designado e permite lançar e ajustar registros pendentes. A permissão de Validação permanece com Capitão e Gestor.
- Capitão e Gestor consultam os registros individuais da equipe. O Líder consulta os Registros de presença em turno do próprio Subsistema. Cada Integrante consulta os próprios registros, e o responsável designado acessa os registros necessários para a chamada do seu Evento. O Orientador consulta indicadores agregados, sem justificativas individuais.
- A lista de Participações Previstas pode ser preparada antes do Evento. A partir do início, o responsável pode lançar Presente, Ausente ou Justificada, inclusive durante o Evento.
- Sem Registros de presença validados como Presente ou Ausente no período, a Frequência aparece como “Sem dados para calcular”.
- Se o vínculo na data de início do turno não puder ser verificado, o lançamento retroativo fica pendente. Capitão ou Gestor confirma o Subsistema da época e justifica a escolha antes de salvar o registro.
- O Membro é o único autor e editor do próprio Diário. Capitão e Gestor validam com comentário opcional, devolvem para correção com motivo ou reabrem um Diário validado preservando a versão anterior. A especificação deve substituir a edição administrativa mostrada no Figma por essas ações de revisão.
- Cada Membro pode registrar um Diário por dia de trabalho e reunir nele os relatos de mais de um turno. Pode fazer o lançamento depois, com a data real do trabalho, independentemente de a presença ter sido validada.
- O Membro pode salvar o Diário como rascunho. Somente o envio explícito coloca o relato na fila de Validação. Em caso de devolução, o Membro corrige e reenvia pela mesma ação.
- Uma Observação cotidiana é visível ao Integrante citado, ao Líder do Subsistema de referência, ao Capitão e aos Gestores.
- O autor pode corrigir uma Observação publicada enquanto tiver acesso ao Subsistema de referência. Capitão e Gestor também podem corrigi-la. A correção exige motivo e preserva a versão anterior. O Integrante citado tem acesso de consulta.
- Ocorrência é relato confidencial. O Líder pode encaminhar uma Ocorrência do próprio Subsistema e recebe confirmação de envio, sem acesso posterior ao relato. Capitão e Gestor podem consultar a Ocorrência e emitir Advertência, que é uma medida administrativa formal.
- Emissão e comunicação da Advertência são ações distintas. Após a comunicação no ERP, o Integrante pode consultar o texto formal da própria Advertência. O ERP registra quando ela foi disponibilizada. A Ocorrência de origem e as notas internas permanecem confidenciais.
- O Integrante pode confirmar ciência da Advertência comunicada. O ERP registra data e hora. Ciência registra conhecimento e não exige concordância com o conteúdo.
- Capitão ou Gestor pode revogar uma Advertência comunicada com justificativa e emitir outra, se necessário. O texto original é preservado e continua visível ao Integrante com situação Revogada.
- Uma Advertência sempre exige motivo formal. O vínculo com uma Ocorrência é opcional e fica visível apenas para Capitão e Gestores.
- Capitão ou Gestor pode encerrar uma Ocorrência sem Advertência. O relato e a decisão de encerramento ficam no histórico confidencial.
- Para cadastrar uma Reunião, Competição ou Evento geral, é obrigatório informar tipo, nome e data e hora de início. Término, local e descrição podem ser preenchidos depois.
- Capitão e Gestor podem criar e editar compromissos de todos os tipos. Líder pode criar e editar Reuniões do próprio Subsistema. Em Competições e Eventos gerais, a atribuição da chamada permite registrar Participações, sem conceder acesso à edição do Evento.
- Um compromisso cancelado permanece no histórico como Cancelado, com motivo, autor e data do cancelamento. Os registros de Participação existentes permanecem consultáveis conforme as permissões. O cancelamento bloqueia novos lançamentos e exclui o compromisso dos indicadores de Participação.
- Capitão e Gestor registram e atualizam Inscrições em Competições. O Integrante consulta a própria Inscrição. A primeira entrega não inclui autoinscrição. Só Inscrições confirmadas entram na lista sugerida da chamada e a Participação é confirmada separadamente.
- Capitão e Gestor gerenciam a Logística e podem delegá-la a um Líder ativo para um Evento específico. A delegação é independente da permissão de chamada. Dados operacionais, incluindo transporte, hospedagem, alimentação e apoios, ficam no Evento. Custos e pagamentos ficam no Financeiro.
- Capitão e Gestor registram vários Resultados por edição, por prova, categoria ou modalidade. Cada lançamento exige uma modalidade e pelo menos um destes dados: posição, pontuação ou descrição do resultado.
- A remarcação mantém o mesmo Evento, preserva a data anterior no histórico e conserva Inscrições e Participações Previstas. Se já houver lançamentos finais, somente Capitão ou Gestor pode alterar a data para corrigir um erro, com justificativa. Uma nova edição exige outro cadastro.
- O Evento pode aparecer na agenda antes da atribuição da chamada. Até definir o responsável, o detalhe sinaliza a pendência e o lançamento da chamada fica bloqueado.
- Vínculos com atas, regulamentos e outros documentos são opcionais no cadastro e no encerramento. Podem ser adicionados depois e seguem as permissões de Documentação.
- Capitão e Gestores podem registrar a presença do Capitão em turno sem associá-lo a um Subsistema. A V11 permite a ausência de vínculo no esquema. Cabe ao backend autorizar esse caso e tratar o vínculo em revisão nas chamadas retroativas.
- O fim do Evento mantém as Participações Previstas pendentes até o responsável confirmar a situação. Elas ficam fora dos indicadores enquanto estiverem Previstas.
- A troca de responsável por registrar Participação preserva os registros e a autoria original. O novo responsável pode completar ou ajustar lançamentos pendentes. O anterior perde a permissão que decorria da atribuição. Registros já validados seguem a regra de correção por Capitão ou Gestor.

### Atividades e Sprints

- Não concluída registra que a Atividade continuava pendente no encerramento da Sprint. Enquanto a Sprint está aberta, uma Atividade que ainda não começou fica Não iniciada, e uma interrompida deliberadamente fica Pausada.
- Prazo e Estimativa de esforço são opcionais no Backlog e obrigatórios para alocar a Atividade em uma Sprint.
- Capitão e Gestor podem editar o planejamento completo de Atividades com vários Subsistemas. O Líder de um Subsistema envolvido pode atualizar o andamento. Mudanças que afetam todos, como prazo, prioridade e vínculos com Subsistemas, ficam com Capitão e Gestor.
- A equipe pode planejar Sprints futuras, com apenas uma Sprint em andamento por vez. A duração sugerida é de 15 dias e pode ser ajustada por Capitão ou Gestor.
- Na data final, o ERP sinaliza que a Sprint chegou ao prazo. A Sprint só é encerrada quando Capitão ou Gestor confirma.
- No encerramento, Capitão ou Gestor escolhe, por Atividade pendente, entre transferir para uma Sprint futura já planejada ou retornar ao Backlog. A passagem encerrada registra Não concluída, e a Atividade mantém seu estado de trabalho no destino.
- Qualquer Membro responsável pela Atividade pode iniciá-la, pausá-la, retomá-la e concluí-la. O histórico registra quem mudou o estado. A atribuição como responsável não concede permissão para editar o planejamento.
- Capitão e Gestor podem reabrir qualquer Atividade concluída. O Líder pode reabrir uma Atividade exclusiva do próprio Subsistema. A reabertura exige motivo, volta a Atividade para Em andamento e preserva o resultado das Sprints já encerradas.
- A partir da metade do período planejado da Sprint, sinalizar Atividades Não iniciadas ou Pausadas. Atividades Em andamento são sinalizadas quando o prazo passa.
- Capitão ou Gestor confirma o início da Sprint. Se outra estiver em andamento, o ERP exige seu encerramento antes de iniciar a próxima. As datas previstas continuam registrando o planejamento.
- Pelo menos um responsável ativo é obrigatório para alocar uma Atividade em uma Sprint. Uma Atividade no Backlog pode ficar sem responsável.
- Capitão e Gestor podem incluir ou retirar Atividades durante a Sprint. Inclusões seguem os requisitos de alocação. Retiradas registram autor, motivo e destino no histórico, separadas das Atividades que ficaram Não concluídas no encerramento.
- Capitão e Gestor podem criar e planejar Atividades no Backlog de qualquer Subsistema. Líder pode criar e editar Atividades exclusivas do próprio Subsistema. Membro atua nas Atividades atribuídas a ele.
- Gestor Financeiro conserva todas as permissões de Gestor em Atividades e Sprints.
- Líder acompanha outros Subsistemas em modo de consulta. Membro consulta as Atividades do próprio Subsistema e aquelas atribuídas a ele. Orientador consulta o andamento dos Subsistemas ativos.
- Toda Atividade exige pelo menos um Subsistema desde a criação. Pode receber Responsáveis de outros Subsistemas.
- Se o último Responsável ativo for desativado, a Atividade permanece onde está e o ERP sinaliza que precisa de um novo Responsável ativo. O histórico é preservado.
- Capitão e Gestor podem arquivar Atividades com motivo. Líder pode arquivar Atividades exclusivas do próprio Subsistema que estejam no Backlog. Atividades arquivadas saem do quadro ativo e permanecem no histórico.
- A Transferência de atividade conserva o prazo. Capitão ou Gestor pode ajustá-lo explicitamente, com registro no histórico. Uma Atividade pode chegar atrasada à Sprint de destino.

### Gestão Financeira

- Cada Revisão enviada exige pelo menos três Orçamentos de Fornecedores distintos para os mesmos itens e quantidades.
- Capitão e Gestor Financeiro aprovam a mesma Revisão e o mesmo Orçamento. Se indicarem opções diferentes, a Revisão continua Aguardando aprovação até coincidirem. A mudança de Gestor Financeiro exige nova decisão dele para Revisões ainda pendentes, preservando a anterior no histórico. Compras já aprovadas continuam aprovadas.
- Após pagamento ou cancelamento, o Solicitante continua vendo itens, situação e histórico de decisões. Preços e Orçamentos são visíveis ao Solicitante durante o processo e ficam restritos no histórico encerrado.
- Aumento do valor ou troca de Fornecedor antes do pagamento exige nova Revisão e nova aprovação. Desconto para os mesmos itens e quantidades no mesmo Fornecedor pode ser registrado no Pagamento com observação.
- Reembolso total ou parcial gera uma Entrada vinculada à Compra e preserva a Saída original. O cancelamento de uma Saída pode corrigir erro de lançamento.
- Uma Compra aprovada com data prevista de Pagamento gera Previsão financeira. O Pagamento realiza a Previsão e a vincula à Saída. O cancelamento da Compra antes do Pagamento cancela a Previsão.
- Qualquer Integrante ativo pode abrir Solicitação de compra para o próprio Subsistema. Solicitações gerais da equipe ou de vários Subsistemas ficam com Capitão e Gestor.
- O Solicitante pode retirar uma Revisão da análise para preparar outra. A Revisão enviada e as decisões permanecem no histórico. O reenvio inicia uma nova aprovação.
- Uma Reprovação encerra a análise da Revisão imediatamente e exige justificativa. O Solicitante pode corrigir e reenviar. Na ausência de Gestor Financeiro, uma Solicitação enviada pode ficar aguardando análise e o ERP indica o motivo da pendência.
- Capitão ou Gestor Financeiro registra o Pagamento com data, valor efetivo e referência. O comprovante pode ser vinculado depois, conforme as permissões de Documentação. A primeira entrega tem um Pagamento integral por Compra, sem parcelamento.
- Capitão e Gestor Financeiro podem registrar Entradas, Saídas e Previsões avulsas com categoria compatível, data, valor e descrição. A Saída de uma Compra vinculada nasce do seu Pagamento.
- Uma Compra compartilhada aparece com seu valor integral em cada visão filtrada por Subsistema, com indicação de que é compartilhada. O total geral da equipe conta o valor uma única vez.

### Documentação

- Documentos financeiros confidenciais, inclusive metadados de busca, conteúdo, versões e downloads, ficam restritos a Capitão e Gestor Financeiro. O acesso contextual do Solicitante aos próprios Orçamentos em análise continua limitado ao fluxo de Compra.
- Documento comum de equipe fica disponível a todos os perfis ativos, incluindo Orientador. Documento comum restrito a Subsistemas pode ser consultado por Capitão, Gestores e Integrantes dos Subsistemas indicados. Vínculos de outros módulos preservam as permissões do Documento.
- Quem envia só escolhe níveis de confidencialidade que pode consultar. Capitão e Gestor podem reclassificar dentro das próprias permissões. Reclassificação de ou para Financeiro confidencial fica com Capitão ou Gestor Financeiro e tem histórico.
- Capitão ou Gestor seleciona os arquivos existentes em pasta autorizada, confirma a categoria e a confidencialidade e importa sem duplicar o arquivo. O ERP identifica arquivos já importados.
- O ERP verifica autorização antes de abrir ou baixar cada versão. Arquivos confidenciais ficam em área restrita no Drive, sem compartilhamento aberto por link.
- Uma atualização cria uma versão no mesmo cadastro. Vínculos permanecem no Documento, e cada versão guarda autor e data.
- Líder pode solicitar exclusão com motivo. Capitão ou Gestor autorizado decide. Aprovada a exclusão, o arquivo sai da biblioteca e vai para a lixeira quando o Drive confirma. Solicitação e decisão permanecem no histórico.
- O autor do envio enquanto mantiver acesso ao Documento, Capitão ou Gestor autorizado pode publicar nova versão do arquivo.
- Capitão ou Gestor autorizado pode restaurar o Documento enquanto o arquivo estiver na lixeira do Drive. A restauração recupera cadastro, vínculos e permissões anteriores, com registro no histórico.
- Uma falha do Drive é comunicada e permite nova tentativa. Em uma atualização, a versão anterior continua disponível e a nova só aparece após confirmação do Drive.

### Governança

- Capitão define a vigência imediata ou futura ao publicar. A nova Versão fica disponível para leitura na publicação. A anterior continua vigente até a data escolhida.
- Cada nova Versão exige novo aceite dos usuários ativos, inclusive de quem a publicou. O ERP guarda usuário, Versão e data. Quem entra depois confirma apenas as Versões vigentes.
- O aceite pendente aparece no Dashboard e o usuário pode continuar usando o ERP. Capitão e Gestor acompanham as pendências.
- Corrigir conteúdo publicado exige nova Versão e publicação pelo Capitão. O conteúdo anterior e seus aceites são preservados.
- Capitão e Gestor podem editar Rascunhos. Gestor pode marcar um Rascunho como Pronto para publicação. Só o Capitão publica e pode publicar diretamente um Rascunho que ele próprio preparou.
- Capitão pode encerrar a vigência de uma norma sem substituta, com justificativa. A norma e os aceites continuam no histórico e deixam de gerar pendências.

### Dashboard e Indicadores

- A primeira entrega inclui Sprint atual, Atividades atribuídas e atrasadas, Frequência e horas validadas, próximos Eventos e aceites pendentes. Para Capitão e Gestor Financeiro, inclui saldo e Previsão de caixa quando disponíveis. Indicadores da biblioteca ficam para uma entrega posterior.
- O período inicial é a Sprint atual para Atividades, o mês atual para presença e horas, e os próximos 30 dias para Agenda. Cada bloco informa seu período e oferece filtro quando fizer sentido.
- Líder começa pelo próprio Subsistema. Membro vê primeiro os próprios dados. Orientador vê totais gerais ou por Subsistema ativo, sem acesso a registros individuais.
- Exibir zero quando os dados existem e o resultado é zero, “Sem dados no período” quando faltam registros elegíveis e “Indisponível no momento” em caso de falha. O painel não exibe indicadores fora das permissões do usuário. A Frequência sem Registros de presença elegíveis mantém a mensagem específica “Sem dados para calcular”.
- Alertas continuam visíveis enquanto a pendência existir e apontam para a tela em que ela pode ser resolvida. A primeira entrega não inclui dispensa manual.

## Dependências entre entregas

- O Módulo 1 fornece identidade, perfis, subsistemas e a regra do Gestor Financeiro. As matrizes antigas que tratam Financeiro como perfil independente precisam ser reconciliadas com essa regra.
- As issues devem ligar a definição de Evento e de responsável ao registro de Participação. A V11 já modela Validação e histórico para Participações em Eventos. As operações, transições e autorizações continuam a cargo das futuras entregas de backend.
- A chamada de turno pode ser preparada independentemente do cadastro de Eventos. A chamada pela tela do Evento depende da identificação do Evento e dos responsáveis, fornecida por Competições e Eventos, e do lançamento, Validação e histórico, mantidos por Pessoas e Participação. As listas sugeridas para Competições dependem dos dados de Inscrição. Os indicadores do Dashboard dependem dos registros validados e das regras de visibilidade de cada módulo.
- Documentação fornece vínculos a arquivos para os módulos que os exibem. Confirmar em cada fluxo se o arquivo é obrigatório ou se a associação pode entrar em uma entrega posterior.
- Agenda, chamada e Logística operacional podem funcionar antes da integração com Documentação e Financeiro. Os vínculos com arquivos dependem de Documentação. Custos e pagamentos dependem de Gestão Financeira e preservam as permissões de origem.
- Cada bloco do Dashboard depende dos contratos e permissões de sua fonte. A Sprint atual e as Atividades atribuídas e atrasadas dependem do Módulo 02. Saldo e Previsão de caixa dependem do Módulo 03. Frequência e horas validadas dependem do Módulo 04. Próximos Eventos dependem do Módulo 06. Aceites pendentes dependem do Módulo 07. Indicadores da biblioteca dependem do Módulo 05 e ficam para depois da primeira entrega.

## Escopo das issues

- Usar o modelo relacional v6 e as migrações Flyway V1 a V11 como base das issues. A instalação limpa e a atualização da V10 foram verificadas no PostgreSQL 16.4.
- As issues dos módulos partem do esquema pronto e não incluem criação ou alteração de tabelas, colunas, índices, restrições ou migrações. As issues de backend podem consultar e gravar nas tabelas existentes, implementar regras de negócio e testar a integração com o banco.
- A [base de modelagem por módulo](../../docs/projeto/modelagem.md#base-das-especificações-dos-módulos) identifica o que a V11 já fornece e o que cabe aos serviços. Use essa separação ao escrever as especificações e os critérios de aceite.

## Saída do planejamento

1. Resolver as decisões transversais e registrar as regras duradouras no glossário ou em ADRs, conforme o caso.
2. Revisar fontes e fechar uma especificação por módulo. Confirmar as interfaces compartilhadas antes de fechar os módulos que as consomem.
3. Propor issues separadas de frontend e backend, com entregas e critérios de aceitação próprios para facilitar a atribuição a responsáveis diferentes. A especificação do módulo serve de referência comum para contratos e regras de negócio. Cada issue explicita os bloqueios reais, inclusive quando depende de uma issue da outra parte ou de outro módulo. A implementação do frontend pode avançar com mocks quando o contrato estiver definido. A integração real depende da API correspondente e precisa de validação ponta a ponta. Revisar a divisão com o usuário antes de gravar as issues de implementação no rastreador local.
4. Considerar o planejamento concluído quando os sete módulos tiverem especificações, issues e dependências revisadas. A ordem de planejamento serve para fechar essas decisões; a ordem de implementação será definida pelas dependências aprovadas.
