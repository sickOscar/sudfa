-- Drop table

-- DROP TABLE public.groups_users;

CREATE TABLE public.groups_users (
   group_id uuid NOT NULL,
   user_id varchar NOT NULL,
   created_on timestamp with time zone default now(),
   CONSTRAINT groups_users_pk PRIMARY KEY (group_id, user_id),
   FOREIGN KEY (group_id)  REFERENCES groups  (id),
   FOREIGN KEY (user_id) REFERENCES users (id)
);
