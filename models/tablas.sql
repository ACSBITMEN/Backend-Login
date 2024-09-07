-- Crear tabla de usuarios
CREATE TABLE users (
    id bigint primary key generated always as identity,
    username text unique not null,
    first_name text not null,
    last_name text not null,
    password_hash text not null,
    email text unique not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Crear tabla de roles
CREATE TABLE roles (
    id bigint primary key generated always as identity,
    role_name text unique not null,
    description text
);

-- Crear tabla de roles de usuario
CREATE TABLE user_roles (
    id bigint primary key generated always as identity,
    user_id bigint references users(id) on delete cascade,
    role_id bigint references roles(id) on delete cascade
);