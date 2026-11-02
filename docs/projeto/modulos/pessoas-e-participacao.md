# Pessoas e Participação

**Requisitos:** RF19–RF22. **Fonte:** [documento de projeto](../documento-de-projeto.pdf#page=25), seção 4.1.4, páginas 25–27. Regras planejadas; não indicam implementação.

## Funcionamento

- Líderes registram presença, carga horária, turnos e justificativas do próprio subsistema; o documento informa o período de atividades das 18h às 22h. O PDF não especifica aqui uma regra técnica para bloquear outros horários; confirme antes de implementá-la como validação.
- Gestores e Capitão/Administrador revisam, alteram e validam presença e horas, preferencialmente ao fim da semana. Alterações e validações mantêm histórico; informações validadas alimentam indicadores de frequência.
- Membros registram o próprio diário; Gestores e Capitão/Administrador consultam e validam esses registros.
- Líderes registram participação nas reuniões semanais do subsistema; nas reuniões dos Gestores, o registro cabe ao Gestor responsável. Outros eventos e competições seguem a responsabilidade atribuída.
- Observações cotidianas podem ser disponibilizadas aos envolvidos. Ocorrências e advertências administrativas confidenciais ficam restritas a Gestores e Capitão/Administrador. Líderes podem registrá-las para seu subsistema, mas não consultá-las ou gerenciá-las após o envio.

## Permissões resumidas

| Perfil | Acesso previsto |
|---|---|
| Capitão/Administrador e Gestor | Revisam e validam presença, horas e diário; acompanham históricos e gerenciam registros administrativos confidenciais. |
| Financeiro | Consulta informações gerais disponibilizadas ao perfil; não registra ou valida presença, horas e diários nem acessa registros administrativos confidenciais. |
| Líder | Registra presença, horas e participação do próprio subsistema, sem validar; registra ocorrências conforme as restrições de confidencialidade. |
| Membro | Registra o próprio diário e consulta os próprios dados e observações não confidenciais; não altera presença nem valida registros. |
| Orientador | Consulta indicadores e informações não confidenciais, sem registrar ou validar dados. |

Consulte a tabela 6 do PDF para a matriz integral.

## Rastreabilidade

[Caso de uso](../../diagramas/Diagramas%20de%20Caso%20de%20Uso/Casos_de_Uso-04%20-%20Pessoas%20e%20Participa%C3%A7%C3%A3o.drawio.png), [modelo relacional principal](../../diagramas/Diagramas%20de%20Banco%20de%20Dados/01_Figuras_Principais/Figura_32_Pessoas_Presenca_Horas_e_Diario.png). Consulte também os [requisitos funcionais](../requisitos/funcionais.md), o [DBML](../../diagramas/Diagramas%20de%20Banco%20de%20Dados/modelo_relacional_v4.dbml) e a matriz integral no PDF.

No modelo proposto, as tabelas relacionadas incluem `registros_presenca`, `historico_registros_presenca`, `diarios_atividades`, `participacoes_eventos`, `registros_disciplinares`. A lista orienta a leitura e não substitui o dicionário de dados ou as migrações efetivas.

Diagramas de classes: [diagrama de classes 1](../../diagramas/Diagramas%20de%20Classe/04%20Pessoas%20e%20Participa%C3%A7%C3%A3o.drawio.png). São artefatos de análise e não necessariamente classes já implementadas.

## Cenários para orientar a validação

- Registrar presença pelo Líder e validar por Gestor ou Capitão, preservando histórico de alterações.
- Confirmar que Membro registra seu próprio diário sem alterar presença e que a participação segue o responsável pelo evento.
- Verificar que ocorrência confidencial enviada por Líder não fica consultável por ele após o envio.

Estes cenários derivam das regras do PDF e não comprovam que os fluxos já existam ou estejam testados.
