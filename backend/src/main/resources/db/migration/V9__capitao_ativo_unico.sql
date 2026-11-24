-- Há um único Capitão ativo. A sucessão muda os dois Perfis na mesma transação.
DO $$
DECLARE
    perfil_capitao_id bigint;
    capitaes_ativos integer;
BEGIN
    SELECT id INTO perfil_capitao_id FROM perfis WHERE nome = 'CAPITAO_ADMIN';
    IF perfil_capitao_id IS NULL THEN
        RAISE EXCEPTION 'V9 aborted: Perfil CAPITAO_ADMIN não foi encontrado.';
    END IF;

    SELECT count(*) INTO capitaes_ativos
    FROM usuarios
    WHERE ativo AND perfil_id = perfil_capitao_id;

    IF capitaes_ativos > 1 THEN
        RAISE EXCEPTION USING
            MESSAGE = 'V9 aborted: há mais de um Capitão ativo.',
            HINT = 'Defina manualmente qual conta deve permanecer como Capitão antes de executar novamente a migração.';
    END IF;

    EXECUTE format(
        'CREATE UNIQUE INDEX ux_usuario_unico_capitao_ativo ON usuarios (perfil_id) WHERE ativo AND perfil_id = %s',
        perfil_capitao_id);
END;
$$;
