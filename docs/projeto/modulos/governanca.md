# Governança

**Requisitos:** RF28–RF29. **Fonte:** [documento de projeto](../documento-de-projeto.pdf#page=32), seção 4.1.7, páginas 32–33. Regras planejadas; não indicam implementação.

## Funcionamento

- Gerenciar regimento, normas e diretrizes com versões, histórico de alterações e identificação do conteúdo vigente em cada período.
- Capitão/Administrador e Gestores criam e alteram documentos e consultam versões em elaboração; a aprovação final e publicação são exclusivas do Capitão/Administrador.
- Os demais perfis acessam versões publicadas e seu histórico conforme permissões, sem acesso a documentos em desenvolvimento.
- Após publicação, registrar ciência e aceite vinculados ao usuário, à versão publicada e à data, preservando registros anteriores.

## Permissões resumidas

| Perfil | Acesso previsto |
|---|---|
| Capitão/Administrador | Cria e altera, consulta histórico e elaboração, aprova e publica, e registra ciência e aceite. |
| Gestor | Cria e altera, consulta histórico e elaboração e registra ciência e aceite; não aprova nem publica. |
| Financeiro, Líder, Membro e Orientador | Consultam versões publicadas e históricos permitidos e registram ciência e aceite. |

Consulte a tabela 9 do PDF para a matriz integral.

## Rastreabilidade

[Caso de uso](../../diagramas/Diagramas%20de%20Caso%20de%20Uso/Casos_de_Uso-07%20-%20Governan%C3%A7a.drawio.png), [modelo relacional principal](../../diagramas/Diagramas%20de%20Banco%20de%20Dados/01_Figuras_Principais/Figura_39_Governanca_Documentos_e_Versoes.png). Consulte também os [requisitos funcionais](../requisitos/funcionais.md), o [DBML](../../diagramas/Diagramas%20de%20Banco%20de%20Dados/modelo_relacional_v4.dbml) e a matriz integral no PDF.

No modelo proposto, as tabelas relacionadas incluem `documentos_governanca`, `versoes_governanca`, `historico_edicoes_governanca`, `aceites_governanca`, `logs_auditoria`. A lista orienta a leitura e não substitui o dicionário de dados ou as migrações efetivas.

Diagramas de classes: [diagrama de classes 1](../../diagramas/Diagramas%20de%20Classe/07%20Governan%C3%A7a.drawio.png). São artefatos de análise e não necessariamente classes já implementadas.

## Cenários para orientar a validação

- Criar versão em elaboração e conferir que perfis não autorizados não conseguem consultá-la.
- Confirmar que somente Capitão aprova e publica; vincular aceite ao usuário, à versão publicada e à data.
- Publicar nova versão e verificar que conteúdo e aceites anteriores permanecem consultáveis conforme permissões.

Estes cenários derivam das regras do PDF e não comprovam que os fluxos já existam ou estejam testados.
