# Planejamento dos módulos restantes

## Objetivo

Este mapa local reúne as decisões que deram origem às especificações e às issues dos módulos 2 a 8. Consulte as [issues publicadas](https://github.com/BajaERP/procoBajaERP/issues) para critérios de aceitação e dependências. Use o [Projects procoBajaERP](https://github.com/orgs/BajaERP/projects/2) para acompanhar as entregas por Módulo.

## Fontes para o planejamento

- [Documentação dos módulos](../../docs/projeto/modulos/README.md), [requisitos funcionais](../../docs/projeto/requisitos/funcionais.md) e [documento de projeto](../../docs/projeto/documento-de-projeto.pdf).
- [Glossário](../../CONTEXT.md), [decisões de arquitetura](../../docs/adr/) e [modelo relacional v6](../../docs/diagramas/Diagramas%20de%20Banco%20de%20Dados/modelo_relacional_v6.dbml). A migração V11 expressa as mudanças sobre a base atual V10.
- Conferir as telas do Figma, a implementação e as migrações na `develop` atual antes de fechar cada especificação. Registrar divergências que mudem o comportamento esperado.
- A integração do Módulo 1 foi mesclada. O registro da entrega preserva a pendência de verificação ponta a ponta com o backend real. [Issue de integração do Módulo 1](https://github.com/BajaERP/procoBajaERP/issues/168)

## Planejamento por módulo

| Módulo | Escopo | Referências locais e dependências |
| --- | --- | --- |
| 02 · [Atividades e Sprints](../../docs/projeto/modulos/atividades-e-sprints.md) | Backlog, Kanban, Sprints e histórico de transferências. | [Especificação](../modulo-2_atividades-e-sprints/spec.md) e [issues aprovadas](../modulo-2_atividades-e-sprints/issues/). |
| 03 · [Gestão Financeira](../../docs/projeto/modulos/gestao-financeira.md) | Solicitações, Revisões, Orçamentos, aprovação dupla, pagamentos e caixa. | [Especificação](../modulo-3_gestao-financeira/spec.md) e [issues aprovadas](../modulo-3_gestao-financeira/issues/). |
| 04 · [Pessoas e Participação](../../docs/projeto/modulos/pessoas-e-participacao.md) | Presença, horas, diário, validações e ocorrências. | [Especificação](../modulo-4_pessoas-e-participacao/spec.md) e [issues aprovadas](../modulo-4_pessoas-e-participacao/issues/). A integração principal usa as próprias APIs e a base de Equipe e Subsistemas. |
| 05 · [Documentação](../../docs/projeto/modulos/documentacao.md) | Google Drive, metadados, versões, vínculos e confidencialidade. | [Especificação](../modulo-5_documentacao/spec.md) e [issues aprovadas](../modulo-5_documentacao/issues/). A validação com arquivos reais depende da disponibilidade do Drive compartilhado. |
| 06 · [Competições e Eventos](../../docs/projeto/modulos/competicoes-e-eventos.md) | Competições, eventos, reuniões e dados operacionais. | [Especificação](../modulo-6_competicoes-e-eventos/spec.md) e [issues aprovadas](../modulo-6_competicoes-e-eventos/issues/). A integração principal usa a própria API. Participação, Documentação e Financeiro têm entregas com dependências próprias. |
| 07 · [Governança](../../docs/projeto/modulos/governanca.md) | Versões, publicação, vigência, ciência e aceite. | [Especificação](../modulo-7_governanca/spec.md) e [issues aprovadas](../modulo-7_governanca/issues/). O Dashboard consome a consulta pessoal de pendências da issue 06. |
| 08 · [Dashboard e Indicadores](../../docs/projeto/modulos/dashboard-e-indicadores.md) | Indicadores, alertas e atalhos por perfil e subsistema. | [Especificação](../modulo-8_dashboard-e-indicadores/spec.md) e [issues aprovadas](../modulo-8_dashboard-e-indicadores/issues/). Cada cartão tem integração e dependências próprias. |

## Decisões confirmadas

- Competições e Eventos define quem pode registrar a Participação pela tela do Evento. Pessoas e Participação mantém o registro, a Validação e o histórico.
- Nas Reuniões semanais, cada Líder registra apenas os Integrantes do seu Subsistema, inclusive quando a Reunião é conjunta. Nas Reuniões dos Gestores, registra o Gestor responsável. Em Competições, Eventos gerais e Reuniões avulsas, Capitão ou Gestor designa explicitamente quem pode registrar. A atribuição de Logística é independente da chamada.
- Só Capitão ou Gestor corrige um Registro de presença ou uma Participação já validada. A correção exige justificativa e preserva o valor anterior, o autor e o momento da alteração no histórico. O registro corrigido sai temporariamente dos indicadores de Frequência, Carga horária ou Participação, conforme o caso, e volta a contar após nova Validação.
- Participações nas situações Presente, Ausente e Justificada exigem Validação por Capitão ou Gestor. Prevista é planejamento e fica fora da fila. O Dashboard usa somente Participações validadas.
- A situação Justificada exige motivo no Registro de presença e na Participação em Evento. Na situação Ausente, o motivo é opcional.
- Capitão e Gestor podem validar a própria presença ou Participação.
- O formulário de Registro de presença sugere o período das 18h às 22h e aceita os horários reais do turno, inclusive fora dessa faixa.
- Um Registro de presença marcado como Presente pode ficar sem horários. Quando validado, conta para a Frequência e fica sem Carga horária registrada.
- Na chamada do turno, o responsável pode aplicar o horário comum às pessoas selecionadas, conferir quantos registros serão preenchidos antes de salvar e ajustar exceções por pessoa. Mudanças no horário comum preservam os ajustes individuais.
- A chamada pode ser salva parcialmente. Quem ainda não foi conferido fica sem lançamento até o responsável completar a chamada.
- Cada envio para salvar ou validar um lote aplica todos os registros selecionados ou mantém o lote intacto em caso de erro. O ERP indica o registro que precisa de ajuste e preserva a seleção para nova tentativa.
- Antes da Validação, o Líder atual pode corrigir lançamentos do próprio Subsistema. Capitão e Gestor também podem corrigi-los.
- Um turno pode terminar após a meia-noite, com data de saída explícita. A duração integral fica na data de início do turno. A V11 usa data e hora para validar a ordem e impedir sobreposição.
- A Frequência usa a proporção de registros validados como Presente entre os validados como Presente ou Ausente. Ausências Justificadas ficam fora da proporção e aparecem separadamente.
- A chamada retroativa usa o vínculo do Integrante na data de início do turno. Após transferência, o lançamento continua associado ao Subsistema de origem. O Líder atual desse Subsistema, o Capitão ou um Gestor pode completar a chamada.
- Capitão e Gestor podem validar vários registros pendentes em uma ação. Cada registro conserva o autor e o momento da Validação.
- O mesmo Integrante não pode ter turnos com horários sobrepostos, inclusive quando um turno vira o dia. Turnos consecutivos são permitidos. Quando houver sobreposição, o ERP identifica o registro que precisa de ajuste, respeitando as permissões de consulta.
- A chamada sugere os Integrantes dos Subsistemas envolvidos nas Reuniões semanais, os Gestores nas Reuniões dos Gestores e os Integrantes com Inscrição confirmada nas Competições. Nos Eventos gerais e nas Reuniões avulsas, o responsável seleciona os participantes esperados. A lista pode ser ajustada antes do lançamento e os participantes esperados começam como Prevista.
- Capitão ou Gestor pode designar um Capitão, Gestor ou Líder ativo para registrar Participações em Competições, Eventos gerais e Reuniões avulsas. A atribuição só vale no Evento designado e permite lançar e ajustar registros pendentes. A permissão de Validação permanece com Capitão e Gestor.
- Capitão e Gestor consultam os registros individuais da equipe. O Líder consulta os Registros de presença em turno do próprio Subsistema. Cada Integrante consulta os próprios registros, e o responsável designado acessa os registros necessários para a chamada do seu Evento. O Orientador consulta indicadores agregados, sem justificativas individuais.
- A lista de Participações Previstas pode ser preparada antes do Evento. A partir do início, o responsável pode lançar Presente, Ausente ou Justificada, inclusive durante o Evento.
- Sem Registros de presença validados como Presente ou Ausente no período, a Frequência aparece como “Sem dados para calcular”.
- Se o vínculo na data de início do turno não puder ser verificado, o lançamento retroativo fica pendente. Capitão ou Gestor confirma o Subsistema da época e justifica a escolha antes de salvar o registro.
- O Membro é o único autor e editor do próprio Diário. Capitão e Gestor validam com comentário opcional, devolvem para correção com motivo ou reabrem um Diário validado preservando a versão anterior. A especificação deve substituir a edição administrativa mostrada no Figma por essas ações de revisão.
- Cada Membro pode registrar um Diário por dia de trabalho e reunir nele os relatos de mais de um turno. Pode fazer o lançamento depois, com a data real do trabalho, independentemente de a presença ter sido validada.
- O Membro pode salvar o Diário como rascunho. Somente o envio explícito coloca o relato na fila de Validação. Em caso de devolução, o Membro corrige e reenvia pela mesma ação.
- Só o próprio Membro vê o rascunho inicial. Capitão e Gestor passam a ver o relato no envio. Após devolução ou reabertura, eles podem consultar a última versão enviada e o histórico. As alterações em andamento ficam privadas até o reenvio.
- Capitão e Gestor podem publicar Observações sobre qualquer Integrante da equipe. Líder pode publicar Observações sobre Integrantes do próprio Subsistema.
- Uma Observação cotidiana é visível ao Integrante citado, ao Líder do Subsistema de referência, ao Capitão e aos Gestores.
- O autor pode corrigir uma Observação publicada enquanto tiver acesso ao Subsistema de referência. Capitão e Gestor também podem corrigi-la. A correção exige motivo e preserva a versão anterior. O Integrante citado tem acesso de consulta.
- Ocorrência é relato confidencial. O Líder pode encaminhar uma Ocorrência do próprio Subsistema e recebe confirmação de envio, sem acesso posterior ao relato. Capitão e Gestor podem consultar a Ocorrência e emitir Advertência, que é uma medida administrativa formal.
- Emissão e comunicação da Advertência são ações distintas. Após a comunicação no ERP, o Integrante pode consultar o texto formal da própria Advertência. O ERP registra quando ela foi disponibilizada. A Ocorrência de origem e as notas internas permanecem confidenciais.
- O Integrante pode confirmar ciência da Advertência comunicada. O ERP registra data e hora. Ciência registra conhecimento e não exige concordância com o conteúdo.
- Capitão ou Gestor pode revogar uma Advertência comunicada com justificativa e emitir outra, se necessário. O texto original é preservado e continua visível ao Integrante com situação Revogada.
- Uma Advertência sempre exige motivo formal. O vínculo com uma Ocorrência é opcional e fica visível apenas para Capitão e Gestores.
- Capitão ou Gestor pode encerrar uma Ocorrência sem Advertência. O relato e a decisão de encerramento ficam no histórico confidencial.
- Para cadastrar uma Reunião, Competição ou Evento geral, é obrigatório informar tipo, nome e data e hora de início. Término, local e descrição podem ser preenchidos depois.
- Capitão e Gestor podem criar e editar compromissos de todos os tipos. Líder pode criar e editar Reuniões do próprio Subsistema. A atribuição da chamada permite registrar Participações e a edição do Evento segue as permissões do perfil.
- Capitão e Gestor podem cancelar qualquer compromisso. Líder pode cancelar uma Reunião exclusiva do próprio Subsistema. Em Reuniões conjuntas, o cancelamento cabe ao Capitão ou ao Gestor. O motivo é obrigatório para todos os perfis autorizados.
- Um compromisso cancelado permanece no histórico como Cancelado, com motivo, autor e data do cancelamento. Os registros de Participação existentes permanecem consultáveis conforme as permissões. O cancelamento bloqueia novos lançamentos e exclui o compromisso dos indicadores de Participação.
- O Orientador consulta Competições atuais e históricas, com dados operacionais autorizados e Participação apenas agregada. O recorte da agenda segue a página do módulo no Figma.
- Capitão e Gestor registram e atualizam Inscrições em Competições. O Integrante consulta a própria Inscrição. A primeira entrega não inclui autoinscrição. As situações são Pendente, Confirmada e Cancelada. Só Inscrições confirmadas entram na lista sugerida da chamada. O cancelamento preserva o registro da Inscrição e a Participação já lançada no histórico.
- Capitão e Gestor gerenciam a Logística e podem delegá-la a um Líder ativo para um Evento específico. A delegação é independente da permissão de chamada. Dados operacionais, incluindo transporte, hospedagem, alimentação e apoios, ficam no Evento. Custos e pagamentos ficam no Financeiro.
- Capitão e Gestor registram vários Resultados por edição, por prova, categoria ou modalidade. Cada lançamento exige uma modalidade e pelo menos um destes dados: posição, pontuação ou descrição do resultado.
- A remarcação mantém o mesmo Evento, preserva a data anterior no histórico e conserva Inscrições e Participações Previstas. O motivo é opcional na remarcação comum. Se já houver lançamento de Presente, Ausente ou Justificada, mesmo pendente de Validação, somente Capitão ou Gestor pode corrigir a data e deve justificar a alteração. Uma nova edição exige outro cadastro.
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
- Sinalizar Atividades Não iniciadas ou Pausadas a partir do início do dia que marca a metade do período planejado, contando as datas inicial e final. Em uma Sprint do dia 1 ao dia 15, o alerta começa no dia 8. Para uma Atividade Em andamento, o atraso aparece a partir do dia seguinte ao prazo. A referência é o horário de Brasília. Transferida é uma indicação separada do alerta de pouco progresso.
- Capitão ou Gestor confirma o início da Sprint. Se outra estiver em andamento, o ERP exige seu encerramento antes de iniciar a próxima. As datas previstas continuam registrando o planejamento.
- Pelo menos um responsável ativo é obrigatório para alocar uma Atividade em uma Sprint. Uma Atividade no Backlog pode ficar sem responsável.
- A Atividade sai do Backlog assim que recebe uma Alocação, mesmo em uma Sprint ainda planejada. Se for retirada sem outro destino, retorna ao Backlog.
- A Estimativa de esforço aceita somente 1, 2, 3, 5, 8, 13 e 21. Permanece opcional no Backlog e obrigatória para alocar.
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
- Capitão e Gestor Financeiro aprovam a mesma Revisão e o mesmo Orçamento. Se indicarem opções diferentes, a Revisão continua Aguardando aprovação até coincidirem. A troca de Capitão ou Gestor Financeiro exige a decisão do titular atual quando a aprovação conjunta ainda estiver pendente. A decisão anterior permanece no histórico, e Compras já aprovadas conservam a aprovação.
- O Solicitante pode cancelar a própria Solicitação Planejada, Aguardando aprovação ou Reprovada. Depois da aprovação e antes do Pagamento, só Capitão ou Gestor Financeiro pode cancelar. Todo cancelamento exige motivo.
- O Solicitante vê os preços e Orçamentos das próprias Solicitações enquanto estiverem em andamento, inclusive quando Reprovadas e passíveis de correção e reenvio. Quando Realizada/Paga ou Cancelada, conserva o acesso aos itens, à situação e ao histórico permitido. O servidor também filtra links, anexos e justificativas que revelem valores restritos.
- A primeira entrega usa BRL. A comparação usa o total aprovado e o total a pagar, ambos com frete. Aumento do total ou troca de Fornecedor antes do Pagamento exige nova Revisão e nova aprovação. Desconto para os mesmos itens e quantidades no mesmo Fornecedor pode ser registrado no Pagamento com observação.
- Capitão ou Gestor Financeiro pode corrigir um Pagamento registrado por engano, cancelando a Saída com motivo, autor e data. A Saída cancelada permanece no histórico e a Compra volta para Aprovada para receber o Pagamento correto.
- Quando o dinheiro efetivamente saiu e depois voltou, registrar Reembolso total ou parcial como Entrada vinculada à Compra, preservando a Saída original. A soma dos Reembolsos fica limitada ao valor efetivamente pago.
- Uma Compra aprovada com data prevista de Pagamento gera Previsão financeira. O Pagamento realiza a Previsão e a vincula à Saída. O cancelamento da Compra antes do Pagamento cancela a Previsão.
- Qualquer Integrante ativo pode abrir Solicitação de compra para o próprio Subsistema. Solicitações gerais da equipe ou de vários Subsistemas ficam com Capitão e Gestor.
- O Solicitante pode retirar uma Revisão da análise para preparar outra. A Revisão enviada e as decisões permanecem no histórico. O reenvio inicia uma nova aprovação.
- Uma Reprovação encerra a análise da Revisão imediatamente e exige justificativa. O Solicitante pode corrigir e reenviar. Na ausência de Gestor Financeiro, uma Solicitação enviada pode ficar aguardando análise e o ERP indica o motivo da pendência.
- Capitão ou Gestor Financeiro registra o Pagamento com data, valor efetivo e referência. O comprovante pode ser vinculado depois, conforme as permissões de Documentação. A primeira entrega tem um Pagamento integral por Compra, sem parcelamento.
- Capitão e Gestor Financeiro podem registrar Entradas, Saídas e Previsões avulsas com categoria compatível, data, valor e descrição. A Saída de uma Compra vinculada nasce do seu Pagamento.
- Uma Compra compartilhada aparece com seu valor integral em cada visão filtrada por Subsistema, com indicação de que é compartilhada. O total geral da equipe conta o valor uma única vez.

### Documentação

- Planejar o armazenamento em um Drive compartilhado do Google Workspace da equipe, acessado pelo backend, com áreas restritas para Documentos confidenciais. Confirmar a disponibilidade de uma área de teste antes da validação com arquivos reais. O desenvolvimento com mocks e testes com adaptador simulado pode avançar antes dessa confirmação.
- Documentos financeiros confidenciais, inclusive metadados de busca, conteúdo, versões e downloads, ficam restritos a Capitão e Gestor Financeiro. O acesso contextual do Solicitante aos próprios Orçamentos em análise continua limitado ao fluxo de Compra.
- Documento comum de equipe fica disponível a todos os perfis ativos, incluindo Orientador. Documento comum restrito a Subsistemas pode ser consultado por Capitão, Gestores e Integrantes dos Subsistemas indicados. Vínculos de outros módulos preservam as permissões do Documento.
- Quem envia só escolhe níveis de confidencialidade que pode consultar. Capitão e Gestor podem reclassificar dentro das próprias permissões. Reclassificação de ou para Financeiro confidencial fica com Capitão ou Gestor Financeiro e tem histórico.
- Capitão ou Gestor seleciona os arquivos existentes em pasta autorizada, confirma a categoria e a confidencialidade e importa sem duplicar o arquivo. O ERP identifica arquivos já importados.
- A importação de um Documento confidencial fica bloqueada enquanto o compartilhamento do arquivo no Drive permitir acesso mais amplo do que a classificação escolhida.
- O ERP verifica autorização antes de abrir ou baixar cada versão. Arquivos confidenciais ficam em área restrita no Drive, sem compartilhamento aberto por link.
- Ampliar o acesso exige conferir o conteúdo atual e o histórico. Se apenas o conteúdo atual puder ser divulgado, cadastrar uma cópia revisada como outro Documento e manter o original restrito.
- Uma atualização cria uma versão no mesmo cadastro. Vínculos permanecem no Documento, e cada versão guarda autor e data.
- Listar as versões disponibilizadas pela API do Drive e preservar no histórico do ERP as versões já registradas. Indicar “Versão indisponível no Drive” para uma versão registrada que não pode mais ser baixada.
- Capitão e Gestor criam e renomeiam Categorias de documento. Os demais Perfis selecionam Categorias existentes quando enviam um Documento.
- Líder pode solicitar exclusão com motivo. Capitão ou Gestor autorizado decide. Aprovada a exclusão, o arquivo sai da biblioteca e vai para a lixeira quando o Drive confirma. Solicitação e decisão permanecem no histórico.
- O autor do envio enquanto mantiver acesso ao Documento, Capitão ou Gestor autorizado pode publicar nova versão do arquivo.
- Capitão ou Gestor autorizado pode restaurar o Documento enquanto o arquivo estiver na lixeira do Drive. A restauração recupera cadastro, vínculos e permissões anteriores, com registro no histórico.
- Uma falha do Drive é comunicada e permite nova tentativa. Em uma atualização, a versão anterior continua disponível e a nova só aparece após confirmação do Drive.

### Governança

- Capitão define a vigência imediata ou futura ao publicar. A nova Versão fica disponível para leitura na publicação. A anterior continua vigente até a data escolhida.
- A Ciência registra que o Usuário conhece o conteúdo. O Aceite registra a concordância. É possível registrar só a Ciência e aceitar depois ou registrar os dois juntos. O ERP guarda as datas separadas no mesmo registro de Usuário e Versão. Enquanto faltar o Aceite, a pendência continua aberta.
- Cada nova Versão exige novo Aceite dos Usuários ativos, inclusive de quem a publicou. Se a vigência for futura, eles podem aceitar antecipadamente e veem a data de início na pendência. Quem entra depois recebe as Versões vigentes no ingresso e recebe a nova quando ela entrar em vigor.
- Contas desativadas saem do acompanhamento de pendências atuais e conservam seus registros no histórico. Ao reativar, exigir apenas os Aceites ainda faltantes das Versões vigentes. Se uma Versão futura entrar em vigor depois da reativação, ela passa a ser exigida naquele momento.
- Governança fornece as pendências de cada Usuário. Capitão e Gestor acompanham as pendências da equipe no módulo. O Dashboard exibe as pendências do próprio Usuário sem interromper o uso do ERP.
- Capitão e Gestor podem editar Rascunhos. Rascunho preparado pelo Gestor precisa estar Pronto para publicação para o Capitão publicar. Alterações no conteúdo retiram a marcação. O Capitão também pode publicar diretamente o Rascunho que ele próprio preparou.
- Corrigir conteúdo publicado exige nova Versão e publicação pelo Capitão. O conteúdo anterior e seus Aceites são preservados.
- Cada Documento de governança pode ter uma única Versão publicada com vigência futura. Antes do início, o Capitão pode cancelar sua entrada em vigor com justificativa. Preservar a Versão, a justificativa e os Aceites registrados no histórico, encerrar suas pendências e manter a Versão anterior vigente, quando houver.
- Capitão pode encerrar a vigência de uma norma sem substituta, com justificativa. A norma e os Aceites continuam no histórico e deixam de gerar pendências.

### Dashboard e Indicadores

- A primeira entrega inclui Sprint atual, Atividades atribuídas e atrasadas, Frequência e horas validadas, próximos Eventos e Aceites pendentes. Capitão e Gestor Financeiro também consultam saldo e Previsão de caixa quando disponíveis. Indicadores de compras, reuniões recentes e Documentação ficam para entregas posteriores.
- O período é definido por cartão. O usuário seleciona a Sprint para Atividades e o mês para Frequência e horas, com a Sprint atual e o mês atual como padrões. A Agenda mostra os próximos 30 dias. Aceites, saldo e Previsão de caixa refletem a situação atual.
- Cada cartão e atalho aplica as permissões do módulo de origem. Líder começa pelo próprio Subsistema, Membro pelos próprios dados e Orientador consulta agregados da equipe ou de Subsistemas ativos, com a Agenda limitada a Competições. Cada Usuário consulta somente seus próprios Aceites pendentes no Dashboard.
- Exibir zero quando há dados e o resultado é zero, e “Sem dados no período” quando faltam registros elegíveis. Para Frequência sem Registros de presença elegíveis, mostrar “Sem dados para calcular”. Em caso de falha, o cartão afetado mostra “Indisponível no momento” e oferece nova tentativa. Os demais cartões seguem disponíveis.
- Exibir um alerta em destaque entre os itens que o Usuário pode resolver, na ordem de Atividade atrasada, pouco progresso na Sprint e Aceite pendente. Os demais avisos continuam nos respectivos cartões enquanto a pendência existir. O atalho leva à ação autorizada no módulo de origem. A primeira entrega não inclui dispensa manual.
- O frontend pode avançar com mocks após o contrato compartilhado. Cada cartão passa a usar dados reais quando sua própria fonte estiver pronta.

## Dependências entre entregas

- O Módulo 1 fornece identidade, perfis, subsistemas e a regra do Gestor Financeiro. As matrizes antigas que tratam Financeiro como perfil independente precisam ser reconciliadas com essa regra.
- As issues devem ligar a definição de Evento e de responsável ao registro de Participação. A V11 já modela Validação e histórico para Participações em Eventos. As operações, transições e autorizações continuam a cargo das futuras entregas de backend.
- A integração principal de Pessoas e Participação entrega chamada de turno, Frequência, Carga horária, Diário, Observações, Ocorrências e Advertências sem esperar pelo cadastro de Eventos ou pelo Dashboard. O contrato de Participação em Eventos pode ser planejado e verificado com Eventos e responsáveis de teste.
- A conexão da chamada à tela de Evento entra nas issues do Módulo 6, quando ele tiver cadastro de Eventos, atribuição de responsáveis e Inscrições para sugerir participantes de Competições. O Módulo 4 continua responsável pelo lançamento, pela Validação e pelo histórico de Participação. A conexão real não é critério de aceite da integração principal do Módulo 4.
- Os indicadores do Dashboard dependem dos registros validados e das regras de visibilidade de cada módulo. O consumo dos dados pelo Dashboard não bloqueia Pessoas e Participação.
- Documentação fornece vínculos a arquivos para os módulos que os exibem. Confirmar em cada fluxo se o arquivo é obrigatório ou se a associação pode entrar em uma entrega posterior.
- A integração principal de Competições e Eventos entrega agenda, cadastro, Inscrições, Logística e Resultados pela API do próprio módulo. A chamada real na tela do Evento depende da entrega de Participação em Eventos do Módulo 4. Os vínculos com arquivos e dados financeiros têm entregas próprias, dependem de Documentação e Gestão Financeira, respectivamente, e preservam as permissões de origem.
- A integração principal de Governança usa sua própria API e as contas do Módulo 1. O cartão de Aceites pendentes do Módulo 8 consome a [consulta pessoal do Módulo 7](../modulo-7_governanca/issues/06-backend-ciencia-aceite-pendencias.md).
- Cada cartão do Dashboard depende dos contratos e das permissões da própria fonte. Para Sprint, Atividades e alertas, usar a [consulta de Sprints do Módulo 2](../modulo-2_atividades-e-sprints/issues/04-backend-planejamento-alocacao.md) e suas [indicações autorizadas](../modulo-2_atividades-e-sprints/issues/06-backend-alertas-indicacoes.md). Para saldo e Previsão de caixa, usar as [consultas do Módulo 3](../modulo-3_gestao-financeira/issues/07-backend-saldo-previsao-relatorios.md). Para Frequência e horas validadas, usar os [indicadores do Módulo 4](../modulo-4_pessoas-e-participacao/issues/03-backend-validacao-indicadores.md). Para próximos Eventos, usar a [Agenda do Módulo 6](../modulo-6_competicoes-e-eventos/issues/02-backend-agenda-cadastro.md). Os indicadores da biblioteca ficam para uma entrega posterior e dependem do Módulo 5.

## Escopo das issues

- Usar o modelo relacional v6 e as migrações Flyway V1 a V11 como base das issues. A instalação limpa e a atualização da V10 foram verificadas no PostgreSQL 16.4.
- As issues dos módulos partem do esquema pronto e não incluem criação ou alteração de tabelas, colunas, índices, restrições ou migrações. As issues de backend podem consultar e gravar nas tabelas existentes, implementar regras de negócio e testar a integração com o banco.
- A [base de modelagem por módulo](../../docs/projeto/modelagem.md#base-das-especificações-dos-módulos) identifica o que a V11 já fornece e o que cabe aos serviços. Use essa separação ao escrever as especificações e os critérios de aceite.
- Entregas posteriores que dependem de outro módulo usam `Status: blocked` enquanto a dependência estiver indisponível. Em `Blocked by:`, registrar a entrega externa exata e as dependências internas. Separar essas issues das entregas que podem avançar com o contrato acordado e mocks.

## Como usar este mapa

As especificações e dependências foram revisadas e as issues de implementação foram publicadas. A ordem de execução segue as dependências de cada issue. Depois de definir o contrato compartilhado, frontend e backend podem avançar em paralelo onde a entrega prevê mocks.

No planejamento local, use o mapa para localizar a origem de uma decisão. Para executar trabalho em equipe, consulte o texto da issue publicada e o status no quadro. Registre regras duradouras no [glossário](../../CONTEXT.md), nos [guias dos módulos](../../docs/projeto/modulos/README.md) ou nos [ADRs](../../docs/adr/), conforme o assunto.
