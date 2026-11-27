# ProcoBaja ERP — Design do frontend

Compare os componentes existentes e os [tokens em uso](src/styles.css) com a referência visual antes de implementar uma tela. Preserve os ajustes registrados neste guia. [Figma do projeto](https://www.figma.com/design/NhEuGEDcNqW2NNMnP614YV/PROCOBAJA-ERP-%C2%B7-UI-Kit---Design-System?node-id=0-1).

Para conferir quais rotas estão implementadas, consulte a [arquitetura do frontend](ARCHITECTURE.md).

## Linguagem visual

Priorize hierarquia clara e leitura rápida para tarefas de gestão. Use o vermelho institucional em ações principais e destaques de navegação, superfícies neutras para conteúdo e cores de estado para comunicar significado. Separe cartões e seções com bordas discretas; reserve sombras para elementos flutuantes, como menus e o drawer mobile.

Use português brasileiro na interface. Nas telas integradas, apresente os dados e as ações disponíveis para a sessão atual e dê retorno compreensível quando a API recusar uma operação.

## Marca, tipografia e ícones

- Use **ProcoBaja ERP** na identificação do sistema.
- Use **DM Sans** para a interface e **JetBrains Mono** para identificadores, códigos e valores que precisem de largura uniforme. O [HTML de entrada](index.html) carrega as fontes.
- Na introdução e na sidebar, use `LogoMark` com [`procobaja-logo.svg`](src/assets/procobaja-logo.svg). Para o rodapé da sidebar, use a variante [transparente](src/assets/procobaja-transparente.svg). Preserve a proporção e a adaptação ao tema. [Componente LogoMark](src/components/shared/Logo.tsx).
- No painel institucional do login, use [`procobaja-sem-fundo.svg`](src/assets/procobaja-sem-fundo.svg).
- Use `lucide-react` para ícones, oculte os decorativos de tecnologias assistivas e dê nome acessível aos botões que tenham somente ícone.

## Tokens, temas e estados

Use os tokens de `src/styles.css` nos componentes. Por exemplo, os tokens `canvas`, `ink` e `hairline` geram classes do Tailwind como `bg-canvas`, `text-ink` e `border-hairline`.

| Uso | Tokens principais |
| --- | --- |
| Fundo da página e superfícies | `surface-soft`, `canvas`, `surface-card`, `surface-raised` |
| Texto e ícones | `ink`, `body`, `mute`, `ash`, `icon-muted` |
| Bordas e seleção | `hairline`, `hairline-soft`, `selected`, `link` |
| Marca e ação principal | `red`, `red-pressed`, `red-light`, `red-soft`, `red-tint`, `red-deep` |
| Feedback | `state-success`, `state-warning`, `state-error`, `state-info` e seus respectivos sufixos `-bg` |

Os tokens semânticos recebem valores para claro e escuro. Ao acrescentar um token, avalie a combinação nos dois temas. Confira o contraste de texto, bordas, indicadores de foco e ícones sobre as superfícies em que aparecem. Combine a cor com texto, ícone rotulado ou outro sinal perceptível para comunicar estados.

A preferência de tema está disponível no login e em **Configurações → Aparência**. Ofereça as opções **Claro**, **Escuro** e **Sistema**. Use `theme-preview-light` e `theme-preview-dark` para representar cores fixas das opções de aparência em qualquer tema ativo.

## Estrutura e responsividade

- Na introdução, apresente a marca e avance automaticamente para o login. Mantenha a animação breve e respeite `prefers-reduced-motion`.
- No desktop, combine o painel institucional vermelho com a área de formulário. No mobile, centralize a composição, mantenha os rótulos alinhados à esquerda e exiba a versão curta do painel institucional.
- Preserve a barra superior de 56 px e a sidebar desktop de 240 px quando expandida e 64 px quando recolhida. Abaixo de 768 px, use o drawer de até 240 px com espaço para o fundo em telas estreitas.
- Suporte telas a partir de 320 px e alturas reduzidas. Em tabelas densas, restrinja a rolagem horizontal à região da tabela quando necessário.
- Ao implementar indicadores, use uma coluna no mobile, duas no tablet e quatro no desktop. Adapte o conteúdo ao espaço disponível.

## Padrões de interação

### Sidebar e header

A sidebar tem faixa vermelha à esquerda e borda neutra à direita. Use `bg-selected` e `text-link` no item ativo e mantenha sua seleção coerente com a rota. Use uma entrada principal por módulo. No modo recolhido, centralize os ícones e mantenha os nomes acessíveis.

O drawer mobile fecha pelo botão, pelo fundo ou por Escape. Ao abri-lo, mova o foco para dentro e mantenha-o contido. Ao fechar dentro do layout mobile, devolva o foco ao botão de abertura. Ao mudar para desktop, libere o conteúdo da página.

A barra superior contém o caminho de navegação e o avatar. O menu da conta mostra o nome, acesso a Configurações e a ação Sair. Preserve o fechamento por clique fora ou Escape e a restauração de foco ao fechar com Escape.

No modo demonstrativo, mantenha no seletor **Dev** a escolha de perspectiva e de pessoa ativa, com rolagem interna em telas estreitas ou baixas. Indique a demonstração no menu da conta e na sidebar. Em Configurações, exiba o subsistema e a situação da troca de senha. Preserve o aviso de identidade indisponível após fechar o seletor e a confirmação antes de restaurar os dados demonstrativos.

### Equipe e Subsistemas

Use as abas internas **Integrantes** e **Subsistemas**. Apresente **Histórico** a quem tem `AUDITORIA_CONSULTAR`. **Perfis e permissões** é uma consulta informativa aberta em diálogo. A consulta **Responsabilidade financeira** abre como painel lateral no desktop e ocupa toda a tela no mobile. Preserve a rolagem interna e o retorno de foco ao fechar os diálogos.

O Histórico apresenta cartões responsivos com ação, tipo de registro, data, ator e escopo. Use a descrição fornecida pela API e mantenha a exibição limitada aos campos públicos da consulta. Inclua filtros rotulados, carregamento, vazio, recuperação de falha e paginação acessível.

### Formulários e feedback

Associe cada rótulo ao campo e mantenha foco visível, áreas de toque adequadas e mensagens compreensíveis. No login, preserve a entrada numérica para o RA e uma indicação visível durante o envio. Em modo API, apresente separadamente a falha do login e a falha ao verificar a sessão. Quando a troca de senha for obrigatória, mantenha o formulário antes do shell e exiba orientações para concluir a troca.

Associe erros aos campos ou à ação correspondente e use os tokens de erro com texto legível nos dois temas. Trate carregamento, ausência de resultados e falha conforme o fluxo. Em modo API, mantenha cada estado coerente com o retorno do servidor.

### Controles e superfícies

Mantenha botões e campos com altura mínima de 44 px e botões apenas com ícone com largura mínima de 44 px. Garanta navegação por teclado e foco visível. Prefira `rounded-md`, `rounded-lg` e `rounded-full`; reserve `rounded-2xl` a cartões de login quando usados, preservando exceções existentes necessárias ao design.

Menus e outros elementos flutuantes devem usar fundo e borda adequados ao tema, sombra discreta e comportamento de foco e fechamento coerente com a interação.

## Validação de mudanças visuais

Ao alterar uma interface, siga estes passos.

1. Compare a parte afetada com o Figma, as decisões deste guia e os componentes existentes.
2. Verifique o conteúdo e os estados afetados, inclusive seleção, foco, erro e ausência de dados quando aplicáveis.
3. Confira os temas claro e escuro, contraste, teclado e preferência por movimento reduzido.
4. Teste em 320 px, em desktop e em telas baixas quando a mudança afetar o layout; confira o drawer nos dois lados do breakpoint quando ele for afetado.
5. Atualize este guia se uma decisão visual duradoura mudar. Consulte os [comandos de verificação](AGENTS.md#verificação) e, quando aplicável, o [fluxo de navegação e sessão](ARCHITECTURE.md#rotas-e-navegação).
