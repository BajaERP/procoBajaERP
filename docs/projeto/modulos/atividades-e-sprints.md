# Atividades e Sprints

**Requisitos:** RF06–RF12. **Fonte:** [documento de projeto](../documento-de-projeto.pdf#page=21), seção 4.1.2, páginas 21–22; fluxo de atividades nas páginas 97–98. Regras planejadas; não indicam implementação.

## Funcionamento

- Atividades podem nascer no backlog e ser alocadas em sprints da equipe, com duração prevista de 15 dias. Uma atividade pode ter múltiplos responsáveis e subsistemas.
- O planejamento inclui prazo, prioridade e esforço em escala Fibonacci. O Kanban distingue Não iniciada, Não concluída, Em andamento, Concluída e Pausada.
- Atividades não concluídas podem ser transferidas para sprint posterior, preservando sprint de origem, passagens e quantidade de transferências.
- O DBML permite prazo e estimativa nulos, embora o texto funcional os inclua no planejamento. A fase e a obrigatoriedade desses campos devem ser confirmadas antes de impor validações globais.
- Indicadores acompanham responsáveis, estimativas, prioridade e andamento, incluindo alerta próximo à metade da sprint para atividades com pouco ou nenhum progresso.

## Permissões resumidas

| Perfil | Acesso previsto |
|---|---|
| Capitão/Administrador e Gestor | Gerenciam backlog, sprints, planejamento, estados e transferências de todos os subsistemas. |
| Financeiro | Consulta o que lhe for permitido e atualiza estados de atividades nas quais possa atuar; não gerencia planejamento ou sprints. |
| Líder | Gerencia atividades e estados do próprio subsistema e acompanha outros como espectador; não administra sprints. |
| Membro | Consulta atividades relacionadas e atualiza estados quando autorizado; não altera planejamento ou administra sprints. |
| Orientador | Consulta informações disponibilizadas ao perfil, sem alterar atividades ou sprints. |

Consulte a tabela 4 do PDF para a matriz integral.

## Rastreabilidade

[Caso de uso](../../diagramas/Diagramas%20de%20Caso%20de%20Uso/Casos_de_Uso-02%20-%20Atividades%20e%20Sprints.drawio.png), [modelo relacional principal](../../diagramas/Diagramas%20de%20Banco%20de%20Dados/01_Figuras_Principais/Figura_27_Atividades_e_Sprints.png). Consulte também os [requisitos funcionais](../requisitos/funcionais.md), o [DBML](../../diagramas/Diagramas%20de%20Banco%20de%20Dados/modelo_relacional_v4.dbml) e a matriz integral no PDF.

No modelo proposto, as tabelas relacionadas incluem `atividades`, `atividades_responsaveis`, `atividades_subsistemas`, `sprints`, `atividades_sprints`, `historico_status_atividades`. A lista orienta a leitura e não substitui o dicionário de dados ou as migrações efetivas.

Diagramas de classes: [diagrama de classes 1](../../diagramas/Diagramas%20de%20Classe/02%20Atividades%20e%20Sprints.drawio.png). São artefatos de análise e não necessariamente classes já implementadas.

## Cenários para orientar a validação

- Transferir uma atividade inacabada entre sprints e consultar origem e histórico sem perder passagens.
- Confirmar que Líder acompanha atividades de outro subsistema sem modificá-las e não administra sprints.
- Testar estados, responsáveis, associações e alerta próximo à metade da sprint conforme regras aprovadas.

Estes cenários derivam das regras do PDF e não comprovam que os fluxos já existam ou estejam testados.
