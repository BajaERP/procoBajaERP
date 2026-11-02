# ProcoBaja ERP — Design do frontend

Este documento descreve os padrões visuais do frontend integrado e orienta novas interfaces. O [Figma](https://www.figma.com/design/NhEuGEDcNqW2NNMnP614YV/PROCOBAJA-ERP-%C2%B7-UI-Kit---Design-System?node-id=0-1) é a referência visual; `src/styles.css` contém os valores efetivamente usados. Ao encontrar diferenças, considere as decisões já solicitadas para o projeto e confira a implementação antes de alterar qualquer um deles. Nem todas as telas e estados do Figma estão implementados.

## Princípios

- Priorize clareza, hierarquia e leitura rápida para tarefas de gestão.
- Use o vermelho da marca para ações principais e navegação selecionada; use cores semânticas para estados.
- Separe superfícies por bordas discretas. Reserve sombras para elementos flutuantes, como menus e drawers.
- Mantenha textos em português brasileiro e adapte o layout a telas pequenas, temas claro e escuro e preferência por movimento reduzido.

## Marca, tipografia e ícones

A interface usa **DM Sans**; **JetBrains Mono** é reservada a identificadores, códigos e valores quando necessário. As fontes e seus fallbacks são definidos em `src/styles.css` e carregados em `index.html`.

- `src/assets/procobaja-logo.svg`: marca sobre fundo vermelho, usada na introdução e no topo da sidebar.
- `src/assets/procobaja-sem-fundo.svg`: marca usada no painel institucional do login.
- `src/assets/procobaja-transparente.svg`: versão transparente usada no rodapé da sidebar; sua proporção é preservada por `LogoMark` em `src/components/shared/Logo.tsx`.
- Use `lucide-react` para ícones de interface. Ícones decorativos devem ser ocultados de tecnologias assistivas; botões com apenas ícone precisam de nome acessível.

## Cores e superfícies

Use os tokens semânticos de `src/styles.css` em vez de repetir valores em componentes. Os valores abaixo documentam os principais papéis; o CSS é a referência completa.

| Papel | Token | Claro | Escuro |
|---|---|---|---|
| Página | `surface-soft` | `#fbfbf9` | `#0a0a0a` |
| Superfície principal | `canvas` | `#ffffff` | `#141414` |
| Superfície secundária | `surface-card` | `#f6f6f3` | `#1b1b1b` |
| Texto principal | `ink` | `#000000` | `#f5f5f5` |
| Texto secundário | `body` | `#33332e` | `#e5e5e5` |
| Texto auxiliar | `mute` | `#62625b` | `#adadb4` |
| Borda | `hairline` | `#dadad3` | `#303030` |
| Fundo selecionado | `selected` | `#fdf2f3` | `#37171d` |
| Texto de destaque | `link` | `#850305` | `#ff858a` |

A escala institucional inclui `red-tint` (`#fdf2f3`), `red-soft` (`#fbd9dc`), `red-light` (`#e33738`), `red` (`#850305`), `red-pressed` (`#6b0304`) e `red-deep` (`#4a0203`). Para estados, prefira os pares `state-success`, `state-warning`, `state-error` e `state-info` com seus respectivos `-bg`; eles possuem valores para os dois temas. Ao usar cores de estado fora desses tokens, defina e verifique as variantes de ambos os temas.

As prévias de aparência usam `theme-preview-light` (`#e5e5e0`) e `theme-preview-dark` (`#141414`): são fixos para representar cada opção independentemente do tema ativo.

## Estrutura e responsividade

- A introdução apresenta a marca e avança automaticamente para o login. A animação é breve e respeita `prefers-reduced-motion`.
- O login usa um painel institucional vermelho e uma área de formulário. No mobile, a composição é centralizada; o formulário mantém rótulos alinhados à esquerda.
- O shell autenticado tem sidebar e barra superior de 56 px. A sidebar desktop tem 240 px expandida e 64 px recolhida; abaixo de 768 px torna-se um drawer de até 240 px.
- O drawer deve permitir fechamento por botão, fundo e Escape, conter o foco enquanto aberto e devolvê-lo ao controle de abertura. A mudança para desktop deve liberar o conteúdo.
- Suporte larguras a partir de 320 px e telas baixas. Controles de toque e teclado têm alvo mínimo de 44 px; tabelas densas devem rolar em sua própria região.
- Para futuros indicadores, use uma coluna no mobile, duas no tablet e quatro no desktop. Esses padrões não significam que as telas já estejam implementadas.

## Navegação e componentes

- **Sidebar:** faixa institucional vermelha à esquerda, borda neutra à direita, grupos de navegação e estado ativo com `bg-selected text-link`. Módulos com subitens usam expansão; somente um fica expandido por vez. Mantenha ícones centralizados e com nome acessível no modo recolhido.
- **Barra superior:** breadcrumbs e avatar com menu de conta. O header não possui alternador de tema; a preferência é acessível em Configurações e no login.
- **Campos:** rótulo associado ao controle, borda e foco visível. Preserve tamanhos de toque e mensagens de erro legíveis nos dois temas.
- **Erros:** use os tokens semânticos de erro e uma mensagem clara. Não simule validação de credenciais enquanto a autenticação real não estiver conectada.
- **Botões e superfícies:** prefira `rounded-md`, `rounded-lg` e `rounded-full`; `rounded-2xl` fica reservado a cartões de login quando usados. Preserve as exceções já presentes quando forem necessárias à fidelidade do design.
- **Menus flutuantes:** use fundo e bordas adequados ao tema, com sombra discreta, foco visível e fechamento por Escape quando aplicável.

A navegação por perfil e vários módulos ainda são protótipos. Os estados visuais não substituem autorização no backend; não invente dados de usuário ou permissões para completar uma tela.

## Validação visual

Ao alterar uma interface, compare a seção relevante do Figma com os componentes e tokens existentes. Verifique conteúdo real, estados vazio e de erro, foco e contraste nos temas claro e escuro. Quando afetados, confira também telas de 320 px, desktop e movimento reduzido. Atualize este documento quando mudarem tokens ou decisões visuais duradouras.

Para organização do código e comandos de verificação, consulte `AGENTS.md`; para fluxo de rotas e sessão, consulte `ARCHITECTURE.md`.
