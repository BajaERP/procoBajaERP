# 06: Gerenciar e delegar a Logística

Status: ready-for-agent
Frente: Backend

**Especificação:** [Módulo 6 · Competições e Eventos](../spec.md).
**Histórias cobertas:** 13, 27–28, 39.

**Blocked by:** [02 — Consultar e cadastrar compromissos](02-backend-agenda-cadastro.md)

## Entrega

Organizar os arranjos operacionais de um Evento e delegar sua manutenção.

## Critérios de aceitação

- [ ] Capitão ou Gestor gerencia a Logística e pode delegá-la a um Líder ativo para o Evento. Aplicar o escopo à consulta e à edição. Preservar a atribuição de chamada ao mudar a Logística.
- [ ] Registrar transporte, compartilhamento e equipe parceira, hospedagem, alimentação, arranjos operacionais de Inscrição e outros itens. Registrar Auxílio, instituição e descrição quando disponíveis.
- [ ] Validar datas dos itens e usar apenas dados operacionais. Auxílio não gera Entrada financeira.
- [ ] Testar pela API um Líder designado, um Líder sem atribuição e a ausência de valores financeiros nas respostas operacionais.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
