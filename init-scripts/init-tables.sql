CREATE extension IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    email TEXT NOT NULL,
    hash TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users (email);

CREATE INDEX idx_users_id ON users (user_id);


CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    owner_id UUID NOT NULL,
    name TEXT NOT NULL DEFAULT 'unnamed item',
    description TEXT NOT NULL DEFAULT 'no description',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB NOT NULL DEFAULT '{}',
    parents_refs UUID[],
    children_refs UUID[],

    FOREIGN KEY (owner_id) REFERENCES users(user_id)
);

CREATE INDEX idx_refs_owner_id ON items (owner_id);
