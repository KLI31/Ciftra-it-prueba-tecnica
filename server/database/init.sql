-- Crear base (ejecutar una sola vez fuera del script)
-- CREATE DATABASE cifra_it;

-- Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS users;
DROP TYPE IF EXISTS request_status;
DROP TYPE IF EXISTS user_role;

--Creacion de tipos personalizados
CREATE TYPE user_role AS ENUM ('CLIENT', 'SUPPORT', 'ADMIN');
CREATE TYPE request_status AS ENUM ('pending', 'in_progress', 'resolved', 'rejected');

-- Creacion tabla Usuarios
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'CLIENT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creacion tabla Solicitudes
CREATE TABLE requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES users(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(100) NOT NULL,
    status request_status NOT NULL DEFAULT 'pending',
    response TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_requests_status_support ON requests(status, assigned_to);
