# Gestão Financeira

**Requisitos:** RF13–RF18 e RF32. **Fonte:** [documento de projeto](../documento-de-projeto.pdf#page=22), seção 4.1.3, páginas 22–25. Regras planejadas; não indicam implementação.

## Funcionamento

- Solicitações registram itens, descrições, links e preços; para análise, são necessários pelo menos três orçamentos. Podem atender à equipe ou a um ou mais subsistemas, sem rateio; o valor integral não pode ser duplicado no total geral.
- Estados previstos: Planejada, Aguardando aprovação, Aprovada, Reprovada, Realizada/Paga e Cancelada. A aprovação exige decisões favoráveis do Financeiro e do Capitão/Administrador.
- No modelo proposto, itens, orçamentos e decisões pertencem à revisão da solicitação; preservar versões enviadas e ligar o orçamento escolhido à revisão autorizada.
- Uma reprovação registra motivo e permite ajustes e reenvio; estados e decisões permanecem no histórico. Quando concluída e paga, a compra gera saída financeira sem duplicação.
- O solicitante pode consultar preços e orçamentos das próprias solicitações durante o processo. Após pagamento, o histórico disponibilizado respeita as restrições financeiras.
- O solicitante pode cancelar enquanto Planejada ou Aguardando aprovação. Depois de aprovada e antes de Realizada/Paga, o cancelamento é restrito ao Financeiro e ao Capitão/Administrador.
- A saída financeira é gerada após a realização e o pagamento, e não apenas pela aprovação. O complemento SQL prevê unicidade parcial para movimentação ativa por compra; validar sua aplicação e a transação efetiva no backend.
- Movimentações não são excluídas definitivamente: cancelamentos autorizados preservam registro, responsável e justificativa.

## Permissões resumidas

| Perfil | Acesso previsto |
|---|---|
| Capitão/Administrador e Financeiro | Gerenciam dados financeiros, aprovam conjuntamente e podem efetivar compras e registrar pagamentos. |
| Gestor | Consulta estado e informações administrativas permitidas; não acessa preços, orçamentos, movimentações, saldos, gastos ou previsão de caixa, mesmo com Financeiro vinculado. |
| Líder e Membro | Criam e acompanham solicitações do próprio subsistema e consultam preços e orçamentos das próprias solicitações durante o processo; não acessam caixa ou dados financeiros gerais. |
| Orientador | Consulta informações gerais não financeiras disponibilizadas ao perfil; não gerencia compras ou movimentações. |

O backend deve aplicar as restrições por perfil, propriedade e estado. Consulte a tabela 5 do PDF para a matriz integral.

## Rastreabilidade

[Caso de uso](../../diagramas/Diagramas%20de%20Caso%20de%20Uso/Casos_de_Uso-03%20-%20Financeiro.drawio.png), [modelo relacional principal](../../diagramas/Diagramas%20de%20Banco%20de%20Dados/01_Figuras_Principais/Figura_28_Financeiro_Solicitacoes_e_Revisoes.png). Consulte também os [requisitos funcionais](../requisitos/funcionais.md), o [DBML](../../diagramas/Diagramas%20de%20Banco%20de%20Dados/modelo_relacional_v4.dbml) e a matriz integral no PDF.

No modelo proposto, as tabelas relacionadas incluem `solicitacoes_compra`, `revisoes_solicitacoes_compra`, `solicitacoes_itens`, `orcamentos_compra`, `aprovacoes_compra`, `compras`, `movimentacoes_financeiras`, `previsoes_financeiras`. A lista orienta a leitura e não substitui o dicionário de dados ou as migrações efetivas.

Diagramas de classes: [diagrama de classes 1](../../diagramas/Diagramas%20de%20Classe/03A%20Financeiro%20%E2%80%94%20Compras%20e%20Aprova%C3%A7%C3%B5es.drawio.png), [diagrama de classes 2](../../diagramas/Diagramas%20de%20Classe/03B%20Financeiro%20%E2%80%94%20Pagamentos%20e%20Previs%C3%B5es.drawio.png). São artefatos de análise e não necessariamente classes já implementadas.

## Cenários para orientar a validação

- Submeter revisão com menos de três orçamentos, registrar decisões dos dois aprovadores e conferir que uma aprovação isolada não autoriza a compra.
- Reprovar, justificar, ajustar e reenviar preservando histórico; verificar cancelamento em cada estado permitido.
- Confirmar saída sem duplicidade e ausência de valores restritos nas respostas destinadas ao Gestor, inclusive com Financeiro vinculado.

Estes cenários derivam das regras do PDF e não comprovam que os fluxos já existam ou estejam testados.
