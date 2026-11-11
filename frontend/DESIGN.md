# ProcoBaja ERP — Design do frontend

Este guia reúne as decisões visuais e de interação do frontend. Para implementar uma tela, consulte o [Figma](https://www.figma.com/design/NhEuGEDcNqW2NNMnP614YV/PROCOBAJA-ERP-%C2%B7-UI-Kit---Design-System?node-id=0-1), a tela existente e os tokens em [`src/styles.css`](src/styles.css). Preserve os ajustes solicitados para o projeto quando diferirem do Figma. O CSS é a fonte dos valores em uso; a presença de uma tela no Figma não significa que ela esteja implementada.

## Linguagem visual

Priorize hierarquia clara e leitura rápida para tarefas de gestão. Use o vermelho institucional em ações principais e destaques de navegação, superfícies neutras para conteúdo e cores de estado para comunicar significado. Separe cartões e seções com bordas discretas; reserve sombras para elementos flutuantes, como menus e o drawer mobile.

Use português brasileiro na interface. Apresente dados, estados e permissões de acordo com o que estiver disponível: a sessão atual é demonstrativa, e a maioria dos módulos ainda está em construção.

## Marca, tipografia e ícones

- **Nome:** use “ProcoBaja ERP” na identificação do sistema.
- **Fontes:** DM Sans para a interface e JetBrains Mono para identificadores, códigos e valores quando fizer sentido. As famílias estão em `src/styles.css` e são carregadas em `index.html`.
- **Introdução e sidebar:** `src/assets/procobaja-logo.svg`, por meio de `LogoMark` em `src/components/shared/Logo.tsx`.
- **Login:** `src/assets/procobaja-sem-fundo.svg` no painel institucional.
- **Rodapé da sidebar:** variante transparente de `LogoMark`, que usa `src/assets/procobaja-transparente.svg`. Preserve a proporção e a adaptação ao tema.
- **Ícones:** use `lucide-react`; oculte ícones decorativos de tecnologias assistivas e dê nome acessível a botões que não tenham texto.

## Tokens, temas e estados

Use os tokens de `src/styles.css` em vez de repetir cores em componentes. No Tailwind, os nomes correspondem às classes sem o prefixo `--color-`: por exemplo, `bg-canvas`, `text-ink` e `border-hairline`.

| Uso | Tokens principais |
| --- | --- |
| Fundo da página e superfícies | `surface-soft`, `canvas`, `surface-card`, `surface-raised` |
| Texto e ícones | `ink`, `body`, `mute`, `ash`, `icon-muted` |
| Bordas e seleção | `hairline`, `hairline-soft`, `selected`, `link` |
| Marca e ação principal | `red`, `red-pressed`, `red-light`, `red-soft`, `red-tint`, `red-deep` |
| Feedback | `state-success`, `state-warning`, `state-error`, `state-info` e seus respectivos sufixos `-bg` |

Os tokens semânticos recebem valores para claro e escuro. Quando uma combinação nova não tiver token adequado, avalie ambos os temas antes de acrescentá-lo. Confira legibilidade e contraste de texto, bordas, foco e ícones sobre as superfícies onde aparecem; cor não deve ser o único sinal de estado.

A preferência de tema pode ser **Claro**, **Escuro** ou **Sistema** e é controlada por `ThemeContext`. As cores `theme-preview-light` e `theme-preview-dark` são fixas: representam as opções de aparência independentemente do tema ativo. O header não tem alternador de tema; a preferência está disponível no login e em Configurações.

## Estrutura e responsividade

- **Introdução:** apresente a marca e avance automaticamente para o login. Mantenha a animação breve e respeite `prefers-reduced-motion`.
- **Login:** no desktop, combine o painel institucional vermelho com a área de formulário. No mobile, centralize a composição, mantendo os rótulos dos campos alinhados à esquerda. O texto institucional mais longo fica oculto no mobile.
- **Shell:** a barra superior tem 56 px; a sidebar desktop tem 240 px expandida e 64 px recolhida. Abaixo de 768 px, a navegação passa a drawer, com largura de até 240 px e espaço para o fundo em telas estreitas.
- **Telas pequenas:** suporte a partir de 320 px e considere alturas reduzidas. Evite rolagem horizontal da página; quando necessário, mantenha tabelas densas em uma região rolável própria.
- **Indicadores futuros:** use uma coluna no mobile, duas no tablet e quatro no desktop, adaptando o conteúdo ao espaço disponível. Essa orientação não indica que os indicadores já existam.

## Padrões de interação

### Sidebar e header

A sidebar tem faixa vermelha à esquerda e borda neutra à direita. Diferencie a página ativa dos demais itens usando `bg-selected` e `text-link`; mantenha a seleção coerente com a rota. Cada módulo tem somente sua entrada principal, sem subitens. Em Equipe e Subsistemas, use as abas internas Integrantes e Subsistemas. No modo recolhido, centralize os ícones e mantenha nomes acessíveis.

O drawer mobile fecha pelo botão, pelo fundo ou por Escape. Ao abri-lo, mova o foco para dentro e mantenha-o contido; ao fechá-lo, devolva o foco ao botão de abertura. Ao mudar para desktop, libere o conteúdo da página.

O header contém o caminho de navegação e o avatar. Seu menu de conta mostra o nome, acesso a Configurações e a ação Sair; mantenha o fechamento por clique fora ou Escape e a restauração de foco ao fechar com Escape.

### Formulários e feedback

Associe cada rótulo ao campo e mantenha foco visível, áreas de toque adequadas e mensagens compreensíveis. No login, o RA aceita somente números; os campos e a validação atual fazem parte de um fluxo demonstrativo, sem conferência de credenciais no servidor.

Para erros, associe a mensagem ao contexto e use os tokens de erro com texto legível nos dois temas. Para interfaces com dados reais, trate carregamento, ausência de resultados e falha conforme o fluxo; não apresente dados fictícios como se viessem do servidor.

### Controles e superfícies

Mantenha botões e campos com altura mínima de 44 px e botões apenas com ícone com largura mínima de 44 px. Garanta navegação por teclado e foco visível. Prefira `rounded-md`, `rounded-lg` e `rounded-full`; reserve `rounded-2xl` a cartões de login quando usados, preservando exceções existentes necessárias ao design.

Menus e outros elementos flutuantes devem usar fundo e borda adequados ao tema, sombra discreta e comportamento de foco e fechamento coerente com a interação.

## Validação de mudanças visuais

Ao alterar uma interface:

1. Compare a parte afetada com o Figma, as decisões deste guia e os componentes existentes.
2. Verifique o conteúdo e os estados afetados, inclusive seleção, foco, erro e ausência de dados quando aplicáveis.
3. Confira os temas claro e escuro, contraste, teclado e preferência por movimento reduzido.
4. Teste em 320 px, em desktop e em telas baixas quando a mudança afetar o layout; confira o drawer nos dois lados do breakpoint quando ele for afetado.
5. Atualize este guia se uma decisão visual duradoura mudar. Para comandos de verificação, consulte [`AGENTS.md`](AGENTS.md); para rotas e sessão, consulte [`ARCHITECTURE.md`](ARCHITECTURE.md).
