-- Drop table

-- DROP TABLE public.bots;

CREATE TABLE public.bots (
	botid varchar NOT NULL,
	"name" varchar NOT NULL,
	"source" varchar NOT NULL,
	"user" varchar NOT NULL,
	CONSTRAINT bots_pk PRIMARY KEY (botid),
	CONSTRAINT bots_fk FOREIGN KEY ("user") REFERENCES users(id)
);

alter table public.bots add column "timestamp" timestamp default now()
