# 02: Consultar e cadastrar compromissos

Status: ready-for-agent
Frente: Backend

**Especificação:** [Módulo 6 · Competições e Eventos](../spec.md).
**Histórias cobertas:** 1–10, 39.

**Blocked by:** [01 — Fechar o contrato compartilhado](01-contrato-api.md)

## Entrega

Expor agenda, histórico, detalhe, cadastro e edição de Reuniões, Competições e Eventos gerais.

## Critérios de aceitação

- [ ] Consultar próximos compromissos e Histórico, buscar por nome, local ou responsável e filtrar por tipo. Distinguir os dados de cada tipo e consultar Competições por edição.
- [ ] Exigir tipo, nome e início. Aceitar término, local e descrição opcionais e validar a ordem das datas. Permitir registrar pauta, resumo, Subsistemas e o tipo de Reunião, bem como edição, período de Inscrição, desafio técnico e veículo em Competições. Criar novo Evento para uma nova edição.
- [ ] Restringir criação e edição conforme Perfil e Subsistema. O Orientador consulta somente Competições atuais e históricas. Aplicar o mesmo escopo à busca e ao acesso direto.
- [ ] Verificar pela API autenticada com PostgreSQL e Flyway, incluindo Líderes de Subsistemas distintos, Membro, Gestor Financeiro e Orientador. Confirmar que a resposta operacional omite dados financeiros protegidos.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
