CREATE TABLE "inventory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"supplier" text NOT NULL,
	"total_item_amount" numeric DEFAULT '0',
	"total_cost" numeric DEFAULT '0',
	"created_by" text NOT NULL,
	"is_deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory_batch" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"total_item_amount" numeric DEFAULT '0',
	"inventory_id" uuid NOT NULL,
	"total_cost" numeric DEFAULT '0',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text NOT NULL,
	"item_amount" numeric DEFAULT '0',
	"price_rate" numeric DEFAULT '0',
	"new_price_rate" numeric DEFAULT '0',
	"remark" text,
	"inventory_batch_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_batch" ADD CONSTRAINT "inventory_batch_inventory_id_inventory_id_fk" FOREIGN KEY ("inventory_id") REFERENCES "public"."inventory"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_item" ADD CONSTRAINT "inventory_item_inventory_batch_id_inventory_batch_id_fk" FOREIGN KEY ("inventory_batch_id") REFERENCES "public"."inventory_batch"("id") ON DELETE no action ON UPDATE no action;