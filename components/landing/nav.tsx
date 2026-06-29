"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { LocaleSwitcher } from "@/components/locale-switcher";

const NAV_LINKS = [
  { href: "#para-quem", key: "paraQuem" },
  { href: "#rafa", key: "rafa" },
  { href: "#modulos", key: "modulos" },
  { href: "#como-funciona", key: "comoFunciona" },
  { href: "#faq", key: "faq" },
] as const;

export default function LandingNav() {
  const t = useTranslations("Landing.nav");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-sm border-b border-[#ECEAE8] shadow-sm"
          : "bg-transparent",
      )}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#8E3B5A]" />
          <div>
            <span className="font-serif text-lg text-[#242120] leading-none">BLOOMING</span>
            <span className="text-xs text-[#6E6A66] ml-1.5">חַיִל</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-[#6E6A66] hover:text-[#242120] transition-colors"
            >
              {t(l.key)}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <LocaleSwitcher />
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">{t("signIn")}</Link>
          </Button>
          <Button asChild size="sm" className="bg-[#8E3B5A] hover:bg-[#6E2A45] text-white">
            <Link href="/register">{t("getStarted")}</Link>
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-[#242120]"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-b border-[#ECEAE8] px-6 py-4 space-y-3">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="block text-sm text-[#6E6A66] hover:text-[#242120] py-1"
              onClick={() => setOpen(false)}
            >
              {t(l.key)}
            </a>
          ))}
          <div className="pt-2">
            <LocaleSwitcher />
          </div>
          <div className="flex gap-3 pt-2">
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link href="/login">{t("signIn")}</Link>
            </Button>
            <Button asChild size="sm" className="flex-1 bg-[#8E3B5A] hover:bg-[#6E2A45] text-white">
              <Link href="/register">{t("getStartedShort")}</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
