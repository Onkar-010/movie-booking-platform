CREATE TABLE "city" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"city_name" varchar(255) NOT NULL,
	"state_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "country" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"country_name" varchar(255) NOT NULL,
	CONSTRAINT "country_country_name_unique" UNIQUE("country_name")
);
--> statement-breakpoint
CREATE TABLE "state" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"state_name" varchar(255) NOT NULL,
	"country_id" uuid NOT NULL,
	CONSTRAINT "state_country_id_state_name_unique" UNIQUE("country_id","state_name")
);
--> statement-breakpoint
CREATE TABLE "theater_admin" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"theater_id" uuid NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"password_updated_at" timestamp DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "theater_admin_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "theater" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"city_id" uuid NOT NULL,
	"address" varchar(500) NOT NULL,
	"pincode" varchar(6) NOT NULL,
	"latitude" numeric(9, 6) NOT NULL,
	"longitude" numeric(9, 6) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"password_updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "city" ADD CONSTRAINT "city_state_id_state_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."state"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "state" ADD CONSTRAINT "state_country_id_country_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."country"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "theater_admin" ADD CONSTRAINT "theater_admin_theater_id_theater_id_fk" FOREIGN KEY ("theater_id") REFERENCES "public"."theater"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "theater" ADD CONSTRAINT "theater_city_id_city_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."city"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "theater_admin_theater_idx" ON "theater_admin" USING btree ("theater_id");--> statement-breakpoint
CREATE INDEX "theater_city_idx" ON "theater" USING btree ("city_id");