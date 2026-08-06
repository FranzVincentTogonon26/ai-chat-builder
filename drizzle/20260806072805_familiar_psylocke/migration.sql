CREATE TABLE "users" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid(),
	"organization_id" text NOT NULL,
	"name" text,
	"email" text NOT NULL UNIQUE,
	"image" text,
	"created_at" text DEFAULT now()
);
