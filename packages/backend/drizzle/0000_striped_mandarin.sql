CREATE TYPE "public"."board" AS ENUM('main', 'side', 'commander', 'considering');--> statement-breakpoint
CREATE TYPE "public"."format" AS ENUM('standard', 'pioneer', 'modern', 'legacy', 'vintage', 'pauper', 'commander', 'oathbreaker', 'other');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('public', 'limited', 'private');--> statement-breakpoint
CREATE TABLE "card" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deck_id" varchar(26) NOT NULL,
	"oracle_id" varchar(36) NOT NULL,
	"image_uri" text,
	"name" text NOT NULL,
	"card_type" text NOT NULL,
	"cmc" integer,
	"count" integer NOT NULL,
	"board" "board" DEFAULT 'main' NOT NULL,
	CONSTRAINT "unique_deck_oracle_board" UNIQUE("deck_id","oracle_id","board")
);
--> statement-breakpoint
CREATE TABLE "deck" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"format" "format" NOT NULL,
	"status" "status" DEFAULT 'public' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "card" ADD CONSTRAINT "card_deck_id_deck_id_fk" FOREIGN KEY ("deck_id") REFERENCES "public"."deck"("id") ON DELETE cascade ON UPDATE no action;