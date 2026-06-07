import { getSession } from "@/lib/auth/jwt";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/client";
import { hasActiveSubscription } from "@/lib/subscription";
import { SubscribeButton } from "@/components/subscription/subscribe-button";
import { Check, Sparkles, Heart, Users, BookOpen } from "lucide-react";

const BENEFITS = [
  { icon: Heart, title: "Rafa ilimitada", desc: "Converse com a Rafa quantas vezes precisar — sem teto mensal, com a memória de toda a sua jornada." },
  { icon: Users, title: "Comunidade", desc: "Círculos de mulheres em cura, sob a cultura da honra. (em breve)" },
  { icon: BookOpen, title: "Conteúdo novo", desc: "Novos encontros, práticas e materiais conforme forem chegando." },
];

export default async function AssinaturaPage({
  searchParams,
}: {
  searchParams: Promise<{ assinatura?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await db.user.findUnique({ where: { id: session.userId } });
  const active = hasActiveSubscription(user);
  const { assinatura } = await searchParams;

  return (
    <div className="p-6 sm:p-8 max-w-2xl mx-auto">
      {assinatura === "sucesso" && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800 text-sm">
          Bem-vinda 🌿 Sua assinatura está ativa. A Rafa agora caminha com você sem limites.
        </div>
      )}
      {assinatura === "cancelada" && (
        <div className="mb-6 rounded-xl border border-stone-200 bg-stone-50 px-5 py-4 text-stone-600 text-sm">
          Tudo bem — você pode assinar quando quiser. A Rafa continua aqui.
        </div>
      )}

      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 text-amber-700 mb-3">
          <Sparkles className="h-5 w-5" />
          <span className="font-serif text-lg">Blooming</span>
        </div>
        <h1 className="font-serif text-3xl text-stone-800">
          {active ? "Sua assinatura" : "A Rafa, sem limites"}
        </h1>
        <p className="text-stone-500 mt-2 max-w-md mx-auto">
          {active
            ? "Você faz parte do Blooming. Obrigada por confiar nessa jornada."
            : "Os módulos são seus para sempre. A assinatura abre a Rafa ilimitada e a comunidade — a presença diária na sua cura."}
        </p>
      </div>

      {active ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 text-center">
          <p className="text-emerald-800 font-medium">Assinatura ativa</p>
          {user?.subscriptionCurrentPeriodEnd && (
            <p className="text-emerald-700 text-sm mt-1">
              Renova em{" "}
              {user.subscriptionCurrentPeriodEnd.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
          <ul className="mt-5 space-y-2 text-left max-w-xs mx-auto">
            {BENEFITS.map((b) => (
              <li key={b.title} className="flex items-center gap-2 text-stone-700 text-sm">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                {b.title}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-baseline justify-center gap-1 mb-6">
            <span className="font-serif text-5xl text-stone-800">R$29</span>
            <span className="text-stone-400">/mês</span>
          </div>
          <ul className="space-y-4 mb-8">
            {BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <li key={b.title} className="flex gap-3">
                  <div className="mt-0.5 h-8 w-8 shrink-0 rounded-full bg-amber-50 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-amber-700" />
                  </div>
                  <div>
                    <p className="font-medium text-stone-800">{b.title}</p>
                    <p className="text-sm text-stone-500">{b.desc}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          <SubscribeButton
            label="Assinar — R$29/mês"
            className="w-full bg-amber-700 hover:bg-amber-800 text-white"
          />
          <p className="text-center text-xs text-stone-400 mt-3">
            Cancele quando quiser. Os módulos que você comprou continuam seus para sempre.
          </p>
        </div>
      )}
    </div>
  );
}
