CREATE TABLE IF NOT EXISTS "days" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"date" integer NOT NULL,
	"symptoms" integer NOT NULL,
	"triggers" jsonb NOT NULL
);
