# 02: Gerenciar Solicitações, Revisões e Orçamentos

Status: ready-for-agent
Frente: Backend

**Especificação:** [Módulo 3 · Gestão Financeira](../spec.md).
**Histórias cobertas:** 1–13.

**Blocked by:** [01 — Fechar o contrato da API](01-contrato-api.md)

## Entrega

Disponibilizar o cadastro e acompanhamento de Solicitações pela API autenticada.

## Critérios de aceitação

- [ ] Permitir que Integrante ativo solicite para o próprio Subsistema e que Capitão ou Gestor abra Solicitações gerais ou de vários Subsistemas. Aceitar a preparação em Planejada antes de completar os Orçamentos.
- [ ] Registrar Fornecedores, itens, quantidades, links e valores em BRL com frete incluído no total. Para enviar, exigir pelo menos três Fornecedores distintos com os mesmos itens e quantidades. Informar itens faltantes e quantidade de Fornecedores válidos.
- [ ] Preservar a Revisão enviada. Retirada da análise e correção após Reprovação permitem preparar e enviar nova Revisão, mantendo dados e decisões anteriores.
- [ ] Permitir que o Solicitante cancele a própria Solicitação Planejada, Aguardando aprovação ou Reprovada, com motivo e registro no histórico.
- [ ] Aplicar o escopo a consultas, filtros e histórico. O Solicitante vê preços enquanto a Solicitação está em andamento, inclusive se Reprovada e corrigível. Após Pagamento ou cancelamento, a resposta preserva itens, situação e histórico permitido e suprime valores restritos e informações que os revelem, inclusive em links, anexos e justificativas. Respeitar a exceção pelo Perfil financeiro e o acesso administrativo de Gestor e Orientador.
- [ ] Verificar pela API autenticada com PostgreSQL e Flyway em pelo menos dois Subsistemas, incluindo consulta sem permissão, Orçamentos incompletos, retirada, reenvio e cancelamento.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
