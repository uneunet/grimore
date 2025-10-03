CREATE TABLE `card` (
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`deck_id` varchar(26) NOT NULL,
	`oracle_id` varchar(36) NOT NULL,
	`image_uri` text,
	`name` text NOT NULL,
	`card_type` text NOT NULL,
	`cmc` int,
	`count` int NOT NULL,
	`board` enum('main','side','commander','considering') NOT NULL DEFAULT 'main',
	CONSTRAINT `unique_deck_oracle_board` UNIQUE(`deck_id`,`oracle_id`,`board`)
);
--> statement-breakpoint
CREATE TABLE `deck` (
	`id` varchar(26) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`format` enum('standard','pioneer','modern','legacy','vintage','pauper','commander','oathbreaker','other') NOT NULL,
	`status` enum('public','limited','private') NOT NULL,
	CONSTRAINT `deck_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `card` ADD CONSTRAINT `card_deck_id_deck_id_fk` FOREIGN KEY (`deck_id`) REFERENCES `deck`(`id`) ON DELETE cascade ON UPDATE no action;