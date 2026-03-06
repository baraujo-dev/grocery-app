-- One-time helper: normalize usernames to lowercase emails.
update users
set username = lower(trim(username));

update users
set username = username || '@x.com'
where position('@' in username) = 0;

create unique index if not exists users_username_lower_unique
    on users (lower(username));
