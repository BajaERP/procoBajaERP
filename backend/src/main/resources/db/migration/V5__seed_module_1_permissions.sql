-- Catálogo de permissões do módulo 1 (Equipe e Subsistemas) e a matriz fixa por Perfil.
-- As permissões liberam a operação; hierarquia de Perfis, Subsistema e visibilidade são conferidos no backend.

INSERT INTO permissoes (codigo, recurso, acao, descricao) VALUES
    ('EQUIPE_CONSULTAR', 'EQUIPE', 'CONSULTAR',
     'Consultar Usuários, Subsistemas, Composições e Vínculos conforme o que o Perfil pode ver.'),
    ('USUARIOS_GERENCIAR', 'USUARIOS', 'GERENCIAR',
     'Cadastrar, corrigir, trocar o Perfil, desativar, reativar e redefinir a senha de Usuários dos Perfis administrados.'),
    ('SUBSISTEMAS_GERENCIAR', 'SUBSISTEMAS', 'GERENCIAR',
     'Criar, editar e desativar Subsistemas, definir Líderes e transferir Integrantes.'),
    ('VINCULOS_GERENCIAR', 'VINCULOS_FINANCEIRO_GESTOR', 'GERENCIAR',
     'Definir, alterar, transferir e remover Vínculos Financeiro–Gestor.');

INSERT INTO perfil_permissoes (perfil_id, permissao_id)
SELECT pe.id, pm.id
FROM (VALUES
        ('CAPITAO_ADMIN', 'EQUIPE_CONSULTAR'),
        ('CAPITAO_ADMIN', 'USUARIOS_GERENCIAR'),
        ('CAPITAO_ADMIN', 'SUBSISTEMAS_GERENCIAR'),
        ('CAPITAO_ADMIN', 'VINCULOS_GERENCIAR'),
        ('GESTOR', 'EQUIPE_CONSULTAR'),
        ('GESTOR', 'USUARIOS_GERENCIAR'),
        ('GESTOR', 'SUBSISTEMAS_GERENCIAR'),
        ('FINANCEIRO', 'EQUIPE_CONSULTAR'),
        ('LIDER', 'EQUIPE_CONSULTAR'),
        ('MEMBRO', 'EQUIPE_CONSULTAR'),
        ('ORIENTADOR', 'EQUIPE_CONSULTAR')
    ) AS matriz (perfil, permissao)
JOIN perfis pe ON pe.nome = matriz.perfil
JOIN permissoes pm ON pm.codigo = matriz.permissao;
