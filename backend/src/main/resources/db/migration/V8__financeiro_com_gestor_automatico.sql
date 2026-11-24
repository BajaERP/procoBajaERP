-- A responsabilidade financeira passa a ser determinada pela associação de um Gestor ao
-- Subsistema canônico Financeiro. O histórico permanece nos logs_auditoria.
DO $$
DECLARE
    quantidade_financeiros integer;
    subsistema_financeiro_id bigint;
    perfil_gestor_id bigint;
    gestor_atribuido_id bigint;
    gestor_ja_associado_id bigint;
BEGIN
    SELECT count(*) INTO quantidade_financeiros
    FROM subsistemas
    WHERE lower(nome) = lower('Financeiro');

    IF quantidade_financeiros > 1 THEN
        RAISE EXCEPTION USING
            MESSAGE = 'V8 aborted: mais de um Subsistema corresponde ao nome Financeiro.',
            HINT = 'Normalize os nomes duplicados antes de executar novamente a migração.';
    END IF;

    SELECT id INTO subsistema_financeiro_id
    FROM subsistemas
    WHERE lower(nome) = lower('Financeiro')
    FOR UPDATE;

    IF subsistema_financeiro_id IS NULL THEN
        INSERT INTO subsistemas (nome, descricao)
        VALUES ('Financeiro', 'Gestão administrativa e financeira da equipe.')
        RETURNING id INTO subsistema_financeiro_id;
    ELSE
        UPDATE subsistemas
        SET nome = 'Financeiro'
        WHERE id = subsistema_financeiro_id;
    END IF;

    SELECT id INTO perfil_gestor_id FROM perfis WHERE nome = 'GESTOR';

    SELECT u.id INTO gestor_atribuido_id
    FROM atribuicao_financeira a
    JOIN usuarios u ON u.id = a.gestor_usuario_id
    WHERE u.ativo AND u.perfil_id = perfil_gestor_id;

    SELECT id INTO gestor_ja_associado_id
    FROM usuarios
    WHERE ativo
      AND perfil_id = perfil_gestor_id
      AND subsistema_id = subsistema_financeiro_id
    LIMIT 1;

    IF gestor_atribuido_id IS NOT NULL
       AND gestor_ja_associado_id IS NOT NULL
       AND gestor_atribuido_id <> gestor_ja_associado_id THEN
        RAISE EXCEPTION USING
            MESSAGE = 'V8 aborted: a atribuição financeira atual diverge do Gestor já associado a Financeiro.',
            HINT = 'Resolva a divergência manualmente antes de executar novamente a migração.';
    END IF;

    IF gestor_atribuido_id IS NOT NULL THEN
        UPDATE usuarios
        SET subsistema_id = subsistema_financeiro_id
        WHERE id = gestor_atribuido_id;
    END IF;

    IF (SELECT count(*) FROM usuarios
        WHERE subsistema_id = subsistema_financeiro_id
          AND perfil_id = perfil_gestor_id
          AND ativo) > 1 THEN
        RAISE EXCEPTION USING
            MESSAGE = 'V8 aborted: há mais de um Gestor ativo associado ao Subsistema Financeiro.',
            HINT = 'Mova ou desative os Gestores excedentes e execute novamente a migração.';
    END IF;

    EXECUTE format(
        'CREATE UNIQUE INDEX ux_financeiro_um_gestor_ativo ON usuarios (subsistema_id) '
        || 'WHERE ativo AND perfil_id = %s AND subsistema_id = %s',
        perfil_gestor_id,
        subsistema_financeiro_id);

    -- A tabela continha somente o estado atual; os eventos históricos já estão na auditoria.
    DELETE FROM perfil_permissoes
    WHERE permissao_id IN (SELECT id FROM permissoes WHERE codigo = 'ATRIBUICAO_FINANCEIRA_GERENCIAR');
    DELETE FROM permissoes WHERE codigo = 'ATRIBUICAO_FINANCEIRA_GERENCIAR';
    DROP TABLE atribuicao_financeira;
END;
$$;

COMMENT ON TABLE subsistemas IS
    'Financeiro é um Subsistema canônico. Seu Gestor ativo é automaticamente o Gestor Financeiro; no máximo um Gestor ativo pode pertencer a ele.';
