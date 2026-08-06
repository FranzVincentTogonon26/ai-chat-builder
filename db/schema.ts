import { sql } from "drizzle-orm";
import { text, pgTable } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: text()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  organization_id: text("organization_id").notNull(),
  name: text("name"),
  email: text("email").notNull().unique(),
  image: text("image"),
  created_at: text("created_at").default(sql`now()`),
});
