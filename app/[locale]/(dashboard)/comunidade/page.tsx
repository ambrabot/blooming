import { getTranslations, getLocale } from "next-intl/server";
import { redirect, Link } from "@/i18n/navigation";
import { getSession } from "@/lib/auth/jwt";
import { Users } from "lucide-react";

export default async function ComunidadePage() {
  const [session, t, locale] = await Promise.all([
    getSession(),
    getTranslations("Community"),
    getLocale(),
  ]);
  if (!session) {
    redirect({ href: "/login", locale });
    return null;
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      <p className="text-[11px] uppercase tracking-[0.18em] text-stone-400 font-semibold">
        {t("eyebrow")}
      </p>
      <h1 className="font-serif text-3xl text-stone-800 mt-1">{t("title")}</h1>

      <div className="mt-8 rounded-lg border border-stone-200 bg-white p-10 text-center">
        <div
          className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-4"
          style={{ background: "#f3ece0", color: "#8e3b5a" }}
        >
          <Users className="h-5 w-5" />
        </div>
        <p className="font-serif text-xl text-stone-800">{t("comingTitle")}</p>
        <p className="text-sm text-stone-500 mt-2 max-w-sm mx-auto leading-relaxed">
          {t("comingBody")}
        </p>
        <Link
          href="/assinatura"
          className="inline-block mt-6 rounded text-sm font-medium text-white px-5 py-3"
          style={{ background: "#8e3b5a" }}
        >
          {t("cta")}
        </Link>
      </div>
    </div>
  );
}
