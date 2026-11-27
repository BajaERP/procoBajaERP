# Governança

O Módulo 07 está planejado para atender RF28 e RF29. A página atual é provisória. [Matriz acadêmica, seção 4.1.7](../documento-de-projeto.pdf#page=32) · [Guia de modelagem](../modelagem.md)

## Biblioteca, publicação e Vigência

- O ERP mantém o conteúdo do regimento, das normas e das diretrizes, com busca por título ou tipo, histórico de Versões e indicação de qual texto vale em cada período.
- Capitão e Gestor podem preparar e editar Rascunhos. Cada edição registra resumo, autor e data. O Rascunho preparado pelo Gestor precisa estar marcado como Pronto para publicação. Uma alteração no conteúdo retira essa marcação. Só o Capitão publica e ele pode publicar diretamente um Rascunho que preparou.
- A leitura começa na publicação. Quando a vigência é futura, a Versão anterior continua valendo até a data de início. Cada documento admite uma única Versão publicada com vigência futura.
- O Capitão pode encerrar uma Vigência sem substituta ou cancelar a entrada em vigor de uma Versão futura, sempre com justificativa. No cancelamento futuro, a Versão que já estava vigente continua valendo, quando houver. O histórico preserva conteúdo e Aceites registrados. As pendências deixam de ser exigidas no encerramento, substituição ou cancelamento da respectiva Versão.
- Corrigir o texto publicado exige outra Versão. Publicação, substituição e cancelamento preservam a consistência das Vigências em operações concorrentes.

## Ciência, Aceite e pendências

- O Usuário pode registrar só a Ciência e aceitar depois, ou registrar ambos juntos. A Ciência confirma conhecimento do texto. O Aceite confirma concordância. O ERP guarda cada data associada ao Usuário e à Versão, e a pendência continua aberta até o Aceite. A repetição de uma confirmação conserva as datas originais. O Usuário consulta o comprovante com Documento, Versão e datas.
- Usuários ativos na publicação, inclusive quem publicou, recebem a pendência da nova Versão. Podem aceitar antes do início da vigência quando ela for futura. A pendência informa a data de início. Quem entra depois recebe as Versões vigentes e passa a receber a futura quando ela entrar em vigor.
- As contas desativadas saem do acompanhamento de pendências atuais, com registros preservados no histórico. Na reativação, voltam a ser exigidos os Aceites faltantes das Versões vigentes.
- Governança fornece ao Dashboard as pendências pessoais com Documento, Versão, data de início e referência de abertura. A pendência de Aceite permite continuar usando o ERP. [Dashboard e Indicadores](dashboard-e-indicadores.md)

## Permissões

| Perfil | Acesso previsto |
|---|---|
| Capitão | Cria e edita Rascunhos, consulta elaboração e histórico, aprova e publica, encerra ou cancela vigências, acompanha pendências da equipe e registra a própria Ciência e o próprio Aceite. |
| Gestor | Cria e edita Rascunhos, marca como Pronto para publicação, consulta elaboração e histórico, acompanha pendências da equipe e registra a própria Ciência e o próprio Aceite. A atribuição financeira conserva essas permissões. |
| Líder, Membro e Orientador | Consultam Versões publicadas e o histórico autorizado e registram a própria Ciência e o próprio Aceite. |

O servidor aplica esse escopo também à busca, às contagens, ao histórico e aos acessos diretos.

## Referências

- [Caso de uso](../../diagramas/Diagramas%20de%20Caso%20de%20Uso/Casos_de_Uso-07%20-%20Governan%C3%A7a.drawio.png) · [Diagrama de classes](../../diagramas/Diagramas%20de%20Classe/07%20Governan%C3%A7a.drawio.png) · [Modelo relacional acadêmico](../../diagramas/Diagramas%20de%20Banco%20de%20Dados/01_Figuras_Principais/Figura_39_Governanca_Documentos_e_Versoes.png)
- [Requisitos funcionais](../requisitos/funcionais.md) · [Governança no Figma](https://www.figma.com/design/NhEuGEDcNqW2NNMnP614YV/PROCOBAJA-ERP-%C2%B7-UI-Kit---Design-System?node-id=127-7211)

## Cenários para validar

- Editar um Rascunho pronto e confirmar que ele precisa ser marcado novamente. Verificar o acesso aos Rascunhos e a publicação por Perfil.
- Publicar uma Versão com vigência futura e verificar a leitura e o Aceite antecipado, preservando a vigência anterior. Cancelar a entrada em vigor e conferir o histórico e as pendências.
- Registrar só a Ciência e depois o Aceite. Conferir as duas datas e a baixa da pendência. Desativar e reativar uma conta e verificar o histórico e as pendências vigentes.
