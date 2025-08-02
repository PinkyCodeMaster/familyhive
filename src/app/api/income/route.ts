import { NextResponse } from "next/server";
import { income } from "@/db/schema";
import { db } from "@/db";
import { z } from "zod";

const incomeSourceValues = ["job", "benefits", "gift", "side_hustle", "other"] as const;
const incomeFrequencyValues = ["once", "weekly", "biweekly", "monthly", "quarterly", "annually"] as const;

// Zod schema for validation
const createIncomeSchema = z.object({
  userId: z.string(),
  source: z.enum(incomeSourceValues),
  from: z.string(),
  amount: z.number(),
  date: z.coerce.date(),
  isRecurring: z.boolean().optional(),
  frequency: z.enum(incomeFrequencyValues).optional().nullable(),
  endDate: z.coerce.date().nullable().optional(),
});

export async function GET(req: Request) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const incomes = await db.query.income.findMany({
    where: (income, { eq }) => eq(income.userId, userId),
  });

  return NextResponse.json(incomes);
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = createIncomeSchema.parse(body);

  // Convert amount number to string for numeric DB column
  const dataToInsert = {
    ...parsed,
    amount: parsed.amount.toString(),
  };

  const [newIncome] = await db.insert(income).values(dataToInsert).returning();

  return NextResponse.json(newIncome);
}
