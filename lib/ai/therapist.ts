import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt, TherapistContext } from "./system-prompt";
import { respondInLanguage } from "@/lib/i18n/language";

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
    max_tokens: 1536,
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
  locale: string = "pt",
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
        content: `Resuma esta sessão terapêutica em 2-3 frases, capturando o tema central, o que emergiu, e o próximo passo. Tom: gentil, presente tense. ${respondInLanguage(locale)}\n\n${transcript}`,
      },
    ],
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}

export async function generateJournalReflection(
  entry: string,
  userName: string,
  locale: string = "pt",
): Promise<string> {
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 200,
    messages: [
      {
        role: "user",
        content: `Você é Rafa, terapeuta cristã. ${userName} acabou de escrever no diário. Ofereça uma reflexão breve e acolhedora (máx. 3 frases), com uma âncora bíblica sutil se couber naturalmente. NÃO dê conselhos. Apenas acolha e aprofunde. ${respondInLanguage(locale)}\n\nDiário: ${entry}`,
      },
    ],
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}

// Motor de Evolução — reflexão de cultivo de UM canteiro do Jardim. A Rafa lê os
// registros do diário marcados àquela área (gardenKey) + o estado do canteiro, e
// devolve uma observação que mede CULTIVO (padrão ao longo do tempo), nunca humor.
// Governada pela Constituição: padrão, não rótulo; pergunta, não diagnóstico; honra.
export async function generateGardenReflection(
  gardenName: string,
  userName: string,
  bed: { flourishing: number | null; note: string | null },
  entries: string[],
  locale: string = "pt",
): Promise<string> {
  const state =
    bed.flourishing != null
      ? `A pessoa marcou este canteiro em ${bed.flourishing}/5${bed.note ? ` ("${bed.note}")` : ""}.`
      : "A pessoa ainda não avaliou este canteiro.";
  const corpus = entries.length
    ? entries.map((e, i) => `Registro ${i + 1}:\n${e}`).join("\n\n")
    : "(ainda não há registros do diário ligados a esta área)";

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 240,
    messages: [
      {
        role: "user",
        content: `Você é Rafa, terapeuta cristã do BLOOMING. Está observando o canteiro "${gardenName}" do jardim de ${userName} — uma área da vida dela.

${state}

O que ${userName} registrou sobre esta área (diário de 4 perspectivas — evento, emoção, empatia, dinâmica do relacionamento):
${corpus}

Devolva uma observação de CULTIVO desta área (máx. 3 frases), seguindo, sem exceção:
- Nomeie um PADRÃO que você percebe ao longo do tempo, nunca um rótulo. Jamais diga "você é..." ou "ele/ela é..." (nada de "narcisista", "tóxico", diagnóstico). Diga "percebo um padrão de...".
- Honre a pessoa e o caminho — ela é uma Jardineira cultivando, não um problema a consertar.
- Meça frutos/cultivo, não humor. Se há pouco registro, convide com gentileza a cultivar, sem cobrar.
- Termine com UMA pergunta que aprofunde — você desenvolve o pensamento dela, não a dependência das suas respostas.
${respondInLanguage(locale)}`,
      },
    ],
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}

export async function analyzeAssessment(
  answers: Record<string, string>,
  availableModules: { slug: string; title: string; description: string }[],
  locale: string = "pt",
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
    system: buildAssessmentSystemPrompt(locale),
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
