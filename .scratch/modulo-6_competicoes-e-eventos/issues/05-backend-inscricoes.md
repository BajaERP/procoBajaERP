# 05: Administrar Inscrições em Competições

Status: ready-for-agent
Frente: Backend

**Especificação:** [Módulo 6 · Competições e Eventos](../spec.md).
**Histórias cobertas:** 17, 24–26.

**Blocked by:** [02 — Consultar e cadastrar compromissos](02-backend-agenda-cadastro.md)

## Entrega

Registrar, atualizar e consultar a Inscrição de um Integrante em uma Competição.

## Critérios de aceitação

- [ ] Permitir a Capitão ou Gestor cadastrar e atualizar uma Inscrição por Integrante e Competição. Aceitar Pendente, Confirmada e Cancelada, e retornar erro de conflito para duplicidade.
- [ ] Permitir ao Integrante consultar a própria Inscrição. Aplicar o escopo de leitura também ao acesso direto.
- [ ] Oferecer somente Inscrições confirmadas como sugestão de chamada. Cancelar a Inscrição preserva o registro e qualquer Participação já lançada.
- [ ] Testar pela API com Inscrições nos três estados e reproduzir tentativas duplicadas, inclusive concorrentes, sem gerar segundo registro.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
