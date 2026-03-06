alter table users
    add column if not exists refresh_token_hash varchar(512);

alter table users
    add column if not exists refresh_token_expires_at timestamp;
