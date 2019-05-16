-- Drop table

-- DROP TABLE public.fights;

CREATE TABLE public.fights (
                             id varchar NOT NULL,
                             bot1 varchar NOT NULL,
                             bot2 varchar NOT NULL,
                             history varchar NOT NULL,
                             winner varchar NULL,
                             "by" varchar NULL,
                             "time" timestamp NOT NULL,
                             CONSTRAINT fights_pk PRIMARY KEY (id),
                             CONSTRAINT fights_fk FOREIGN KEY (bot1) REFERENCES bots(botid),
                             CONSTRAINT fights_fk_1 FOREIGN KEY (bot2) REFERENCES bots(botid)
);
