import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/jwt";
import { db } from "@/lib/db/client";
import { streamTherapistResponse, generateSessionSummary } from "@/lib/ai/therapist";
import { CyclePhase } from "@/lib/generated/prisma";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function generateSessionTitle(firstUserMessage: string): Promise<string> {
  const res = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 40,
    messages: [{
      role: "user",
      content: `Gere um título curto (máx 5 palavras) para uma sessão terapêutica que começou com esta mensagem do usuário. Retorne APENAS o título, sem aspas nem pontuação extra.\n\nMensagem: ${firstUserMessage}`,
    }],
  });
  return res.content[0].type === "text" ? res.content[0].text.trim() : "Sessão";
}

// Compute current cycle phase from profile data
function computeCyclePhase(
  cycleStartDate: Date | null,
  cycleLengthDays: number | null,
): CyclePhase | null {
  if (!cycleStartDate) return null;

  const today = new Date();
  const daysSinceStart = Math.floor(
    (today.getTime() - cycleStartDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  const cycle = cycleLengthDays ?? 28;
  const dayInCycle = ((daysSinceStart % cycle) + cycle) % cycle + 1;

  if (dayInCycle <= 5) return CyclePhase.MENSTRUAL;
  if (dayInCycle <= 13) return CyclePhase.FOLLICULAR;
  if (dayInCycle <= 17) return CyclePhase.OVULATORY;
  return CyclePhase.LUTEAL;
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { sessionId, message, moduleId } = await req.json();

  const [user, therapySession, assessment, priorSessions] = await Promise.all([
    db.user.findUnique({
      where: { id: session.userId },
      include: { profile: true },
    }),
    sessionId
      ? db.therapySession.findUnique({
          where: { id: sessionId, userId: session.userId },
          include: { messages: { orderBy: { createdAt: "asc" } } },
        })
      : null,
    // Memória de longo prazo: a análise inicial da usuária...
    db.assessment.findFirst({
      where: { userId: session.userId, type: "INITIAL", report: { not: null } },
      orderBy: { createdAt: "desc" },
      select: { report: true },
    }),
    // ...e os resumos das sessões ANTERIORES (exceto a atual).
    db.therapySession.findMany({
      where: {
        userId: session.userId,
        summary: { not: null },
        ...(sessionId ? { id: { not: sessionId } } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: { title: true, summary: true, createdAt: true },
    }),
  ]);

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Get module context if present
  let moduleData = null;
  if (moduleId) {
    moduleData = await db.module.findUnique({ where: { id: moduleId } });
  }

  // Build or create therapy session
  let activeSession = therapySession;
  if (!activeSession) {
    activeSession = await db.therapySession.create({
      data: {
        userId: user.id,
        moduleId: moduleId ?? null,
      },
      include: { messages: true },
    });
  }

  // Build context
  const cyclePhase = computeCyclePhase(
    user.profile?.cycleStartDate ?? null,
    user.profile?.cycleLengthDays ?? null,
  );

  const ctx = {
    userName: user.name,
    userRole: user.role,
    moduleTitle: moduleData?.title,
    moduleSystemAddition: moduleData?.systemPromptAddition ?? undefined,
    cyclePhase,
    currentSeason: user.profile?.currentSeason ?? null,
    assessmentSummary: assessment?.report ?? null,
    recentInsights: priorSessions.map((s) => {
      const when = s.createdAt.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
      return `(${when}) ${s.title ?? "Sessão"}: ${s.summary}`;
    }),
  };

  // Save user message
  await db.sessionMessage.create({
    data: { sessionId: activeSession.id, role: "USER", content: message },
  });

  // Build history from saved messages
  const history = activeSession.messages.map((m: { role: string; content: string }) => ({
    role: m.role === "USER" ? ("user" as const) : ("assistant" as const),
    content: m.content,
  }));

  // Stream response
  const encoder = new TextEncoder();
  let fullResponse = "";

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of streamTherapistResponse(ctx, history, message)) {
          fullResponse += chunk;
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`));
        }

        // Save assistant message
        await db.sessionMessage.create({
          data: {
            sessionId: activeSession!.id,
            role: "ASSISTANT",
            content: fullResponse,
          },
        });

        // Count total messages now
        const msgCount = await db.sessionMessage.count({
          where: { sessionId: activeSession!.id },
        });

        // Auto-generate title after 3rd user message (msgCount = 6: 3 user + 3 assistant)
        if (msgCount === 2 && !activeSession!.title) {
          const title = await generateSessionTitle(message).catch(() => null);
          if (title) {
            await db.therapySession.update({
              where: { id: activeSession!.id },
              data: { title },
            });
          }
        }

        // Atualiza o resumo a cada troca completa (a cada resposta da Rafa),
        // para que até conversas curtas virem memória. Roda após o stream já
        // entregue ao usuário, então não adiciona latência percebida.
        if (msgCount >= 2 && msgCount % 2 === 0) {
          const allMessages = await db.sessionMessage.findMany({
            where: { sessionId: activeSession!.id },
            orderBy: { createdAt: "asc" },
          });
          const msgs = allMessages.map((m) => ({
            role: m.role === "USER" ? ("user" as const) : ("assistant" as const),
            content: m.content,
          }));
          const summary = await generateSessionSummary(msgs).catch(() => null);
          if (summary) {
            await db.therapySession.update({
              where: { id: activeSession!.id },
              data: { summary },
            });
          }
        }

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ done: true, sessionId: activeSession!.id, msgCount })}\n\n`,
          ),
        );
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
