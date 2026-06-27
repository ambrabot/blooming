import type { Metadata } from "next";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { HREFLANG, localePath } from "@/lib/i18n/format";
import { routing } from "@/i18n/routing";
import { getSession } from "@/lib/auth/jwt";
import LandingNav from "@/components/landing/nav";
import HeroSection from "@/components/landing/hero";
import ForWhomSection from "@/components/landing/for-whom";
import RafaSection from "@/components/landing/rafa";
import PillarsSection from "@/components/landing/pillars";
import ModulesSection from "@/components/landing/modules";
import SubscriptionSection from "@/components/landing/subscription";
import HowItWorksSection from "@/components/landing/how-it-works";
import TestimonialsSection from "@/components/landing/testimonials";
import AssessmentCtaSection from "@/components/landing/assessment-cta";
import FaqSection from "@/components/landing/faq";
import LandingFooter from "@/components/landing/footer";
import { db } from "@/lib/db/client";
import { localizeModule } from "@/lib/i18n/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[HREFLANG[l]] = localePath(l, "/");
  }
  languages["x-default"] = localePath("pt", "/");

  return {
    alternates: {
      canonical: localePath(locale, "/"),
      languages,
    },
  };
}

export default async function RootPage() {
  const session = await getSession();
  const locale = await getLocale();
  if (session) redirect({ href: "/dashboard", locale });

  const modulesRaw = await db.module.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    select: {
      slug: true,
      title: true,
      subtitle: true,
      iconEmoji: true,
      hebrewWord: true,
      priceInCents: true,
      description: true,
      audience: true,
      ...(locale !== "pt"
        ? {
            translations: {
              where: { locale },
              select: { locale: true, title: true, subtitle: true, description: true, hebrewWord: true },
            },
          }
        : {}),
    },
  }).catch((e) => {
    console.error("[landing] falha ao carregar módulos:", e);
    return [];
  });

  const modules = modulesRaw.map((m) => localizeModule(m, locale));

  return (
    <div className="bg-white">
      <LandingNav />
      <HeroSection />
      <ForWhomSection />
      <RafaSection />
      <PillarsSection />
      <ModulesSection modules={modules} />
      <SubscriptionSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <AssessmentCtaSection />
      <FaqSection />
      <LandingFooter />
    </div>
  );
}
