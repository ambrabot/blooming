import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Sparkles } from "lucide-react";

type FooterLink = { key: string; href: string; anchor?: boolean };
type FooterGroup = { id: "product" | "account" | "legal"; links: FooterLink[] };

const GROUPS: FooterGroup[] = [
  {
    id: "product",
    links: [
      { key: "modulos", href: "#modulos", anchor: true },
      { key: "comoFunciona", href: "#como-funciona", anchor: true },
      { key: "faq", href: "#faq", anchor: true },
    ],
  },
  {
    id: "account",
    links: [
      { key: "register", href: "/register" },
      { key: "signIn", href: "/login" },
      { key: "assessment", href: "/register" },
    ],
  },
  {
    id: "legal",
    links: [
      { key: "privacy", href: "/privacidade" },
      { key: "terms", href: "/termos" },
    ],
  },
];

const LINK_CLASS =
  "text-sm text-stone-400 hover:text-white transition-colors";

export default function LandingFooter() {
  const t = useTranslations("Landing.footer");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-stone-900 text-stone-400 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span className="font-serif text-lg text-white">BLOOMING</span>
              <span className="text-stone-600 text-sm ml-1">חַיִל</span>
            </div>
            <p className="text-sm leading-relaxed text-stone-500 max-w-xs">
              {t("tagline")}
            </p>
            <p className="text-xs text-stone-600 mt-4 italic">
              {t.rich("verse", {
                q: (chunks) => <>&ldquo;{chunks}&rdquo;</>,
                br: () => <br />,
              })}
            </p>
          </div>

          {/* Links */}
          {GROUPS.map((group) => (
            <div key={group.id}>
              <p className="text-xs font-medium text-stone-500 uppercase tracking-widest mb-4">
                {t(`groups.${group.id}.title`)}
              </p>
              <ul className="space-y-2.5">
                {group.links.map((l) => (
                  <li key={l.key}>
                    {l.anchor ? (
                      <a href={l.href} className={LINK_CLASS}>
                        {t(`groups.${group.id}.${l.key}`)}
                      </a>
                    ) : (
                      <Link href={l.href} className={LINK_CLASS}>
                        {t(`groups.${group.id}.${l.key}`)}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-600">{t("rights", { year })}</p>
          <p className="text-xs text-stone-600">{t("builtWith")}</p>
        </div>
      </div>
    </footer>
  );
}
