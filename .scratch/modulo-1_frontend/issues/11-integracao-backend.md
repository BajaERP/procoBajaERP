# 11: Integração real do módulo e da autenticação

Status: ready-for-agent

**Blocked by:** [01](01-navegacao-listagem-integrantes.md), [02](02-identidades-mocks-permissoes.md), [03](03-cadastro-integrantes.md), [04](04-administracao-integrantes.md), [05](05-consulta-cadastro-subsistemas.md), [06](06-definicao-lideranca.md), [07](07-transferencias-desativacao-subsistemas.md), [08](08-responsabilidade-financeira.md), [09](09-matriz-permissoes.md), [10](10-troca-senha.md), [12 — sucessão](12-sucessao-capitao.md), [13 — auditoria](13-historico-auditoria.md); backend: [06 — Gestor Financeiro](../../modulo-1_backend/issues/06-correcao-gestor-financeiro-banco.md), [07 — identificação e senha](../../modulo-1_backend/issues/07-identificacao-e-senha-provisoria.md), [08 — subsistemas](../../modulo-1_backend/issues/08-ajustar-desativacao-e-visibilidade-subsistemas.md), [09 — sucessão](../../modulo-1_backend/issues/09-sucessao-unica-capitao.md) e [10 — auditoria](../../modulo-1_backend/issues/10-consulta-auditoria.md).

> Esta issue permanece numerada 11 por já fazer parte do plano do módulo, mas é a última etapa a executar. As issues 12 e 13 são pré-requisitos de fluxos com mocks, não etapas posteriores à integração.

## O que construir

Integrar os fluxos concluídos à API e à sessão real, mantendo a demonstração isolada no desenvolvimento.

- [ ] Conferir os contratos finais com o backend e conectar os serviços do módulo, inclusive liderança, transferências, consulta somente leitura do Gestor Financeiro, identificadores e troca de senha; não recriar as issues de backend 01–04.
- [ ] Integrar a consulta e a operação de sucessão única do Capitão e a consulta de auditoria, preservando escopos e privacidade.
- [ ] Implementar login, consulta do usuário atual, logout e sessão por cookie HttpOnly com proteção CSRF; configurar mesma origem via proxy em desenvolvimento e roteamento HTTPS em produção. Não guardar credenciais nem sessão real no armazenamento local.
- [ ] Aguardar a consulta da sessão antes de redirecionar, distinguir sessão ausente ou expirada de falha de rede, preservar a rota solicitada e limpar ou atualizar a identidade no logout.
- [ ] Aplicar troca obrigatória e voluntária de senha e refletir mudanças de permissões recebidas ou na próxima requisição; o servidor valida autorização e regras em todas as operações.
- [ ] Filtrar, pesquisar e paginar somente os dados autorizados recebidos; nunca inferir identificadores ausentes. Apresentar erros de API compreensíveis e erros de campo quando disponíveis.
- [ ] Disponibilizar o módulo real em produção e manter a demonstração somente em desenvolvimento, sem confundir identidades ou permitir que o seletor Dev altere permissões do servidor.
- [ ] Verificar com backend e contas apropriadas autenticação, CSRF, expiração, logout, retorno à rota, senhas, permissões, mudanças de associação ao Subsistema Financeiro, falhas de rede e roteamento; executar build e verificações pertinentes.

Consulte a [especificação do módulo](../spec.md) para as regras completas, o Figma e os critérios transversais de interface e verificação.

## Comments
