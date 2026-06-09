import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/jwt";
import { db } from "@/lib/db/client";
import { getDailyDevotional, READING_PLANS, THEMATIC_STUDIES } from "@/lib/devotionals";
import { computeStreak } from "@/lib/streak";
import { Flame, MessageCircle } from "lucide-react";
import CompleteButton from "@/components/devocional/complete-button";

const ROMAN = ["", "I", "II", "III", "IV"];

export default async function DevocionalPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const now = new Date();
  const dev = getDailyDevotional(now);

  const logs = await db.devotionalLog.findMany({
    where: { userId: session.userId },
    select: { date: true },
  });
  const streak = computeStreak(
    logs.map((l) => l.date),
    now,
  );

  const steps = [
    { t: "A Palavra", s: `“${dev.passageText}” — ${dev.passageRef}` },
    { t: "Reflexão", s: dev.reflexao },
    { t: "Pergunta", s: dev.pergunta },
    {
      t: "Oração e diário",
      s: "Escreva o que o Espírito falou. A Rafa pode refletir com você.",
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      <p className="text-[11px] uppercase tracking-[0.18em] text-stone-400 font-semibold flex items-center gap-2">
        {streak.current > 0 && (
          <span className="inline-flex items-center gap-1 text-[#9c7a39]">
            <Flame className="h-3.5 w-3.5" />
            {streak.current} {streak.current === 1 ? "dia" : "dias"} seguidos
          </span>
        )}
        {streak.best > 0 && <span>· recorde {streak.best}</span>}
      </p>
      <h1 className="font-serif text-3xl text-stone-800 mt-1">Devocional</h1>
      <p className="text-stone-500 mt-1.5 text-sm">
        Quinze minutos para ser construída na Palavra.
      </p>

      {/* Ritual */}
      <div className="mt-6 rounded-lg border border-stone-200 bg-white p-6">
        <p className="text-[11px] uppercase tracking-[0.16em] text-stone-400 font-semibold mb-4">
          Hoje · {dev.passageRef}
        </p>
        <div className="divide-y divide-stone-100">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4 py-4 first:pt-0 last:pb-0">
              <span className="font-serif text-xl w-5 shrink-0 leading-tight" style={{ color: "#9c7a39" }}>
                {ROMAN[i + 1]}
              </span>
              <div>
                <p className="font-medium text-[15px] text-stone-800">{step.t}</p>
                <p className="text-[13px] text-stone-500 mt-1 leading-relaxed">{step.s}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <CompleteButton doneToday={streak.doneToday} currentStreak={streak.current} />
          <Link
            href="/sessao/nova"
            className="inline-flex items-center gap-2 rounded text-sm font-medium text-stone-700 border border-stone-200 px-5 py-3 hover:bg-stone-50"
          >
            <MessageCircle className="h-4 w-4" />
            Conversar com a Rafa
          </Link>
        </div>
      </div>

      {/* Planos de leitura */}
      <div className="mt-5 rounded-lg border border-stone-200 bg-white p-6">
        <p className="text-[11px] uppercase tracking-[0.16em] text-stone-400 font-semibold mb-2">
          Planos de leitura
        </p>
        <div className="divide-y divide-stone-100">
          {READING_PLANS.map((p) => (
            <div key={p.slug} className="flex items-center gap-3 py-4 first:pt-1 last:pb-0">
              <div className="flex-1">
                <p className="font-medium text-[14.5px] text-stone-800">{p.title}</p>
                <p className="text-xs text-stone-400 mt-0.5">
                  {p.days} dias · {p.subtitle}
                </p>
              </div>
              <span className="text-xs text-stone-400">em breve</span>
            </div>
          ))}
        </div>
      </div>

      {/* Estudos temáticos */}
      <div className="mt-5 rounded-lg border border-stone-200 bg-white p-6">
        <p className="text-[11px] uppercase tracking-[0.16em] text-stone-400 font-semibold mb-3">
          Estudos de mulheres
        </p>
        <div className="flex flex-wrap gap-2">
          {THEMATIC_STUDIES.map((t) => (
            <span
              key={t}
              className="text-[13px] border border-stone-200 rounded-full px-3.5 py-1.5 text-stone-500"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
