import { redirect } from "next/navigation";
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

export default async function RootPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  const modules = await db.module.findMany({
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
    },
  }).catch(() => []);

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
