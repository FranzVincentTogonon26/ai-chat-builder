import { sql } from "drizzle-orm";
import { text, pgTable } from "drizzle-orm/pg-core";

export const user = pgTable("users", {
  id: text()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  organization_id: text("organization_id").notNull(),
  name: text("name"),
  email: text("email").notNull().unique(),
  image: text("image"),
  created_at: text("created_at").default(sql`now()`),
});

export const metadata = pgTable("metadata", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  user_email: text("user_email").notNull(),
  business_name: text("business_name").notNull(),
  industry: text("industry").notNull(),
  description: text("description"),
  created_at: text("created_at").default(sql`now()`),
});

export const knowledge = pgTable("knowledge", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  user_email: text("user_email").notNull(),
  type: text("type").notNull(),
  name: text("name").notNull(),
  status: text("status").notNull().default("active"),
  source_url: text("source_url"),
  content: text("content"),
  meta_data: text("meta_data"),
  last_updated: text("last_updated").default(sql`now()`),
  created_at: text("created_at").default(sql`now()`),
});

export const sections = pgTable("sections", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  user_email: text("user_email").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  source_ids: text("source_ids").array().notNull(),
  tone: text("tone").notNull(),
  allowed_topics: text("allowed_topics").array(),
  blocked_topics: text("blocked_topics").array(),
  status: text("status").notNull().default("active"),
  created_at: text("created_at").default(sql`now()`),
});
