import { pgTable, text, timestamp, numeric, uuid, pgEnum, boolean, } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const incomeSourceEnum = pgEnum("income_source", [
    "job",
    "benefits",
    "gift",
    "side_hustle",
    "other",
]);

export const incomeFrequencyEnum = pgEnum("income_frequency", [
    "once",
    "weekly",
    "biweekly",
    "monthly",
    "quarterly",
    "annually",
]);

export const income = pgTable("income", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    source: incomeSourceEnum("source").notNull(),
    from: text("from").notNull(),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    date: timestamp("date").notNull(), // most recent or next expected
    isRecurring: boolean("is_recurring").default(false).notNull(),
    frequency: incomeFrequencyEnum("frequency"), // nullable if not recurring
    endDate: timestamp("end_date"), // optional: when it stops
    createdAt: timestamp("created_at")
        .$defaultFn(() => new Date())
        .notNull(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => new Date())
        .notNull(),
});

