-- Registros anteriores permanecem sem escopo e só podem ser consultados pela administração.
ALTER TABLE logs_auditoria
    ADD COLUMN subsistema_origem_id bigint,
    ADD COLUMN subsistema_destino_id bigint;

ALTER TABLE logs_auditoria
    ADD CONSTRAINT fk_auditoria_subsistema_origem
        FOREIGN KEY (subsistema_origem_id) REFERENCES subsistemas (id) ON DELETE RESTRICT,
    ADD CONSTRAINT fk_auditoria_subsistema_destino
        FOREIGN KEY (subsistema_destino_id) REFERENCES subsistemas (id) ON DELETE RESTRICT;

CREATE INDEX ix_auditoria_origem_data_id
    ON logs_auditoria (subsistema_origem_id, registrado_em DESC, id DESC);
CREATE INDEX ix_auditoria_destino_data_id
    ON logs_auditoria (subsistema_destino_id, registrado_em DESC, id DESC);
CREATE INDEX ix_auditoria_data_id
    ON logs_auditoria (registrado_em DESC, id DESC);

INSERT INTO permissoes (codigo, recurso, acao, descricao)
VALUES ('AUDITORIA_CONSULTAR', 'AUDITORIA', 'CONSULTAR',
        'Consultar eventos de auditoria conforme o escopo do Perfil e do Subsistema.');

INSERT INTO perfil_permissoes (perfil_id, permissao_id)
SELECT perfis.id, permissoes.id
FROM perfis
CROSS JOIN permissoes
WHERE perfis.nome IN ('CAPITAO_ADMIN', 'GESTOR', 'LIDER')
  AND permissoes.codigo = 'AUDITORIA_CONSULTAR';
