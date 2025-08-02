import { db } from "@/db";
import { expense } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: expenseId } = await context.params;

  const result = await db.query.expense.findFirst({
    where: (expense, { eq }) => eq(expense.id, expenseId),
  });

  if (!result) {
    return new Response("Not Found", { status: 404 });
  }

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: expenseId } = await context.params;
  const body = await req.json();

  // TODO: Add validation for partial update here if needed

  await db
    .update(expense)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(expense.id, expenseId));

  return new Response("Updated", { status: 200 });
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: expenseId } = await context.params;

  await db.delete(expense).where(eq(expense.id, expenseId));

  return new Response("Deleted", { status: 200 });
}
