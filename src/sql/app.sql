INSERT INTO sca.roles (id, module_id, name, description, createdAt, updatedAt)
SELECT UUID(), '9f0f9931-db69-4c2e-98af-e44c444952a9', 'USER', 'Usuário padrão do sistema', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM sca.roles WHERE name = 'USER');

INSERT INTO sca.roles (id, module_id, name, description, createdAt, updatedAt)
SELECT UUID(),
       '9f0f9931-db69-4c2e-98af-e44c444952a9',
       'ADMIN',
       'Gerencia todo o sistema exceto configurações críticas',
       NOW(),
       NOW()
WHERE NOT EXISTS (SELECT 1 FROM sca.roles WHERE name = 'ADMIN');

INSERT INTO sca.roles (id, module_id, name, description, createdAt, updatedAt)
SELECT UUID(), '9f0f9931-db69-4c2e-98af-e44c444952a9', 'SUPER_ADMIN', 'Acesso total ao sistema', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM sca.roles WHERE name = 'SUPER_ADMIN');



INSERT INTO sca.permissions (id, name, description, created_at, updated_at, token)
SELECT UUID(), 'Criar Pessoa', 'Permite criar uma nova pessoa no sistema', NOW(), NOW(), 'create_person'
WHERE NOT EXISTS (SELECT 1 FROM sca.permissions WHERE token = 'create_person');

INSERT INTO sca.permissions (id, name, description, created_at, updated_at, token)
SELECT UUID(), 'Editar Pessoa', 'Permite editar os dados de uma pessoa', NOW(), NOW(), 'edit_person'
WHERE NOT EXISTS (SELECT 1 FROM sca.permissions WHERE token = 'edit_person');

INSERT INTO sca.permissions (id, name, description, created_at, updated_at, token)
SELECT UUID(), 'Deletar Pessoa', 'Permite excluir uma pessoa do sistema', NOW(), NOW(), 'delete_person'
WHERE NOT EXISTS (SELECT 1 FROM sca.permissions WHERE token = 'delete_person');

INSERT INTO sca.permissions (id, name, description, created_at, updated_at, token)
SELECT UUID(), 'Listar Pessoas', 'Permite visualizar todas as pessoas cadastradas', NOW(), NOW(), 'list_people'
WHERE NOT EXISTS (SELECT 1 FROM sca.permissions WHERE token = 'list_people');


INSERT INTO sca.permissions (id, name, description, created_at, updated_at, token)
SELECT UUID(), 'Criar Evento', 'Permite criar um evento no sistema', NOW(), NOW(), 'create_event'
WHERE NOT EXISTS (SELECT 1 FROM sca.permissions WHERE token = 'create_event');

INSERT INTO sca.permissions (id, name, description, created_at, updated_at, token)
SELECT UUID(), 'Editar Evento', 'Permite editar os dados de um evento', NOW(), NOW(), 'edit_event'
WHERE NOT EXISTS (SELECT 1 FROM sca.permissions WHERE token = 'edit_event');

INSERT INTO sca.permissions (id, name, description, created_at, updated_at, token)
SELECT UUID(), 'Deletar Evento', 'Permite excluir um evento do sistema', NOW(), NOW(), 'delete_event'
WHERE NOT EXISTS (SELECT 1 FROM sca.permissions WHERE token = 'delete_event');

INSERT INTO sca.permissions (id, name, description, created_at, updated_at, token)
SELECT UUID(), 'Listar Eventos', 'Permite visualizar todos os eventos cadastrados', NOW(), NOW(), 'list_events'
WHERE NOT EXISTS (SELECT 1 FROM sca.permissions WHERE token = 'list_events');


INSERT INTO sca.permissions (id, name, description, created_at, updated_at, token)
SELECT UUID(), 'Criar Usuário', 'Permite cadastrar novos usuários no sistema', NOW(), NOW(), 'create_user'
WHERE NOT EXISTS (SELECT 1 FROM sca.permissions WHERE token = 'create_user');

INSERT INTO sca.permissions (id, name, description, created_at, updated_at, token)
SELECT UUID(), 'Editar Usuário', 'Permite editar dados dos usuários', NOW(), NOW(), 'edit_user'
WHERE NOT EXISTS (SELECT 1 FROM sca.permissions WHERE token = 'edit_user');

INSERT INTO sca.permissions (id, name, description, created_at, updated_at, token)
SELECT UUID(), 'Deletar Usuário', 'Permite remover um usuário do sistema', NOW(), NOW(), 'delete_user'
WHERE NOT EXISTS (SELECT 1 FROM sca.permissions WHERE token = 'delete_user');

INSERT INTO sca.permissions (id, name, description, created_at, updated_at, token)
SELECT UUID(), 'Listar Usuários', 'Permite visualizar todos os usuários cadastrados', NOW(), NOW(), 'list_users'
WHERE NOT EXISTS (SELECT 1 FROM sca.permissions WHERE token = 'list_users');

INSERT INTO sca.permissions (id, name, description, created_at, updated_at, token)
SELECT UUID(), 'Gerenciar Permissões', 'Permite configurar permissões de acesso para usuários', NOW(), NOW(), 'manage_permissions'
WHERE NOT EXISTS (SELECT 1 FROM sca.permissions WHERE token = 'manage_permissions');


