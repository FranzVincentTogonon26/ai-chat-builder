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
