# 07: Emitir, comunicar e revogar Advertências

Status: ready-for-agent
Frente: Backend

**Especificação:** [Módulo 4 · Pessoas e Participação](../spec.md).
**Histórias cobertas:** 31–34.

**Blocked by:** [06 — Encaminhar e analisar Ocorrências](06-backend-ocorrencias.md)

## Entrega

Disponibilizar a gestão de Advertências por Capitão e Gestor e a consulta e confirmação de ciência pelo destinatário autorizado.

## Critérios de aceitação

- [ ] Emitir com motivo formal e vínculo opcional com Ocorrência. A comunicação é uma ação distinta que registra o momento em que o texto foi disponibilizado.
- [ ] Depois da comunicação, retornar ao destinatário somente o conteúdo formal da própria Advertência. Manter Ocorrência de origem e notas internas restritas a Capitão e Gestores em consultas, listagens, históricos e erros.
- [ ] Permitir que o destinatário confirme ciência com data e hora, sem indicar concordância. Capitão ou Gestor pode revogar com justificativa e emitir outra. Preservar o texto original, consultável pelo destinatário como Revogada.
- [ ] Verificar pela API emissão sem comunicação, visibilidade do texto após comunicação, proteção das notas internas, ciência e revogação com histórico.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
