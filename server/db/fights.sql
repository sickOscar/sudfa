-- Drop table

-- DROP TABLE public.fights;

CREATE TABLE public.fights (
   id varchar NOT NULL,
   bot1 varchar NOT NULL,
   bot2 varchar NOT NULL,
   history varchar NOT NULL,
   winner varchar NULL,
   "by" varchar NULL,
   "timestamp" timestamp with time zone default now(),
   CONSTRAINT fights_pk PRIMARY KEY (id),
   CONSTRAINT fights_fk FOREIGN KEY (bot1) REFERENCES league_bots(botid),
   CONSTRAINT fights_fk_1 FOREIGN KEY (bot2) REFERENCES league_bots(botid)
);
