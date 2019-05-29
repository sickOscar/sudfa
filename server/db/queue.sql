create table if not exists public.queue
(
  id varchar not null
    constraint queue_pk
      primary key,
  botid varchar not null,
  source varchar not null,
  started varchar,
  "user" varchar not null,
  "timestamp" timestamp with time zone DEFAULT now(),
  CONSTRAINT queue_fk FOREIGN KEY (botid) REFERENCES bots(botid),
  CONSTRAINT queue_fk_1 FOREIGN KEY ("user") REFERENCES users(id)
);

alter table public.queue owner to postgres;


