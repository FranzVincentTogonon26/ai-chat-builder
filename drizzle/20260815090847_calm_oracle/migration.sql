CREATE TABLE "conversation" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_email" text,
	"visitor_ip" text,
	"name" text,
	"chatbot_id" text NOT NULL,
	"created_at" text DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid(),
	"conversation_id" text NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"created_at" text DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "widgets" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid(),
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"allowed_domains" text[],
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" text DEFAULT now()
);
