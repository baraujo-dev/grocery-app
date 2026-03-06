create unique index if not exists ux_users_refresh_token_hash
    on users (refresh_token_hash);

create index if not exists ix_users_refresh_token_expires_at
    on users (refresh_token_expires_at);
