# 06: Registrar Ciência e Aceite e consultar pendências pessoais

Status: ready-for-agent
Frente: Backend

**Especificação:** [Módulo 7 · Governança](../spec.md).
**Histórias cobertas:** 19–27, 30.

**Blocked by:** [04 — Publicar com Vigência imediata ou futura](04-backend-publicacao-vigencia.md)

## Entrega

Permitir que o Usuário registre suas confirmações e consulte pendências, comprovantes e histórico. Fornecer a consulta que o Dashboard vai consumir.

## Critérios de aceitação

- [ ] Registrar Ciência isolada ou Ciência e Aceite juntos. Ao aceitar depois, preservar a data original da Ciência. Repetições e envios concorrentes mantêm um registro por Usuário e Versão e preservam as datas confirmadas.
- [ ] Permitir Aceite antecipado aos Usuários ativos na publicação e manter sua validade quando a Versão entrar em vigor. Quem entra depois recebe as Versões vigentes e passa a receber a futura no início da Vigência.
- [ ] Na desativação, retirar a conta do acompanhamento atual e preservar seus registros. Na reativação, retomar apenas os Aceites faltantes das Versões vigentes e exigir as futuras quando entrarem em vigor.
- [ ] Distinguir Ciência registrada com Aceite pendente, confirmações concluídas e histórico. Retirar pendências de Versões substituídas, encerradas ou canceladas e conservar os Aceites já registrados.
- [ ] Expor ao Usuário autenticado apenas suas próprias pendências, com Documento, Versão, início de Vigência e referência de abertura. Oferecer comprovante no ERP com Usuário, Documento, Versão e datas registradas e manter o acesso ao ERP durante a pendência.
- [ ] Verificar pela API a autorização, as datas e a elegibilidade, usando datas controladas e Versões encerradas ou canceladas nos dados de teste.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
