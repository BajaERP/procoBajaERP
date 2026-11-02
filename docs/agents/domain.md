# Documentação de domínio

O projeto usa um único contexto de domínio. Seu glossário é o `CONTEXT.md` na raiz; quando uma skill mencionar `GLOSSARY.md`, consulte ou atualize `CONTEXT.md`. Mantenha o vocabulário em um único arquivo.

Antes de trabalhar com termos ou regras de domínio, leia `CONTEXT.md` e os registros de decisão relevantes em `docs/adr/`, caso existam. Não é necessário criar a pasta de ADRs antecipadamente.

Use os termos do glossário em títulos de issues, propostas, hipóteses e testes. Se um termo estiver ausente ou divergir do código ou de outra fonte, registre a dúvida e esclareça-a antes de assumir uma regra. Ao resolver um termo, atualize o glossário. Se uma proposta contrariar um ADR existente, explicite o conflito.

Se o projeto passar a ter múltiplos contextos e um `CONTEXT-MAP.md` for criado, siga seus apontamentos para os glossários relevantes e consulte também os ADRs específicos de cada contexto.
