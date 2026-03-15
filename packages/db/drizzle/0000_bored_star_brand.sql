CREATE TYPE "public"."status" AS ENUM('UP', 'DOWN', 'UNKNOWN');--> statement-breakpoint
CREATE TABLE "regions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"name" varchar NOT NULL,
	CONSTRAINT "regions_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "website_ticks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"response_time_ms" integer,
	"status" "status" DEFAULT 'UNKNOWN',
	"website_id" uuid NOT NULL,
	"region_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "websites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"url" varchar NOT NULL,
	CONSTRAINT "websites_url_unique" UNIQUE("url")
);
--> statement-breakpoint
ALTER TABLE "website_ticks" ADD CONSTRAINT "website_ticks_website_id_websites_id_fk" FOREIGN KEY ("website_id") REFERENCES "public"."websites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "website_ticks" ADD CONSTRAINT "website_ticks_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE no action ON UPDATE no action;