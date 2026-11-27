# 07: Registrar e consultar Resultados

Status: ready-for-agent
Frente: Backend

**Especificação:** [Módulo 6 · Competições e Eventos](../spec.md).
**Histórias cobertas:** 29–30.

**Blocked by:** [02 — Consultar e cadastrar compromissos](02-backend-agenda-cadastro.md)

## Entrega

Disponibilizar Resultados por modalidade nas Competições atuais e históricas.

## Critérios de aceitação

- [ ] Permitir a Capitão ou Gestor registrar vários Resultados por edição, diferenciando-os por prova, categoria ou modalidade.
- [ ] Exigir modalidade e pelo menos um dado entre posição, pontuação e descrição. Rejeitar Resultado incompleto.
- [ ] Aplicar o acesso à Competição na consulta. Verificar pela API registro, rejeição, leitura histórica e autorização.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
