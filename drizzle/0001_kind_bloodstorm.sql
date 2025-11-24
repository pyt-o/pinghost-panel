CREATE TABLE `activityLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`action` varchar(255) NOT NULL,
	`details` text,
	`ipAddress` varchar(45),
	`userAgent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activityLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `creditTransactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`amount` int NOT NULL,
	`type` enum('purchase','usage','refund','bonus','admin_adjustment') NOT NULL,
	`description` text,
	`relatedServerId` int,
	`balanceBefore` int NOT NULL,
	`balanceAfter` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `creditTransactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `nodes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`location` varchar(255) NOT NULL,
	`ipAddress` varchar(45) NOT NULL,
	`port` int NOT NULL DEFAULT 2022,
	`totalRam` int NOT NULL,
	`totalDisk` int NOT NULL,
	`totalCpu` int NOT NULL,
	`usedRam` int NOT NULL DEFAULT 0,
	`usedDisk` int NOT NULL DEFAULT 0,
	`usedCpu` int NOT NULL DEFAULT 0,
	`status` enum('online','offline','maintenance') NOT NULL DEFAULT 'online',
	`isPublic` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `nodes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `packages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`ram` int NOT NULL,
	`disk` int NOT NULL,
	`cpu` int NOT NULL,
	`databases` int NOT NULL DEFAULT 0,
	`backups` int NOT NULL DEFAULT 0,
	`pricePerHour` int NOT NULL,
	`pricePerDay` int NOT NULL,
	`pricePerMonth` int NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `packages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`stripePaymentIntentId` varchar(255),
	`amount` int NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'USD',
	`creditsAmount` int NOT NULL,
	`status` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`),
	CONSTRAINT `payments_stripePaymentIntentId_unique` UNIQUE(`stripePaymentIntentId`)
);
--> statement-breakpoint
CREATE TABLE `serverDatabases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`serverId` int NOT NULL,
	`databaseName` varchar(255) NOT NULL,
	`databaseType` enum('mysql','postgresql') NOT NULL DEFAULT 'mysql',
	`username` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`host` varchar(255) NOT NULL,
	`port` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `serverDatabases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `servers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`nodeId` int NOT NULL,
	`packageId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`serverType` varchar(100) NOT NULL,
	`containerId` varchar(255),
	`imageTag` varchar(255) NOT NULL,
	`ipAddress` varchar(45),
	`port` int,
	`allocatedRam` int NOT NULL,
	`allocatedDisk` int NOT NULL,
	`allocatedCpu` int NOT NULL,
	`status` enum('installing','running','stopped','suspended','error') NOT NULL DEFAULT 'stopped',
	`autoStart` boolean NOT NULL DEFAULT false,
	`billingCycle` enum('hourly','daily','monthly') NOT NULL DEFAULT 'monthly',
	`lastBilledAt` timestamp,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `servers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ticketMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ticketId` int NOT NULL,
	`userId` int NOT NULL,
	`message` text NOT NULL,
	`isStaffReply` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ticketMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tickets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`subject` varchar(255) NOT NULL,
	`priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
	`status` enum('open','in_progress','waiting_user','closed') NOT NULL DEFAULT 'open',
	`category` varchar(100) NOT NULL,
	`relatedServerId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`closedAt` timestamp,
	CONSTRAINT `tickets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `credits` int DEFAULT 0 NOT NULL;