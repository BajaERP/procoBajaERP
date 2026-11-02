# Dashboard e Indicadores

**Requisitos:** RF30–RF31, com restrições de RF32. **Fonte:** [documento de projeto](../documento-de-projeto.pdf#page=33), seção 4.1.8, páginas 33–35. Regras planejadas; não indicam implementação.

## Funcionamento

- Consolidar indicadores, alertas, resumos e atalhos dos módulos conforme perfil, subsistema e permissões.
- Exibir acompanhamento de atividades e sprints, incluindo responsáveis, estimativas, prioridades, pouco progresso, transferências e alerta próximo à metade da sprint.
- Apresentar, quando autorizados, indicadores de presença, carga horária, participação, reuniões, documentos, eventos e finanças.
- Dados financeiros restritos só podem ser exibidos a perfis autorizados; atalhos e agregações não concedem permissões adicionais e devem ser protegidos no backend.

## Permissões resumidas

| Perfil | Acesso previsto |
|---|---|
| Capitão/Administrador | Visão ampla operacional e financeira, conforme permissões. |
| Gestor | Visão operacional e administrativa dos subsistemas, sem preços, orçamentos, movimentações, saldos, gastos ou previsão de caixa. |
| Financeiro | Indicadores financeiros autorizados e informações gerais não confidenciais disponíveis ao perfil. |
| Líder | Atividades e participação do próprio subsistema; acompanha outros como espectador e acessa preços e orçamentos de suas próprias solicitações durante o processo, conforme regras financeiras. |
| Membro | Dados pessoais, atividades e subsistema; acompanha as próprias solicitações e seus preços e orçamentos durante o processo, conforme regras financeiras. |
| Orientador | Indicadores gerais não confidenciais, sem alteração de registros ou acesso a dados administrativos e financeiros confidenciais. |

Consulte a tabela 10 do PDF para a matriz integral.

## Rastreabilidade

[Caso de uso](../../diagramas/Diagramas%20de%20Caso%20de%20Uso/Casos_de_Uso-08%20-%20Dashboard%20e%20Indicadores.drawio.png). Consulte também os [requisitos funcionais](../requisitos/funcionais.md), o [DBML](../../diagramas/Diagramas%20de%20Banco%20de%20Dados/modelo_relacional_v4.dbml) e a matriz integral no PDF.

A [visão geral das classes](../../diagramas/Diagramas%20de%20Classe/00%20Vis%C3%A3o%20Geral%20%E2%80%94%20classes%20centrais.drawio.png) representa os conceitos centrais. O modelo descrito no PDF não prevê tabelas ou classes de domínio exclusivas para o dashboard; ele consulta informações dos demais módulos sob suas regras de acesso.

## Cenários para orientar a validação

- Consultar os mesmos indicadores como Capitão, Gestor, Financeiro, Líder, Membro e Orientador, aplicando escopo e confidencialidade.
- Garantir que agregações e atalhos não retornem dados financeiros restritos ao Gestor.
- Testar alertas de sprint e, para solicitações próprias, respeitar a visibilidade financeira contextual do módulo de origem.

Estes cenários derivam das regras do PDF e não comprovam que os fluxos já existam ou estejam testados.
