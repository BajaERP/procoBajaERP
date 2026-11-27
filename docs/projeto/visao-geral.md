# Visão geral do projeto

O ProcoBaja ERP é o sistema interno da equipe PROCOBAJA, projeto de extensão Baja SAE da UTFPR em Cornélio Procópio. O objetivo é reunir as informações operacionais e administrativas da equipe e preservar seu histórico entre gestões.

## Escopo

O sistema reúne oito módulos para organizar a composição da equipe, planejar atividades, acompanhar compras e caixa, registrar participação, manter documentos e eventos, publicar normas e exibir indicadores conforme as permissões de cada pessoa. As Sprints da equipe têm duração sugerida de 15 dias. O cronograma acadêmico descreve as entregas de desenvolvimento do ERP. [Índice dos módulos](modulos/README.md) · [Documento de Projeto de Software, páginas 3–16](documento-de-projeto.pdf#page=3)

Cada conta tem um Perfil. São cinco Perfis no ERP, Capitão, Gestor, Líder, Membro e Orientador. O Gestor Financeiro é o Gestor ativo associado ao Subsistema Financeiro. O servidor aplica as permissões de cada operação conforme Perfil, Subsistema, responsabilidade e confidencialidade. A autenticação usa RA ou SIAPE numérico e senha própria do ERP. [Vocabulário do domínio](../../CONTEXT.md) · [ADR do Gestor Financeiro](../adr/0002-gestor-financeiro-derivado-do-subsistema.md) · [Equipe e Subsistemas](modulos/equipe-e-subsistemas.md)

A aplicação usa React, Spring Boot e PostgreSQL. A integração planejada com Google Drive guarda arquivos em um Drive compartilhado e mantém metadados, histórico e vínculos no ERP. [Arquitetura do frontend](../../frontend/ARCHITECTURE.md) · [Arquitetura do backend](../../backend/ARCHITECTURE.md) · [Documentação](modulos/documentacao.md)

## Estado da entrega

Equipe e Subsistemas está implementado no frontend e no backend, com autenticação, gestão de integrantes e subsistemas, sucessão do Capitão, identificação do Gestor Financeiro e consulta de auditoria. O desenvolvimento local também oferece modo demonstrativo. [Equipe e Subsistemas](modulos/equipe-e-subsistemas.md) · [Arquitetura do frontend](../../frontend/ARCHITECTURE.md)

Os módulos 02 a 08 estão planejados. A navegação já oferece entradas com telas provisórias, e o esquema Flyway chega à V11, que fornece as estruturas de banco para as próximas entregas. O acompanhamento compartilhado das issues e suas dependências fica no GitHub. [Guia de modelagem](modelagem.md) · [Projeto no GitHub](https://github.com/orgs/BajaERP/projects/2) · [Issues do repositório](https://github.com/BajaERP/procoBajaERP/issues)

## Referências do projeto

- O [Documento de Projeto de Software](documento-de-projeto.pdf), datado de 2026, preserva o escopo, os requisitos e a modelagem acadêmicos. Consulte a tabela 2 para prioridades e as seções 4.1.1 a 4.1.8 para as matrizes originais de permissões.
- As páginas dos [módulos](modulos/README.md) registram as regras vigentes, incluindo as decisões posteriores ao PDF. Consulte também o [vocabulário do domínio](../../CONTEXT.md) e os [ADRs](../adr/).
- Os [requisitos funcionais](requisitos/funcionais.md) e [não funcionais](requisitos/nao-funcionais.md) permitem localizar o requisito e sua fonte.
- Os [diagramas](../diagramas/) e o [guia de modelagem](modelagem.md) orientam o desenho de dados. As [migrações Flyway](../../backend/src/main/resources/db/migration/) definem o esquema executado.
- O [design system no Figma](https://www.figma.com/design/NhEuGEDcNqW2NNMnP614YV/PROCOBAJA-ERP-%C2%B7-UI-Kit---Design-System?node-id=0-1) orienta a apresentação e os fluxos de interface.
