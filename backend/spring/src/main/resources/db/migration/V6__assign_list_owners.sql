-- Assign existing lists without an owner to the admin user (first admin found).
with admin_user as (
    select id
    from users
    where role = 'ADMIN'
    order by username asc
    limit 1
)
update grocery_lists
set owner_id = (select id from admin_user)
where owner_id is null
  and exists (select 1 from admin_user);
