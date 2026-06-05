import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/jwt";

export async function requireAdmin(): Promise<{ error: NextResponse } | { userId: string }> {
  const session = await getSession();
  if (!session) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (session.role !== "ADMIN") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { userId: session.userId };
}
