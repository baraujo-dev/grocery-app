alter table users
    add column if not exists role varchar(32) not null default 'USER';
