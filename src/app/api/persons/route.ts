import { NextResponse } from "next/server";
import { createPersonSchema } from "@/lib/schemas";
import { createPerson, listPersons } from "@/server/services/persons";

// GET /api/persons — list all members.
export async function GET() {
  const persons = await listPersons();
  return NextResponse.json({ data: persons });
}

// POST /api/persons — create a member.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createPersonSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const person = await createPerson(parsed.data);
  return NextResponse.json({ data: person }, { status: 201 });
}
