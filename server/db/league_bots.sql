create table if not exists public.league_bots
(
  botid varchar not null
    constraint league_bots_pk
      primary key,
  name varchar not null,
  source varchar not null,
  "user" varchar not null
    constraint league_bots_fk
      references public.users,
  "timestamp" timestamp with time zone default now(),
  team json
);

alter table public.league_bots owner to postgres;
