CREATE TABLE IF NOT EXISTS "to-gather_account" (
	"user_id" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "to-gather_account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "to-gather_friend" (
	"user_id" varchar(255) NOT NULL,
	"friend_id" varchar(255) NOT NULL,
	"status" varchar(255) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "to-gather_friend_user_id_friend_id_pk" PRIMARY KEY("user_id","friend_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "to-gather_post" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"created_by" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "to-gather_session" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "to-gather_task" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"completed" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "to-gather_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "to-gather_verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "to-gather_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "to-gather_account" ADD CONSTRAINT "to-gather_account_user_id_to-gather_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."to-gather_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "to-gather_friend" ADD CONSTRAINT "to-gather_friend_user_id_to-gather_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."to-gather_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "to-gather_friend" ADD CONSTRAINT "to-gather_friend_friend_id_to-gather_user_id_fk" FOREIGN KEY ("friend_id") REFERENCES "public"."to-gather_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "to-gather_post" ADD CONSTRAINT "to-gather_post_created_by_to-gather_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."to-gather_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "to-gather_session" ADD CONSTRAINT "to-gather_session_user_id_to-gather_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."to-gather_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "to-gather_task" ADD CONSTRAINT "to-gather_task_user_id_to-gather_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."to-gather_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "to-gather_account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "friend_user_id_idx" ON "to-gather_friend" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "friend_friend_id_idx" ON "to-gather_friend" USING btree ("friend_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "created_by_idx" ON "to-gather_post" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "to-gather_post" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_user_id_idx" ON "to-gather_session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "task_user_id_idx" ON "to-gather_task" USING btree ("user_id");