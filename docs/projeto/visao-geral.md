# Visão geral do projeto

O ProcoBaja ERP é um sistema interno proposto para reunir as informações operacionais e administrativas da equipe PROCOBAJA, projeto de extensão Baja SAE da UTFPR em Cornélio Procópio. A proposta busca reduzir a dispersão entre ferramentas de atividades, planilhas e armazenamento de documentos e preservar o histórico da equipe ao longo da entrada e saída de integrantes.

## Origem e escopo

Esta síntese é derivada do [Documento de Projeto de Software de 2026](documento-de-projeto.pdf), páginas 3–10. O PDF é uma **cópia de referência da versão recebida**, sem data de revisão identificada no conteúdo consultado. Os requisitos descrevem o sistema pretendido, não a implementação atual. Em caso de dúvida sobre regras ou permissões resumidas aqui, consulte a seção correspondente do PDF e registre decisões posteriores de forma explícita.

O escopo contempla oito módulos:

1. Equipe e Subsistemas: usuários, perfis, subsistemas e vínculos.
2. Atividades e Sprints: backlog, planejamento, Kanban e acompanhamento.
3. Gestão Financeira: solicitações, compras, entradas, saídas e previsões.
4. Pessoas e Participação: presenças, horas, diário e registros de participação.
5. Documentação: organização, versões e integração prevista com Google Drive.
6. Competições e Eventos: reuniões, eventos, competições e informações associadas.
7. Governança: normas, versões, publicação e aceite.
8. Dashboard e Indicadores: visões e alertas conforme permissões.

Os seis perfis previstos são Capitão/Administrador, Gestor, Financeiro, Líder, Membro e Orientador. O acesso depende do perfil, da operação, do subsistema e da confidencialidade dos dados. As regras detalhadas por módulo estão no PDF, seção 4.1.1–4.1.8, páginas 19–35.

## Objetivos e limites

O objetivo é centralizar informações administrativas e operacionais e facilitar o acompanhamento da equipe. Os objetivos específicos incluem organizar integrantes e subsistemas, planejar atividades, acompanhar compras e caixa, registrar participação, preservar documentos e histórico de eventos e disponibilizar indicadores conforme as permissões.

O PDF descreve uma aplicação web de uso interno; não prevê inicialmente acesso do público externo nem autenticação institucional UTFPR. React, Spring Boot, PostgreSQL e integração com Google Drive são escolhas previstas. O Drive armazena arquivos; o ERP mantém metadados e relações. A indisponibilidade do serviço externo precisa ser tratada sem comprometer a consistência do restante do sistema. O prazo de 12 semanas e seis sprints de desenvolvimento é uma previsão do documento, não uma garantia atual. Veja seções 2.1–2.2 e 3.1–3.3, páginas 6–16.

As **sprints de desenvolvimento do ERP** do cronograma acadêmico não devem ser confundidas com as **sprints da equipe PROCOBAJA** gerenciadas pelo produto, cuja duração prevista é de 15 dias.

## Situação e leitura das fontes

O PDF é um retrato dos requisitos e modelos propostos, não um inventário do que está pronto. A seção 4.4 contém protótipos descritos como de baixa fidelidade; o Figma pode evoluir independentemente. O capítulo 5 apresenta análise e modelagem; o documento informa 50 tabelas, 345 atributos e 19 domínios enumerados no modelo daquela versão. A seção 5.1.2.10 destaca que índices parciais, permissões, três orçamentos, duas aprovações e integridade transacional exigem SQL complementar e/ou validação no backend. Consulte as páginas 57–87 e os arquivos DBML e SQL em `docs/diagramas/` antes de implementar.

O documento acadêmico não contém revisão identificada além do ano 2026. A cópia em `documento-de-projeto.pdf` corresponde ao arquivo fornecido para esta documentação; isso não estabelece uma data de aprovação. Se modelos, código ou decisões posteriores divergirem, registre a divergência e valide a fonte vigente com a equipe, sem presumir que o PDF ou um protótipo esteja automaticamente atualizado.

## Documentação relacionada

- [Detalhamento dos oito módulos](modulos/README.md).
- [Requisitos funcionais e prioridades](requisitos/funcionais.md).
- [Requisitos não funcionais](requisitos/nao-funcionais.md).
- [Vocabulário do domínio](../../CONTEXT.md).
- [Guia da modelagem e integridade](modelagem.md).
- [Diagramas e modelo relacional](../diagramas/).
- [Arquitetura do frontend](../../frontend/ARCHITECTURE.md) e [arquitetura do backend](../../backend/ARCHITECTURE.md).
- [Design system no Figma](https://www.figma.com/design/NhEuGEDcNqW2NNMnP614YV/PROCOBAJA-ERP-%C2%B7-UI-Kit---Design-System?node-id=0-1).

O PDF contém protótipos e diagramas de uma versão do projeto; os arquivos editáveis e as implementações podem evoluir. Os capítulos de implementação, considerações finais e referências do PDF recebido ainda contêm instruções de preenchimento, e não devem ser interpretados como descrição de funcionalidades concluídas.
