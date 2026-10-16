DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM usuarios
        WHERE regexp_replace(ra, '^[[:space:]]+|[[:space:]]+$', '', 'g') = ''
    ) THEN
        RAISE EXCEPTION USING
            MESSAGE = 'V3 aborted: an existing RA is empty after trimming whitespace.',
            HINT = 'Correct the affected usuario records manually, then rerun the migration.';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM usuarios
        WHERE regexp_replace(ra, '^[[:space:]]+|[[:space:]]+$', '', 'g') ~ '[[:space:]]'
    ) THEN
        RAISE EXCEPTION USING
            MESSAGE = 'V3 aborted: an existing RA contains whitespace between characters.',
            HINT = 'Correct the affected usuario records manually, then rerun the migration.';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM usuarios
        GROUP BY regexp_replace(ra, '^[[:space:]]+|[[:space:]]+$', '', 'g')
        HAVING COUNT(*) > 1
    ) THEN
        RAISE EXCEPTION USING
            MESSAGE = 'V3 aborted: existing RAs collide after trimming whitespace.',
            HINT = 'Correct the affected usuario records manually, then rerun the migration.';
    END IF;
END;
$$;

UPDATE usuarios
SET ra = regexp_replace(ra, '^[[:space:]]+|[[:space:]]+$', '', 'g')
WHERE ra ~ '^[[:space:]]|[[:space:]]$';

CREATE FUNCTION normalizar_usuario_ra()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.ra := regexp_replace(NEW.ra, '^[[:space:]]+|[[:space:]]+$', '', 'g');
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_usuarios_normalizar_ra
    BEFORE INSERT OR UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION normalizar_usuario_ra();

ALTER TABLE usuarios
    ADD CONSTRAINT ck_usuarios_ra_sem_espacos
    CHECK (ra <> '' AND ra !~ '[[:space:]]');
