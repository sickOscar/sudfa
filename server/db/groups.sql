-- Drop table

-- DROP TABLE public.groups;

CREATE TABLE public.groups (
   id varchar NOT NULL,
   name varchar NOT_NULL,
   owner varchar NOT NULL,
   leaderboard json NOT NULL,
   is_public boolean NOT_NULL,
   created_on timestamp with time zone default now(),
   CONSTRAINT groups_pk PRIMARY KEY (id),
   CONSTRAINT groups_fk FOREIGN KEY (owner) REFERENCES users(id)
);
