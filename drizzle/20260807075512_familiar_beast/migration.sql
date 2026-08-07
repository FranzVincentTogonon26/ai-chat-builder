CREATE TABLE "metadata" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_email" text NOT NULL,
	"business_name" text NOT NULL,
	"industry" text NOT NULL,
	"description" text,
	"created_at" text DEFAULT now()
);
