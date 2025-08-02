import { db } from "@/db";
import { income } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET one income by ID
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: incomeId } = await context.params;

  const result = await db.query.income.findFirst({
    where: (income, { eq }) => eq(income.id, incomeId),
  });

  if (!result) {
    return new Response("Not Found", { status: 404 });
  }

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// PATCH: Partial update of income by ID
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: incomeId } = await context.params;
  const body = await req.json();

  // Optionally validate body here before updating

  await db
    .update(income)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(income.id, incomeId));

  return new Response("Updated", { status: 200 });
}

// DELETE: Delete income by ID
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: incomeId } = await context.params;

  await db.delete(income).where(eq(income.id, incomeId));

  return new Response("Deleted", { status: 200 });
}
