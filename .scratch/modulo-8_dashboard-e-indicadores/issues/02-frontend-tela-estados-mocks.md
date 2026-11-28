# 02: Montar a tela inicial e os estados dos cartões

Status: ready-for-agent
Frente: Frontend

**Especificação:** [Módulo 8 · Dashboard e Indicadores](../spec.md).
**Histórias cobertas:** 1–5, 19–20, 23–25, 27–28.

**Blocked by:** [01 — Fechar o contrato dos cartões](01-contrato-cartoes.md)

## Entrega

Substituir a tela provisória do Dashboard por uma interface responsiva que permita verificar o comportamento por Perfil com dados demonstrativos.

## Critérios de aceitação

- [ ] Reusar a rota inicial, a sessão, o layout e o design system do ERP. Demonstrar a visão da equipe, o recorte inicial do Líder e do Membro, e os agregados do Orientador conforme as permissões.
- [ ] Manter o conteúdo demonstrativo isolado em desenvolvimento e usar o contrato por cartão para permitir ativação independente das fontes reais.
- [ ] Simular carregamento, zero, ausência de dados e falha parcial. Mostrar “Indisponível no momento” e nova tentativa no cartão afetado. Manter os outros cartões disponíveis e ocultar os que estiverem fora do escopo.
- [ ] Verificar desktop e mobile a partir de 320 px, temas claro e escuro, teclado e foco visível.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
