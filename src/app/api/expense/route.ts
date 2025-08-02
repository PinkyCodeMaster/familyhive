import { NextResponse } from "next/server";
import { expense } from "@/db/schema";
import { db } from "@/db";
import { z } from "zod";

const createExpenseSchema = z.object({
  userId: z.string(),
  category: z.enum([
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
  ]),
  to: z.string(),
  amount: z.number(),
  date: z.coerce.date(),
  isRecurring: z.boolean().optional(),
  frequency: z
    .enum(["once", "weekly", "biweekly", "monthly", "quarterly", "annually"])
    .optional(),
  endDate: z.coerce.date().nullable().optional(),
});

export async function GET(req: Request) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const result = await db.query.expense.findMany({
    where: (expense, { eq }) => eq(expense.userId, userId),
  });

  return NextResponse.json(result);
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = createExpenseSchema.parse(body);

  // Convert number fields to strings for Drizzle numeric columns
  const dataToInsert = {
    ...parsed,
    amount: parsed.amount.toString(),
  };

  const [newExpense] = await db.insert(expense).values(dataToInsert).returning();

  return NextResponse.json(newExpense);
}
