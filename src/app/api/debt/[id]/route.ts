import { db } from "@/db";
import { debt } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: debtId } = await context.params;

  const result = await db.query.debt.findFirst({
    where: (debt, { eq }) => eq(debt.id, debtId),
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
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: debtId } = await context.params;
  const body = await request.json();

  await db
    .update(debt)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(debt.id, debtId));

  return new Response("Updated", { status: 200 });
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: debtId } = await context.params;

  await db.delete(debt).where(eq(debt.id, debtId));

  return new Response("Deleted", { status: 200 });
}
