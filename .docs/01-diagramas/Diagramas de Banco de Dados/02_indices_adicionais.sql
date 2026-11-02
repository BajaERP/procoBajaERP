-- ERP PROCOBAJA — complemento ao esquema exportado da V4 (PostgreSQL)
-- Executar somente DEPOIS de exportar e aplicar o SQL da V4 em um PostgreSQL DE TESTE.
-- Este arquivo nao substitui o esquema completo, nem valida sozinho regras de negocio.
-- Para migrar um banco V3 existente, criar migracao propria: NAO reaplicar o DDL em producao.

BEGIN;

-- Uma atividade nao pode ocupar duas sprints abertas ao mesmo tempo.
-- A transferencia deve encerrar a alocacao anterior antes de abrir a proxima,
-- dentro da mesma transacao do backend.
CREATE UNIQUE INDEX IF NOT EXISTS ux_atividades_sprints_uma_aberta
    ON public.atividades_sprints (atividade_id)
    WHERE saida_em IS NULL;

-- Historico de lancamentos de uma compra pode conter linhas CANCELADAS,
-- mas deve existir NO MAXIMO um debito ATIVO por compra.
-- A aplicacao deve bloquear o pagamento duplicado e sincronizar compra/status/previsao.
CREATE UNIQUE INDEX IF NOT EXISTS ux_movimentacoes_pagamento_ativo_por_compra
    ON public.movimentacoes_financeiras (compra_id)
    WHERE compra_id IS NOT NULL AND situacao = 'ATIVA';

COMMIT;

-- Catalogo inicial OPCIONAL (propostas, nao taxonomia oficial do PROCOBAJA):
-- As categorias DEVEM existir antes do primeiro cadastro financeiro, pois sao obrigatorias.
-- INSERT INTO public.categorias_financeiras (nome, tipo) VALUES
--   ('Inscricao', 'SAIDA'),
--   ('Transporte', 'SAIDA'),
--   ('Hospedagem', 'SAIDA'),
--   ('Alimentacao', 'SAIDA'),
--   ('Materiais', 'SAIDA'),
--   ('Manutencao', 'SAIDA'),
--   ('Outras despesas', 'SAIDA'),
--   ('Patrocinio', 'ENTRADA'),
--   ('Doacao', 'ENTRADA'),
--   ('Auxilio financeiro', 'ENTRADA'),
--   ('Outras entradas', 'ENTRADA')
-- ON CONFLICT (tipo, nome) DO NOTHING;

-- REGRAS QUE EXIGEM BACKEND, TRANSACOES E/OU TRIGGERS (NAO GARANTIDAS PELAS FKs):
-- 1. Somente Capitao e Financeiro leem/alteram informacoes monetarias protegidas.
-- 2. Solicitacoes enviadas: >=3 cotacoes, perfis legitimados, revisao atual imutavel.
-- 3. Aprovacao conjunta valida dos dois papeis na revisao atual antes do pagamento.
-- 4. Um Financeiro ativo esta vinculado a um unico Gestor e o vinculo so muda pelo Capitao.
-- 5. Pagamento, compra REALIZADA_PAGA, previsao REALIZADA e movimentacao SAIDA em transacao unica.
-- 6. Ao cancelar pagamento, reconciliar status da compra e previsao sem apagar historicos.
-- 7. Movimentacao efetiva vinculada a previsao precisa estar ATIVA e ser apropriada
--    a solicitacao/evento/categoria; FK garante apenas existencia e tipo da movimentacao.
-- 8. Categorias inativas nao podem ser escolhidas em novos registros.
-- 9. No dashboard e nas pesquisas operacionais, NUNCA expor dados financeiros restritos.
-- 10. Imutabilidade de documentos/versoes e logs confidenciais; integracao Drive resiliente.
