"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function NovaSessionInner() {
  const t = useTranslations("Session");
  const locale = useLocale();
  // Vindo do onboarding (?welcome=1): a Rafa abre ciente do assessment recém-feito
  // — a primeira conversa, o momento de ativação. O contexto do assessment já entra
  // no /api/ai/chat, então a resposta dela à 1ª fala da usuária já é pessoal.
  const welcome = useSearchParams().get("welcome") === "1";
  const [messages, setMessages] = useState<Message[]>(() => [
    { role: "assistant", content: t(welcome ? "openingWelcome" : "opening") },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: text }]);

    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, message: text, locale }),
    });

    if (!res.ok || !res.body) {
      setLoading(false);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let assistantText = "";

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

      for (const line of lines) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.text) {
            assistantText += data.text;
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                role: "assistant",
                content: assistantText,
              };
              return updated;
            });
          }
          if (data.done && data.sessionId) {
            setSessionId(data.sessionId);
          }
        } catch {}
      }
    }

    setLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-stone-100 bg-white">
        <p className="font-medium text-stone-800">{t("headerTitle")}</p>
        <p className="text-xs text-stone-400">{t("headerSubtitle")}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-berry-wash flex items-center justify-center text-sm shrink-0 mr-3 mt-0.5">
                R
              </div>
            )}
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                msg.role === "user"
                  ? "bg-berry text-white rounded-tr-sm"
                  : "bg-white border border-stone-100 text-stone-800 rounded-tl-sm shadow-sm",
              )}
            >
              {msg.content}
              {msg.role === "assistant" && msg.content === "" && loading && (
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-stone-100 bg-white">
        <div className="flex gap-3 items-end">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("inputPlaceholderNew")}
            className="resize-none min-h-[52px] max-h-[160px] border-stone-200 focus-visible:ring-berry"
            rows={2}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="bg-berry hover:bg-berry-deep text-white h-[52px] px-4 shrink-0"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-stone-400 mt-2 text-center">
          {t("inputHint")}
        </p>
      </div>
    </div>
  );
}

export default function NovaSessionPage() {
  return (
    <Suspense fallback={null}>
      <NovaSessionInner />
    </Suspense>
  );
}
