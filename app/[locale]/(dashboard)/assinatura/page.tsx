import { getTranslations, getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getSession } from "@/lib/auth/jwt";
import { db } from "@/lib/db/client";
import { hasActiveSubscription } from "@/lib/subscription";
import { SubscribeButton } from "@/components/subscription/subscribe-button";
import { dateLocale } from "@/lib/i18n/format";
import { Check, Sparkles, Heart, Users, BookOpen } from "lucide-react";

const BENEFIT_ICONS = [Heart, Users, BookOpen];

export default async function AssinaturaPage({
  searchParams,
}: {
  searchParams: Promise<{ assinatura?: string }>;
}) {
  const [session, t, locale] = await Promise.all([
    getSession(),
    getTranslations("Subscription"),
    getLocale(),
  ]);
  if (!session) {
    redirect({ href: "/login", locale });
    return null;
  }

  const user = await db.user.findUnique({ where: { id: session.userId } });
  const active = hasActiveSubscription(user);
  const { assinatura } = await searchParams;

  const benefits = (t.raw("benefits") as { title: string; desc: string }[]).map((b, i) => ({
    ...b,
    icon: BENEFIT_ICONS[i],
  }));

  return (
    <div className="p-6 sm:p-8 max-w-2xl mx-auto">
      {assinatura === "sucesso" && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800 text-sm">
          {t("successBanner")}
        </div>
      )}
      {assinatura === "cancelada" && (
        <div className="mb-6 rounded-xl border border-stone-200 bg-stone-50 px-5 py-4 text-stone-600 text-sm">
          {t("cancelledBanner")}
        </div>
      )}

      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 text-berry mb-3">
          <Sparkles className="h-5 w-5" />
          <span className="font-serif text-lg">{t("brand")}</span>
        </div>
        <h1 className="font-serif text-3xl text-stone-800">
          {active ? t("titleActive") : t("titleInactive")}
        </h1>
        <p className="text-stone-500 mt-2 max-w-md mx-auto">
          {active ? t("subtitleActive") : t("subtitleInactive")}
        </p>
      </div>

      {active ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 text-center">
          <p className="text-emerald-800 font-medium">{t("activeLabel")}</p>
          {user?.subscriptionCurrentPeriodEnd && (
            <p className="text-emerald-700 text-sm mt-1">
              {t("renewsOn", {
                date: user.subscriptionCurrentPeriodEnd.toLocaleDateString(dateLocale(locale), {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                }),
              })}
            </p>
          )}
          <ul className="mt-5 space-y-2 text-left max-w-xs mx-auto">
            {benefits.map((b) => (
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
            <span className="font-serif text-5xl text-stone-800">{t("priceAmount")}</span>
            <span className="text-stone-400">{t("pricePeriod")}</span>
          </div>
          <ul className="space-y-4 mb-8">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <li key={b.title} className="flex gap-3">
                  <div className="mt-0.5 h-8 w-8 shrink-0 rounded-full bg-berry-wash flex items-center justify-center">
                    <Icon className="h-4 w-4 text-berry" />
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
            label={t("subscribeLabel")}
            className="w-full bg-berry hover:bg-berry-deep text-white"
          />
          <p className="text-center text-xs text-stone-400 mt-3">
            {t("fineprint")}
          </p>
        </div>
      )}
    </div>
  );
}
