# Módulo 5 · Documentação

Status: ready-for-agent

## Problema

A equipe precisa encontrar, compartilhar e atualizar Documentos pelo ERP, com controle sobre quem pode consultar o conteúdo e o histórico. Arquivos antigos já podem existir no Google Drive, e importá-los sem duplicação precisa preservar suas referências. A entrada de Documentação já existe no ERP, mas ainda exibe uma tela provisória.

## Solução

Entregar uma biblioteca de Documentos com busca, filtros, Categorias, envio, importação, versões, Associações e fluxo de exclusão e restauração. O Google Drive guarda os arquivos, e o ERP mantém metadados, permissões, Associações e histórico. A biblioteca funciona com os dados de Equipe e Subsistemas já disponíveis. A conexão às telas de Compras, Atividades e Eventos entra nas entregas dos módulos consumidores.

## Histórias de usuário

1. Como usuário ativo, quero listar e filtrar os Documentos que posso acessar para encontrar o arquivo certo.
2. Como Orientador, quero consultar Documentos comuns da equipe para acompanhar o projeto.
3. Como Integrante, quero consultar Documentos comuns restritos aos meus Subsistemas autorizados.
4. Como Capitão ou Gestor, quero consultar Documentos comuns de Subsistemas e Documentos administrativos confidenciais conforme meu acesso.
5. Como Capitão ou Gestor Financeiro, quero localizar, abrir e baixar Documentos financeiros confidenciais autorizados.
6. Como usuário sem acesso financeiro, quero que nomes, versões e arquivos restritos fiquem fora da minha consulta.
7. Como usuário ativo, quero enviar um Documento com Categoria e classificação dentro das minhas permissões.
8. Como usuário que envia um Documento comum restrito, quero indicar os Subsistemas que terão acesso.
9. Como Capitão ou Gestor, quero criar e renomear Categorias para organizar a biblioteca.
10. Como usuário que envia arquivos, quero escolher entre as Categorias existentes para manter a organização da biblioteca.
11. Como Capitão ou Gestor autorizado, quero selecionar arquivos de uma pasta autorizada do Drive e classificá-los antes da importação.
12. Como responsável pela importação, quero saber se um arquivo já foi importado para evitar duplicação.
13. Como responsável pela importação, quero entender quando o compartilhamento existente impede classificar um arquivo como confidencial.
14. Como Capitão ou Gestor autorizado, quero alterar a classificação dentro do meu escopo e consultar o histórico da mudança.
15. Como Capitão ou Gestor Financeiro, quero reclassificar um Documento de ou para Financeiro confidencial dentro das permissões da operação.
16. Como responsável pela reclassificação, quero conferir o conteúdo atual e as versões anteriores antes de ampliar o acesso.
17. Como responsável pela divulgação, quero cadastrar uma cópia revisada separada quando só o conteúdo atual puder ser publicado.
18. Como autor do envio com acesso, quero publicar uma nova Versão no mesmo Documento para manter suas Associações.
19. Como Capitão ou Gestor autorizado, quero publicar uma Versão em um Documento que posso gerenciar.
20. Como usuário autorizado, quero consultar o histórico, com autoria e data das versões registradas no ERP.
21. Como usuário autorizado, quero abrir ou baixar uma versão que o Drive disponibilize.
22. Como usuário autorizado, quero saber quando uma versão do histórico já não está disponível para download.
23. Como usuário autorizado, quero localizar Documentos associados a um Subsistema sem ganhar acesso a arquivos restritos.
24. Como usuário de outro módulo, quero consultar um Documento associado apenas quando eu também tiver permissão em Documentação.
25. Como Líder, quero solicitar exclusão de um Documento do meu contexto com motivo.
26. Como Capitão ou Gestor autorizado, quero analisar solicitações de exclusão e consultar o histórico da decisão.
27. Como Capitão ou Gestor autorizado, quero confirmar a ida à lixeira e saber se o Drive ainda não concluiu a operação.
28. Como Capitão ou Gestor autorizado, quero restaurar um Documento que continua na lixeira e recuperar seu cadastro, suas Associações e suas permissões anteriores.
29. Como usuário autorizado, quero tentar de novo uma operação que falhou no Drive e saber qual conteúdo está disponível nesse momento.
30. Como usuário, quero usar a biblioteca no desktop e no mobile e distinguir carregamento, biblioteca vazia e falha de consulta.

## Decisões de implementação

### Acesso e classificação

| Classificação e escopo | Quem pode consultar |
| --- | --- |
| Comum de equipe | Todos os Perfis ativos, incluindo Orientador. |
| Comum restrito a Subsistemas | Capitão, Gestores e Integrantes dos Subsistemas indicados. |
| Administrativo confidencial | Capitão e Gestores. |
| Financeiro confidencial | Capitão e Gestor Financeiro. |

- O servidor aplica o escopo à busca, aos filtros, aos metadados, à consulta, ao histórico e à abertura ou download de cada Versão. O acesso a um Documento associado exige a permissão de Documentação. Uma Associação temática a Subsistema, Atividade, Evento ou Compra não concede acesso por si só.
- Gestor Financeiro é o Gestor ativo associado ao Subsistema Financeiro. A exceção para o Solicitante consultar os próprios Orçamentos durante a análise vale no fluxo de Compra e não concede acesso à biblioteca financeira confidencial.
- Quem envia escolhe uma Categoria existente e uma classificação que possa consultar. Capitão e Gestor criam e renomeiam Categorias. Categoria é classificação temática e não interfere nas permissões.
- Capitão e Gestor podem reclassificar Documentos dentro das permissões. Mudanças de ou para Financeiro confidencial são exclusivas de Capitão ou Gestor Financeiro. Registrar a classificação anterior, a nova classificação, o autor e a data no histórico.
- Antes de ampliar acesso, exigir conferência do conteúdo atual e do histórico, pois as Versões seguem a classificação do Documento. Se só o conteúdo atual puder ser divulgado, cadastrar uma cópia revisada como Documento separado e conservar o original restrito.

### Drive, envio e versões

- Usar um Drive compartilhado do Google Workspace para a equipe, acessado pelo backend. Manter arquivos confidenciais em áreas restritas e sem acesso público por link. A disponibilidade da área de teste e da identidade que o backend usará no Drive deve ser confirmada para verificar arquivos reais. Desenvolvimento e testes com Drive simulado podem avançar antes disso.
- O ERP guarda metadados, identificadores do Drive e histórico. O conteúdo dos arquivos fica no Drive. Downloads e aberturas passam pela autorização do ERP a cada solicitação.
- Capitão ou Gestor seleciona arquivos de uma pasta autorizada, confirma Categoria e confidencialidade e importa sem duplicar o arquivo. O ERP identifica um arquivo já importado pelo identificador do Drive. Se o compartilhamento efetivo de um arquivo confidencial for mais amplo que a classificação pretendida, bloquear a importação até ajustar o acesso na origem.
- Uma atualização cria uma Versão no mesmo Documento, preservando suas Associações. O autor do envio pode publicar nova Versão enquanto conservar acesso ao Documento. Capitão ou Gestor autorizado também pode publicar. Registrar autor e data.
- Listar as Versões que a API do Drive disponibiliza, inclusive de arquivos existentes antes do ERP. Preservar no ERP as Versões já registradas. Quando uma delas já não puder ser baixada, apresentar “Versão indisponível no Drive”. A lista oferecida pelo Drive pode ser incompleta.
- Uma falha do Drive deve ter feedback e permitir nova tentativa. Uma nova Versão só aparece depois da confirmação do Drive. Enquanto a atualização não for confirmada, a Versão anterior permanece como a versão publicada no ERP.

### Exclusão e restauração

- Líder pode solicitar exclusão de Documento do próprio contexto com motivo. Capitão ou Gestor autorizado pode analisar e decidir. Preservar solicitação, justificativa, decisão e histórico.
- A aprovação não indica por si só que o arquivo foi para a lixeira. Só retirar da biblioteca ativa e registrar a exclusão como executada quando o Drive confirmar a operação. Se houver falha, apresentar o estado e permitir tentativa posterior.
- Capitão ou Gestor autorizado pode restaurar enquanto o arquivo estiver na lixeira do Drive. Após confirmação, recuperar o cadastro, as Associações e as permissões anteriores e registrar a restauração no histórico.

### Contrato compartilhado

- Frontend e backend acordam consultas, filtros, comandos, campos, capacidades e erros. O contrato distingue Documento, Versão, Associação, nível de acesso e estado de exclusão. Prever respostas para arquivo já importado, compartilhamento incompatível, Versão indisponível, falha temporária do Drive e exclusão ainda não confirmada.
- Reusar sessão, Perfis e Subsistemas do Módulo 1. Usar o padrão HTTP e CSRF do ERP. O frontend pode avançar com mocks isolados após o contrato, e o backend pode testar com adaptador do Drive simulado. A última entrega principal liga o frontend à API do próprio módulo.
- Expor a consulta autorizada de Documentos para uso por módulos consumidores. O Módulo 5 entrega a biblioteca e a Associação a Subsistemas. As conexões específicas com Atividades, Eventos e Compras ficam nas entregas desses fluxos. A API de consulta e autorização destrava a integração de comprovantes e notas fiscais do Módulo 3.
- Usar a entrada de Documentação existente na sidebar e seguir o design system e os fluxos responsivos do Figma. Onde o desenho mostrar Financeiro como Perfil separado ou divergir das regras aprovadas, aplicar a matriz desta especificação.
- Usar o DBML v6 e o esquema Flyway V1–V11 da develop. Permissões por Subsistema, Associações temáticas, Versões e histórico de operações usam as estruturas já existentes.

## Decisões de verificação

- No backend, verificar comportamento pela API autenticada com PostgreSQL e Flyway, seguindo os testes de integração do Módulo 1. Simular o Drive na fronteira do adaptador. Cobrir Perfis distintos, dois Subsistemas, busca, filtros, metadados, consulta de Versão e download. Confirmar que um vínculo temático e um link conhecido não ampliem o acesso.
- Verificar importação sem duplicação, classificação incompatível com o compartilhamento, ampliação de acesso com conferência de histórico, nova Versão com Associações intactas e preservação de histórico quando o Drive não retornar mais uma versão.
- Verificar solicitação, decisão, falha e confirmação de ida à lixeira, e restauração. Conferir o estado no ERP antes e depois de cada resposta do Drive. Uma atualização sem confirmação deve manter a Versão anterior como publicada.
- No frontend, verificar fluxos pelo contrato dos adaptadores, com capacidades por Perfil, carregamento, vazio, erro e nova tentativa. Conferir busca, filtros, histórico, feedback de importação e exclusão, desktop, mobile, teclado e temas claro e escuro.
- Para a integração externa, usar uma área de teste restrita no Drive compartilhado. Exercitar envio, importação, nova Versão, consulta e download autorizados, lixeira e restauração. Conferir que a autorização do ERP e as permissões do Drive não concedam acesso indevido ao arquivo. Essa verificação depende do ambiente externo, sem depender da implementação de outros módulos do ERP.

## Fora de escopo

- Alterar o esquema do banco ou as migrações, incluindo tabelas, colunas, índices e restrições. O limite vale para as issues funcionais de todos os módulos.
- Implementar telas consumidoras de Documentação em Atividades, Eventos ou Compras nesta entrega. Cada consumidor integra o vínculo e mantém a autorização de origem.
- Prometer recuperação de Versões que o Drive já não disponibiliza ou manter uma cópia binária de cada Versão no ERP.
- Gravar as issues ou implementar código nesta etapa. A divisão de frontend e backend será proposta para revisão.

## Referências

- [Decisões aprovadas](../modulos-restantes/map.md#documentação), [dependências entre módulos](../modulos-restantes/map.md#dependências-entre-entregas) e [glossário](../../CONTEXT.md#documentação).
- [Guia de Documentação](../../docs/projeto/modulos/documentacao.md), [requisitos RF23–RF25 e RF32](../../docs/projeto/requisitos/funcionais.md) e [modelagem vigente](../../docs/projeto/modelagem.md#base-das-especificações-dos-módulos).
- [Documentação no Figma](https://www.figma.com/design/NhEuGEDcNqW2NNMnP614YV/PROCOBAJA-ERP-%C2%B7-UI-Kit---Design-System?node-id=127-4241), [Drives compartilhados](https://developers.google.com/workspace/drive/api/guides/about-shareddrives) e [revisões da API do Drive](https://developers.google.com/workspace/drive/api/guides/manage-revisions).

## Comments
