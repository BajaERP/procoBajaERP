# 03: Validar presença e calcular indicadores

Status: ready-for-agent
Frente: Backend

**Especificação:** [Módulo 4 · Pessoas e Participação](../spec.md).
**Histórias cobertas:** 15–20.

**Blocked by:** [02 — Registrar e corrigir chamada de turno](02-backend-chamada-turno.md)

## Entrega

Permitir Validação individual ou em lote e consulta de presença, Frequência e Carga horária permitidas ao Perfil.

## Critérios de aceitação

- [ ] Capitão e Gestor podem validar inclusive os próprios registros. Guardar autor e momento por registro. Se houver erro em um lote, nenhuma Validação da seleção é aplicada.
- [ ] Só Capitão ou Gestor corrige registros já validados, com justificativa e histórico do valor anterior, autor e momento. O registro corrigido volta à fila e fica fora dos indicadores até nova Validação.
- [ ] Calcular Frequência por Presente validadas sobre Presente e Ausente validadas. Separar Justificadas e indicar ausência de dados elegíveis. Presente sem horários conta para Frequência e fica sem Carga horária. A duração integral de turno validado com horários pertence à data inicial.
- [ ] Aplicar escopos: Capitão e Gestor consultam a equipe, Líder consulta presença do próprio Subsistema e Integrante consulta registros próprios. Orientador recebe apenas agregados sem justificativas individuais.
- [ ] Verificar pela API os casos de Validação em lote, consulta sem acesso, vazio, cálculo e exclusão e retorno aos indicadores após uma correção.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
