import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt, TherapistContext } from "./system-prompt";

// Re-export TherapistContext so callers import from one place
export type { TherapistContext } from "./system-prompt";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function* streamTherapistResponse(
  ctx: TherapistContext,
  history: Message[],
  userMessage: string,
): AsyncGenerator<string> {
  const systemPrompt = buildSystemPrompt(ctx);

  // Cacheia o PREFIXO da conversa (system + histórico inteiro) marcando a última
  // mensagem do histórico como breakpoint de cache. A Rafa continua vendo a
  // conversa COMPLETA — nada é truncado; só não reprocessamos o que não mudou,
  // o que derruba o custo do histórico crescente. Integridade total, custo menor.
  const history_messages: Anthropic.Messages.MessageParam[] = history.map((m, i) =>
    i === history.length - 1
      ? {
          role: m.role,
          content: [
            { type: "text", text: m.content, cache_control: { type: "ephemeral" } },
          ],
        }
      : { role: m.role, content: m.content },
  );

  const messages: Anthropic.Messages.MessageParam[] = [
    ...history_messages,
    { role: "user", content: userMessage },
  ];

  const stream = client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: systemPrompt,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages,
  });

  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      yield event.delta.text;
    }
  }
}

export async function generateSessionSummary(
  messages: Message[],
): Promise<string> {
  const transcript = messages
    .map((m) => `${m.role === "user" ? "Usuária" : "Rafa"}: ${m.content}`)
    .join("\n\n");

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 300,
    messages: [
      {
        role: "user",
        content: `Resuma esta sessão terapêutica em 2-3 frases, capturando o tema central, o que emergiu, e o próximo passo. Tom: gentil, presente tense.\n\n${transcript}`,
      },
    ],
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}

export async function generateJournalReflection(
  entry: string,
  userName: string,
): Promise<string> {
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 200,
    messages: [
      {
        role: "user",
        content: `Você é Rafa, terapeuta cristã. ${userName} acabou de escrever no diário. Ofereça uma reflexão breve e acolhedora (máx. 3 frases), com uma âncora bíblica sutil se couber naturalmente. NÃO dê conselhos. Apenas acolha e aprofunde.\n\nDiário: ${entry}`,
      },
    ],
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}

export async function analyzeAssessment(
  answers: Record<string, string>,
  availableModules: { slug: string; title: string; description: string }[],
): Promise<{
  report: string;
  primaryNeeds: string[];
  recommendedModules: { slug: string; priority: number; reason: string }[];
}> {
  const { buildAssessmentSystemPrompt } = await import("./system-prompt");

  const answersText = Object.entries(answers)
    .map(([q, a]) => `Q: ${q}\nR: ${a}`)
    .join("\n\n");

  const modulesText = availableModules
    .map((m) => `- ${m.slug}: ${m.title} — ${m.description}`)
    .join("\n");

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1000,
    system: buildAssessmentSystemPrompt(),
    messages: [
      {
        role: "user",
        content: `Respostas do assessment:\n\n${answersText}\n\nMódulos disponíveis:\n${modulesText}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "{}";

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { report: text, primaryNeeds: [], recommendedModules: [] };
  } catch {
    return { report: text, primaryNeeds: [], recommendedModules: [] };
  }
}
