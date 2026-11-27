# Rastreamento de issues

## Trabalho compartilhado

Consulte as [issues do repositório](https://github.com/BajaERP/procoBajaERP/issues) para escopo, critérios de aceitação e dependências publicadas. Consulte o [Projects procoBajaERP](https://github.com/orgs/BajaERP/projects/2) para o andamento e filtre pelo campo **Módulo**. As issues publicadas usam as labels **Frontend** e **Backend** conforme a frente de trabalho. Uma entrega compartilhada, como o contrato de API, pode usar ambas.

Referencie o número da issue ou seu link ao compartilhar trabalho com a equipe. Registre o andamento no campo **Status** do Projects. Mantenha a descrição voltada para entrega, critérios verificáveis e dependências, com links para outras issues quando houver.

## Planejamento local

O Git ignora `.scratch/`. Use essa pasta para rascunhos e planejamento local. Quando ela estiver disponível, siga esta estrutura:

- Uma pasta por funcionalidade: `.scratch/<feature-slug>/`.
- Especificação: `.scratch/<feature-slug>/spec.md`.
- Uma issue por arquivo em `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numerada a partir de `01`.
- Estado de triagem na linha `Status:` próxima ao início da issue, conforme [triage-labels.md](triage-labels.md).
- Comentários e histórico ao final do arquivo, sob o título `## Comments`.

Quando a tarefa pedir uma issue local, use a pasta da funcionalidade. Quando a tarefa pedir publicação no GitHub, procure primeiro a issue existente, leve a entrega e os critérios para a descrição e converta as dependências locais em links do GitHub. Os caminhos de `.scratch/` servem ao planejamento de quem tem os arquivos. Use fontes compartilhadas para que a issue possa ser executada a partir de um clone.

## Operações de Wayfinding

O fluxo `/wayfinder` usa um mapa e uma issue filha por tarefa:

- **Mapa:** `.scratch/<effort>/map.md`, com notas, decisões e incertezas.
- **Issue filha:** `.scratch/<effort>/issues/NN-<slug>.md`, numerada a partir de `01`, com a pergunta no corpo, `Type:` igual a `research`, `prototype`, `grilling` ou `task` e `Status:` para o estado de execução (`claimed` ou `resolved`). Esses estados de execução são distintos dos estados de triagem.
- **Bloqueio:** registre `Blocked by: NN, NN` próximo ao início. A issue fica desbloqueada quando todas as issues listadas estiverem `resolved`.
- **Próxima issue:** procure em `.scratch/<effort>/issues/` uma issue aberta, desbloqueada e não reivindicada; escolha a de menor número.
- **Reivindicar:** defina `Status: claimed` e salve antes de começar.
- **Resolver:** acrescente a resposta sob `## Answer`, defina `Status: resolved` e adicione um resumo com link à seção de decisões do mapa.
