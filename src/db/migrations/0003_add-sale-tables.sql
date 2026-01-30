CREATE TABLE "sale" (
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
CREATE TABLE "sale_batch" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"total_item_amount" numeric DEFAULT '0',
	"sale_id" uuid NOT NULL,
	"total_cost" numeric DEFAULT '0',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sale_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text NOT NULL,
	"item_amount" numeric DEFAULT '0',
	"price_rate" numeric DEFAULT '0',
	"new_price_rate" numeric DEFAULT '0',
	"remark" text,
	"sale_batch_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sale" ADD CONSTRAINT "sale_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sale_batch" ADD CONSTRAINT "sale_batch_sale_id_sale_id_fk" FOREIGN KEY ("sale_id") REFERENCES "public"."sale"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sale_item" ADD CONSTRAINT "sale_item_sale_batch_id_sale_batch_id_fk" FOREIGN KEY ("sale_batch_id") REFERENCES "public"."sale_batch"("id") ON DELETE no action ON UPDATE no action;