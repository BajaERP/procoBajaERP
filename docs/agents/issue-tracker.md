# Rastreamento de issues em Markdown local

As especificações e issues ficam em `.scratch/`:

- Uma pasta por funcionalidade: `.scratch/<feature-slug>/`.
- Especificação: `.scratch/<feature-slug>/spec.md`.
- Uma issue por arquivo em `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numerada a partir de `01`.
- Estado de triagem na linha `Status:` próxima ao início da issue, conforme [triage-labels.md](triage-labels.md).
- Comentários e histórico ao final do arquivo, sob o título `## Comments`.

Quando uma skill pedir para publicar uma issue, crie o arquivo na pasta da funcionalidade, criando os diretórios necessários. Para consultar uma issue, leia o arquivo correspondente ao caminho ou número informado.

## Operações de Wayfinding

O fluxo `/wayfinder` usa um mapa e uma issue filha por tarefa:

- **Mapa:** `.scratch/<effort>/map.md`, com notas, decisões e incertezas.
- **Issue filha:** `.scratch/<effort>/issues/NN-<slug>.md`, numerada a partir de `01`, com a pergunta no corpo, `Type:` igual a `research`, `prototype`, `grilling` ou `task` e `Status:` para o estado de execução (`claimed` ou `resolved`). Esses estados de execução são distintos dos estados de triagem.
- **Bloqueio:** registre `Blocked by: NN, NN` próximo ao início. A issue fica desbloqueada quando todas as issues listadas estiverem `resolved`.
- **Próxima issue:** procure em `.scratch/<effort>/issues/` uma issue aberta, desbloqueada e não reivindicada; escolha a de menor número.
- **Reivindicar:** defina `Status: claimed` e salve antes de começar.
- **Resolver:** acrescente a resposta sob `## Answer`, defina `Status: resolved` e adicione um resumo com link à seção de decisões do mapa.
