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





INSERT INTO community.people (id, company_id, user_id, name, phone, email, birth_date, type, joined_at, status, config, created_at, updated_at)
SELECT
    p.id,
    '78246ef9-d415-4e99-830f-06fbf566654d' AS company_id, -- Substitua pelo ID correto
    NULL AS user_id,  -- Inicialmente NULL, pode ser atualizado depois
    p.name,
    p.phone,
    NULL AS email, -- Sem e-mail na versão antiga
    p.birth_date,
    p.type,
    p.createdAt AS joined_at,
    CASE
        WHEN p.status = 1 THEN 'active'
        ELSE 'inactive'
        END AS status,
    NULL AS config,  -- Pode ser atualizado futuramente
    p.createdAt AS created_at,
    p.updatedAt AS updated_at
FROM ichurch.people p;


INSERT INTO community.events (id, company_id, name, event_date, description, status, created_at, updated_at)
SELECT
    e.id,
    '78246ef9-d415-4e99-830f-06fbf566654d' AS company_id, -- Substitua pelo ID correto da empresa
    e.name,
    e.event_date,
    e.description,
    'active' AS status,  -- Definindo todos como "active" inicialmente
    e.createdAt AS created_at,
    e.updatedAt AS updated_at
FROM ichurch.events e;

INSERT INTO community.attendances (id, company_id, person_id, event_id, attendance_date, created_at, updated_at)
SELECT
    a.id,
    '78246ef9-d415-4e99-830f-06fbf566654d' AS company_id, -- Substitua pelo ID correto da empresa
    a.person_id,
    a.event_id,
    a.attendance_date,
    a.createdAt AS created_at,
    a.updatedAt AS updated_at
FROM ichurch.attendance a;

