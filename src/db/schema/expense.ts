import { pgTable, text, timestamp, numeric, uuid, pgEnum, boolean, } from "drizzle-orm/pg-core";
import { user } from "./auth";

// Expense category enum (already defined)
export const expenseCategoryEnum = pgEnum("expense_category", [
    "rent",
    "utilities",
    "groceries",
    "transport",
    "insurance",
    "subscriptions",
    "entertainment",
    "debt",
    "childcare",
    "shopping",
    "other",
]);

// Add recurrence frequency enum
export const expenseFrequencyEnum = pgEnum("expense_frequency", [
    "once",
    "weekly",
    "biweekly",
    "monthly",
    "quarterly",
    "annually",
]);

export const expense = pgTable("expense", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    category: expenseCategoryEnum("category").notNull(),
    to: text("to").notNull(), // e.g. Tesco, Amazon, Netflix
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    date: timestamp("date").notNull(), // First or next occurrence
    isRecurring: boolean("is_recurring").default(false).notNull(),
    frequency: expenseFrequencyEnum("frequency"), // nullable if isRecurring is false
    endDate: timestamp("end_date"), // optional, when recurrence stops
    createdAt: timestamp("created_at")
        .$defaultFn(() => new Date())
        .notNull(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => new Date())
        .notNull(),
});
