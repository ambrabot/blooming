"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { dateLocale } from "@/lib/i18n/format";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Loader2, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
  createdAt: string;
}

interface SessionData {
  id: string;
  title: string | null;
  summary: string | null;
  mood: number | null;
  moduleId: string | null;
  messages: Message[];
  createdAt: string;
}

export default function SessaoPage() {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations("Session");
  const locale = useLocale();
  const [session, setSession] = useState<SessionData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/sessions/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setSession(data.session);
        setMessages(data.session?.messages ?? []);
        setFetching(false);
      });
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setLoading(true);

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "USER",
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: id, message: text, locale }),
    });

    if (!res.ok || !res.body) { setLoading(false); return; }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let assistantText = "";
    const assistantId = crypto.randomUUID();

    setMessages((prev) => [...prev, { id: assistantId, role: "ASSISTANT", content: "", createdAt: new Date().toISOString() }]);

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const lines = decoder.decode(value).split("\n").filter((l) => l.startsWith("data: "));
      for (const line of lines) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.text) {
            assistantText += data.text;
            setMessages((prev) =>
              prev.map((m) => m.id === assistantId ? { ...m, content: assistantText } : m)
            );
          }
        } catch {}
      }
    }
    setLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-stone-300" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="p-8 text-center text-stone-400">
        {t("notFound")}{" "}
        <Link href="/sessao" className="text-amber-700 hover:underline">{t("back")}</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-stone-100 bg-white flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/sessao"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-stone-800 truncate">
            {session.title ?? t("headerTitle")}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs text-stone-400">
              {new Date(session.createdAt).toLocaleDateString(dateLocale(locale), {
                weekday: "long", day: "numeric", month: "long",
              })}
            </p>
            {session.mood && (
              <Badge variant="outline" className="text-xs py-0">{t("mood", { value: session.mood })}</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Summary banner */}
      {session.summary && (
        <div className="mx-6 mt-4 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-start gap-2">
          <BookOpen className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 leading-relaxed italic">{session.summary}</p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex", msg.role === "USER" ? "justify-end" : "justify-start")}>
            {msg.role === "ASSISTANT" && (
              <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-xs font-medium text-amber-800 shrink-0 mr-3 mt-0.5">R</div>
            )}
            <div className={cn(
              "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
              msg.role === "USER"
                ? "bg-amber-700 text-white rounded-tr-sm"
                : "bg-white border border-stone-100 text-stone-800 rounded-tl-sm shadow-sm",
            )}>
              {msg.content}
              {msg.role === "ASSISTANT" && msg.content === "" && loading && (
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
            placeholder={t("inputPlaceholderContinue")}
            className="resize-none min-h-[52px] max-h-[160px] border-stone-200 focus-visible:ring-amber-500"
            rows={2}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="bg-amber-700 hover:bg-amber-800 text-white h-[52px] px-4 shrink-0"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
