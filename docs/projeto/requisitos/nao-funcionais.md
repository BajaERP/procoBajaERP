# Requisitos não funcionais

Síntese da tabela 11 do [Documento de Projeto de Software](../documento-de-projeto.pdf#page=35), seção 4.2, páginas 35–37. Os requisitos representam objetivos do sistema proposto; sua presença aqui não comprova implementação ou conformidade. O documento original não atribui prioridades a esses itens.

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

## Como verificar

- RNF01–RNF02 e RNF09: avaliar fluxos representativos nos dispositivos e navegadores suportados, incluindo navegação e mensagens de erro.
- RNF03–RNF08: testar acesso direto à API, escopo dos dados, armazenamento de senha, validações, integridade e histórico no backend; ocultar elementos na interface não é suficiente.
- RNF10: medir operações comuns nas condições normais definidas para o ambiente; transferências de arquivos e chamadas diretamente dependentes de serviços externos ficam fora do limite informado no PDF.
- RNF11–RNF13: revisar organização do código e simular falhas de integrações para conferir mensagens e consistência.

O PDF não define uma matriz de dispositivos, condições de carga ou plano completo de medição; esses detalhes devem ser acordados antes de afirmar conformidade. A verificação de cada requisito deve considerar seu contexto e critérios de aceitação específicos. Consulte o PDF para o texto completo e os documentos de arquitetura do [frontend](../../../frontend/ARCHITECTURE.md) e do [backend](../../../backend/ARCHITECTURE.md) para o estado e as decisões técnicas do projeto.
