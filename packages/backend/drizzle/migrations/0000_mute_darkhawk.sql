CREATE TABLE `deck` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer,
	`update_at` integer,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`format` text NOT NULL,
	`status` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `deckCards` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer,
	`update_at` integer,
	`deck_id` text,
	`oracle_id` text NOT NULL,
	`image_uri` text NOT NULL,
	`name` text NOT NULL,
	`card_type` text NOT NULL,
	`cmc` integer NOT NULL,
	`amounts` integer NOT NULL,
	`board` text NOT NULL,
	FOREIGN KEY (`deck_id`) REFERENCES `deck`(`id`) ON UPDATE no action ON DELETE cascade
);
