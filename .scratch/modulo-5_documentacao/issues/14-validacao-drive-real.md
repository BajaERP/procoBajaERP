# 14: Validar Documentação com arquivos reais

Status: blocked
Frente: Compartilhada

**Especificação:** [Módulo 5 · Documentação](../spec.md).
**Histórias cobertas:** 5–8, 11–13, 18–22, 25–30.

**Blocked by:** [07 — Implementar o adaptador do Google Drive](07-backend-adaptador-drive.md); [13 — Integrar o frontend à API de Documentação](13-frontend-integracao-api.md); área de teste restrita no Drive compartilhado do Google Workspace e autorização da identidade do backend, ainda a confirmar

## Entrega

Confirmar o módulo ponta a ponta com arquivos de teste em área restrita do Drive compartilhado.

## Critérios de aceitação

- [ ] Confirmar acesso autorizado pela identidade do backend, existência de área de teste restrita e uso de arquivos de teste.
- [ ] Executar envio, importação sem duplicação, nova Versão, consulta, abertura, download, ida à lixeira e restauração. Conferir a confirmação no ERP e o estado no Drive.
- [ ] Validar pelo menos um Documento confidencial: a API aplica o escopo e o acesso direto pelo Drive também fica restrito. Verificar resposta para compartilhamento incompatível e registrar evidências da validação.
- [ ] Liberar esta issue quando a área de teste e a autorização tiverem sido confirmadas, mantendo explícitos os bloqueios restantes das issues 07 e 13.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
