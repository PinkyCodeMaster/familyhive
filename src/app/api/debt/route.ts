import { NextResponse } from "next/server";
import { debt } from "@/db/schema";
import { db } from "@/db";
import { z } from "zod";

const createDebtSchema = z.object({
  userId: z.string(),
  creditor: z.string(),
  holder: z.string(),
  type: z.enum([
    "credit_card",
    "loan",
    "mortgage",
    "overdraft",
    "bnpl",
    "car_finance",
    "utility",
    "other",
  ]),
  balance: z.number(),
  apr: z.number().optional(),
  minPayment: z.number().optional(),
  paymentDate: z.number().int().optional(),
  isRecurring: z.boolean().optional(),
  frequency: z
    .enum(["once", "weekly", "biweekly", "monthly", "quarterly", "annually"])
    .optional(),
  endDate: z.coerce.date().nullable().optional(),
  notes: z.string().optional(),
});

export async function GET(req: Request) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const debts = await db.query.debt.findMany({
    where: (debt, { eq }) => eq(debt.userId, userId),
  });

  return NextResponse.json(debts);
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = createDebtSchema.parse(body);

  // Convert numeric fields to strings for Drizzle numeric columns
  const dataToInsert = {
    ...parsed,
    balance: parsed.balance.toString(),
    apr: parsed.apr?.toString(),
    minPayment: parsed.minPayment?.toString(),
  };

  const [newDebt] = await db.insert(debt).values(dataToInsert).returning();

  return NextResponse.json(newDebt);
}
