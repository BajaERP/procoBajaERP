# Documentação

O Módulo 05 está planejado para atender RF23 a RF25 e aplicar RF32 à biblioteca. A página atual é provisória. A integração prevê um Drive compartilhado da equipe, acessado pelo backend, com áreas restritas para arquivos confidenciais. [Matriz acadêmica, seção 4.1.5](../documento-de-projeto.pdf#page=27) · [Guia de modelagem](../modelagem.md)

## Biblioteca e acesso

| Classificação | Perfis autorizados a consultar |
|---|---|
| Comum de equipe | Todos os Perfis ativos, incluindo Orientador. |
| Comum restrito a Subsistemas | Capitão, Gestores e Integrantes dos Subsistemas indicados. |
| Administrativo confidencial | Capitão e Gestores. |
| Financeiro confidencial | Capitão e Gestor Financeiro. |

- O servidor aplica a classificação à busca, aos filtros, aos metadados, ao histórico e à abertura de cada Versão. Os acessos a Documentos vinculados a Subsistemas, Atividades, Eventos ou Compras seguem as permissões da biblioteca. O acesso do Solicitante aos próprios Orçamentos em análise é específico de Gestão Financeira. [Gestão Financeira](gestao-financeira.md)
- No envio, o Usuário escolhe uma Categoria existente e uma classificação autorizada. Capitão e Gestor podem criar ou renomear Categorias e reclassificar Documentos dentro do seu escopo. Mudanças de ou para Financeiro confidencial ficam com Capitão e Gestor Financeiro e registram classificação anterior e atual, autor e data.
- Ampliar acesso exige conferir o conteúdo atual e o histórico. Quando só o conteúdo atual puder ser divulgado, o Usuário cadastra uma cópia revisada com classificação própria e mantém o original restrito.

## Drive, importação e versões

- O ERP guarda metadados, identificadores, permissões, vínculos e histórico. O Drive guarda arquivos. Cada abertura ou download passa pela autorização do ERP. Os arquivos confidenciais ficam em áreas restritas, com o compartilhamento público por link desativado.
- Capitão ou Gestor autorizado pode importar de uma pasta do Drive, escolhendo Categoria e confidencialidade. O identificador do Drive permite detectar duplicidade. A importação de arquivo confidencial fica bloqueada enquanto o compartilhamento ultrapassar o acesso previsto.
- O autor do envio que ainda tem acesso, Capitão ou Gestor autorizado pode publicar uma nova Versão no mesmo Documento. A operação preserva os vínculos e registra autor e data. O ERP publica a atualização após a confirmação do Drive e mantém a Versão anterior disponível durante uma falha.
- O histórico inclui as versões que o Drive disponibiliza, inclusive de arquivos anteriores ao ERP. Para uma Versão registrada que já não pode ser baixada, mostrar “Versão indisponível no Drive”.

## Exclusão e restauração

- O Líder pode solicitar exclusão com motivo no seu contexto. Capitão ou Gestor autorizado decide e o histórico preserva solicitação, motivo e decisão.
- A retirada da biblioteca ativa ocorre depois da confirmação de ida à lixeira pelo Drive. Uma falha informa o estado e permite nova tentativa.
- Capitão ou Gestor autorizado pode restaurar enquanto o arquivo estiver na lixeira. A confirmação do Drive recupera o cadastro, os vínculos e as permissões anteriores e fica registrada no histórico.

## Integrações

Documentação entrega a biblioteca e a Associação a Subsistemas. As telas de outros módulos integram seus vínculos usando a consulta e a autorização da biblioteca. A validação com arquivos reais depende de uma área restrita de teste no Drive compartilhado e de acesso pelo backend.

## Referências

- [Caso de uso](../../diagramas/Diagramas%20de%20Caso%20de%20Uso/Casos_de_Uso-05%20-%20Documenta%C3%A7%C3%A3o.drawio.png) · [Diagrama de classes](../../diagramas/Diagramas%20de%20Classe/05%20Documenta%C3%A7%C3%A3o.drawio.png) · [Modelo relacional acadêmico](../../diagramas/Diagramas%20de%20Banco%20de%20Dados/01_Figuras_Principais/Figura_34_Documentacao_Arquivos_e_Versoes.png)
- [Requisitos funcionais](../requisitos/funcionais.md) · [Documentação no Figma](https://www.figma.com/design/NhEuGEDcNqW2NNMnP614YV/PROCOBAJA-ERP-%C2%B7-UI-Kit---Design-System?node-id=127-4241)

## Cenários para validar

- Consultar um Documento associado como Capitão, Gestor, Líder e Membro. Conferir busca, histórico, metadados e download direto no escopo de cada Perfil.
- Importar um arquivo existente, testar duplicidade e bloquear a importação confidencial com acesso amplo no Drive.
- Publicar uma nova Versão e simular falha do Drive. Consultar a Versão anterior e identificar uma entrada de histórico indisponível para download.
- Solicitar, aprovar e confirmar a exclusão. Testar falha, nova tentativa e restauração com os vínculos e permissões anteriores.
