create table if not exists public.users
(
  id varchar not null
    constraint users_pk
      primary key,
  name varchar,
  auth_id varchar not null
);

alter table public.users owner to postgres;

create unique index if not exists users_auth_id_uindex
  on public.users (auth_id);

