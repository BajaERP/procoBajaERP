# Requisitos não funcionais

A tabela resume os objetivos de usabilidade, segurança, confiabilidade e manutenção do ERP. Os IDs seguem a referência acadêmica, que lista os itens sem prioridade. As verificações abaixo se aplicam conforme os módulos forem entregues. [Tabela 11 do Documento de Projeto de Software](../documento-de-projeto.pdf#page=35) · [Estado dos módulos](../modulos/README.md)

| ID | Requisito | Categoria |
|---|---|---|
| RNF01 | Interface simples, clara e consistente entre módulos. | Usabilidade |
| RNF02 | Interface responsiva em diferentes tamanhos de tela, sem comprometer o uso. | Usabilidade |
| RNF03 | Acesso às funcionalidades internas somente por usuários autenticados. | Segurança |
| RNF04 | Controle de acesso no backend para operações, informações e campos, considerando perfil, subsistema e confidencialidade. | Segurança |
| RNF05 | Senhas armazenadas com mecanismos seguros de hash, nunca em texto simples. | Segurança |
| RNF06 | Validar dados antes do armazenamento, conforme as regras de cada operação. | Confiabilidade |
| RNF07 | Preservar a integridade e a consistência dos dados nas operações. | Confiabilidade |
| RNF08 | Manter histórico das alterações que exigem rastreabilidade, incluindo finanças, participação, documentos e governança. | Auditoria |
| RNF09 | Compatibilidade com navegadores web modernos. | Compatibilidade |
| RNF10 | Tempo de resposta de até 3 segundos para operações comuns, em condições normais, excluindo transferência de arquivos e dependência direta de serviços externos. | Desempenho |
| RNF11 | Arquitetura modular que facilite organização, manutenção e evolução. | Manutenibilidade |
| RNF12 | Código-fonte conforme os padrões de organização e nomenclatura definidos pela equipe. | Padronização |
| RNF13 | Informar falhas ou indisponibilidade de serviços externos, como Google Drive, sem comprometer a consistência das demais informações. | Confiabilidade |

## Como verificar cada grupo

- Para RNF01, RNF02 e RNF09, verificar fluxos representativos no navegador em desktop e mobile, incluindo navegação por teclado, foco e feedback de erro. Registrar os navegadores e tamanhos de tela usados. [Arquitetura do frontend](../../../frontend/ARCHITECTURE.md)
- Para RNF03 a RNF08, exercitar a API com sessões de Perfis e Subsistemas distintos. Conferir autorização em acesso direto, campos retornados, hash das senhas, validações, gravação atômica e histórico. [Arquitetura do backend](../../../backend/ARCHITECTURE.md) · [Guia de modelagem](../modelagem.md)
- Para RNF10, definir o ambiente, a carga e as operações comuns antes de medir. O limite de três segundos se aplica às operações elegíveis dentro das condições normais acordadas. [Seção 4.2 do documento de projeto](../documento-de-projeto.pdf#page=35)
- Para RNF11 e RNF12, revisar a estrutura e as convenções do código com os guias de arquitetura. Para RNF13, simular uma falha de integração e verificar o feedback, a nova tentativa e a consistência entre o ERP e o serviço externo. [Documentação](../modulos/documentacao.md)

Um resultado de conformidade depende da evidência de execução e dos critérios de aceitação da entrega.
