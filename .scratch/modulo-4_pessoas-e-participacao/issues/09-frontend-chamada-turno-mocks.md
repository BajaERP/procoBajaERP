# 09: Navegação e chamada de turno com mocks

Status: ready-for-agent
Frente: Frontend

**Especificação:** [Módulo 4 · Pessoas e Participação](../spec.md).
**Histórias cobertas:** 1–14, 40.

**Blocked by:** [01 — Fechar o contrato da API](01-contrato-api.md)

## Entrega

Entregar a navegação do módulo e a chamada de turno demonstrativa no contrato acordado.

## Critérios de aceitação

- [ ] Manter uma entrada na sidebar e usar os componentes e padrões visuais do ERP em desktop e mobile, com teclado e temas claro e escuro. Isolar mocks e operações simuladas atrás do contrato.
- [ ] Sugerir 18h às 22h e aceitar horários reais. Aplicar horário comum às pessoas selecionadas, exibir a quantidade antes de salvar e preservar exceções individuais. Salvar só a seleção conferida.
- [ ] Demonstrar Presente sem horário, Justificada com motivo, turno após a meia-noite, sobreposição, chamada retroativa com vínculo em revisão e presença do Capitão sem Subsistema.
- [ ] Respeitar capacidades simuladas para consulta e correção prévia à Validação. Preservar seleção e preenchimento diante de erro por registro sem simular gravação parcial. Cobrir carregamento, vazio, falha e nova tentativa.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
