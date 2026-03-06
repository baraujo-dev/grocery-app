create table if not exists grocery_list_shared_users (
    grocery_list_id uuid not null,
    user_id uuid not null,
    primary key (grocery_list_id, user_id),
    constraint fk_shared_list
        foreign key (grocery_list_id) references grocery_lists(id) on delete cascade,
    constraint fk_shared_user
        foreign key (user_id) references users(id) on delete cascade
);
