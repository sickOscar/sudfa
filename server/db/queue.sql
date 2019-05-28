create table if not exists public.queue
(
  id varchar not null
    constraint queue_pk
      primary key,
  botid varchar,
  source varchar,
  started boolean,
  "timestamp" timestamp with time zone DEFAULT now(),
  CONSTRAINT queue_fk FOREIGN KEY (botid) REFERENCES bots(botid)
);

alter table public.queue owner to postgres;


