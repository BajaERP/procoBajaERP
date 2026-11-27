# 01: Fechar o contrato da API

Status: ready-for-agent
Frente: Compartilhada

**Especificação:** [Módulo 4 · Pessoas e Participação](../spec.md).

**Blocked by:** Nenhuma issue nova.

## Entrega

Acordar o contrato de Pessoas e Participação entre os responsáveis pelo frontend e pelo backend.

## Critérios de aceitação

- [ ] Definir consultas, filtros, comandos, capacidades por Perfil, datas e horários, erros de autorização, sobreposição, validação e conflito. Prever identificação do registro inválido em lote sem expor outro escopo.
- [ ] Distinguir dados individuais e agregados, rascunho privado e versão enviada, conteúdo administrativo e texto de Advertência comunicável. Definir Frequência e Carga horária como resultados distintos no contrato.
- [ ] Revisar exemplos de chamada retroativa, lote inválido, rascunho privado, Advertência comunicada e Participação em Evento de teste. Usar os mesmos exemplos para mocks e verificações da API.
- [ ] Definir a divisão de responsabilidades com Eventos. A API principal segue o padrão de sessão, HTTP e CSRF do ERP. Sua integração usa somente o Módulo 4 e a base já disponível de Equipe e Subsistemas.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
