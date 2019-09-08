-- Drop table

-- DROP TABLE public.groups_bots;

CREATE TABLE public.groups_bots (
   group_id varchar NOT NULL,
   bot_id varchar NOT_NULL,
   created_on timestamp with time zone default now(),
   CONSTRAINT groups_bots_pk PRIMARY KEY (group_id, bot_id),
   FOREIGN KEY (group_id)  REFERENCES groups  (id),
   FOREIGN KEY (bot_id) REFERENCES bots (id)
);
