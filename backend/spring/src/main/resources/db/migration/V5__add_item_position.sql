alter table grocery_items
    add column if not exists position int not null default 0;

with ranked as (
    select
        id,
        row_number() over (
            partition by grocery_list_id
            order by added_at asc, id asc
        ) - 1 as rn
    from grocery_items
)
update grocery_items gi
set position = ranked.rn
from ranked
where gi.id = ranked.id;
