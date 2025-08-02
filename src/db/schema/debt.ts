import {
  pgTable,
  text,
  timestamp,
  numeric,
  uuid,
  pgEnum,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

// 1. Enum for type of debt
export const debtTypeEnum = pgEnum("debt_type", [
  "credit_card",
  "loan",
  "mortgage",
  "overdraft",
  "bnpl",
  "car_finance",
  "utility",
  "other",
]);

// 2. Enum for payment frequency
export const debtFrequencyEnum = pgEnum("debt_frequency", [
  "once",
  "weekly",
  "biweekly",
  "monthly",
  "quarterly",
  "annually",
]);

// 3. Debt table
export const debt = pgTable("debt", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  creditor: text("creditor").notNull(), // e.g. Barclays, HMRC
  holder: text("holder").notNull(), // e.g. Your name or partner
  type: debtTypeEnum("type").notNull(),

  balance: numeric("balance", { precision: 12, scale: 2 }).notNull(),
  apr: numeric("apr", { precision: 5, scale: 2 }), // Optional
  minPayment: numeric("min_payment", { precision: 10, scale: 2 }), // Nullable

  paymentDate: integer("payment_date"), // Preferred due day of month (e.g. 15)
  isRecurring: boolean("is_recurring").default(true).notNull(),
  frequency: debtFrequencyEnum("frequency"), // e.g. monthly payments
  endDate: timestamp("end_date"), // Optional for tracking loan end

  notes: text("notes"),

  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});
