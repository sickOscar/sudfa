-- Drop table

-- DROP TABLE public.groups;

CREATE TABLE public.groups (
   id uuid NOT NULL DEFAULT uuid_generate_v4(),
   name varchar NOT NULL,
   owner varchar NOT NULL,
   leaderboard json NOT NULL,
   is_public boolean NOT NULL,
   created_on timestamp with time zone default now(),
   CONSTRAINT groups_pk PRIMARY KEY (id),
   CONSTRAINT groups_fk FOREIGN KEY (owner) REFERENCES users(id)
);
