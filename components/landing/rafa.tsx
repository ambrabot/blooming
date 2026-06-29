import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { MessageCircle, Sparkles } from "lucide-react";

type Trait = { label: string; sub: string };
type ChatMessage = { role: "user" | "rafa"; text: string };

export default function RafaSection() {
  const t = useTranslations("Landing.rafa");
  const traits = t.raw("traits") as Trait[];
  const chat = t.raw("chat") as ChatMessage[];

  return (
    <section id="rafa" className="py-24 px-6 bg-[#F7F7F6]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — identity */}
          <div>
            <p className="text-xs font-medium text-[#8E3B5A] uppercase tracking-widest mb-4">
              {t("eyebrow")}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-[#242120] leading-tight text-balance mb-6">
              {t.rich("title", {
                em: (chunks) => <span className="italic text-[#8E3B5A]">{chunks}</span>,
                br: () => <br className="hidden md:block" />,
                q: (chunks) => <span className="italic">&ldquo;{chunks}&rdquo;</span>,
              })}
            </h2>
            <p className="text-[#6E6A66] text-lg leading-relaxed mb-8">{t("intro")}</p>

            {/* Trait grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {traits.map((trait) => (
                <div key={trait.label} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3C7A5E] mt-2 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[#242120]">{trait.label}</p>
                    <p className="text-xs text-[#6E6A66]">{trait.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              asChild
              className="bg-[#8E3B5A] hover:bg-[#6E2A45] text-white rounded-full px-7"
            >
              <Link href="/register">
                <MessageCircle className="h-4 w-4 mr-2" />
                {t("cta")}
              </Link>
            </Button>
          </div>

          {/* Right — chat preview */}
          <div className="relative">
            <div className="bg-white rounded-2xl border border-[#ECEAE8] shadow-lg overflow-hidden">
              {/* Chat header */}
              <div className="border-b border-[#ECEAE8] px-5 py-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#F5E9EE] flex items-center justify-center text-sm font-medium text-[#8E3B5A]">
                  R
                </div>
                <div>
                  <p className="text-sm font-medium text-[#242120]">Rafa</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3C7A5E]" />
                    <p className="text-xs text-[#6E6A66]">{t("available")}</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="p-5 space-y-4 max-h-[380px] overflow-y-auto">
                {chat.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "rafa" && (
                      <div className="w-7 h-7 rounded-full bg-[#F5E9EE] flex items-center justify-center text-xs font-medium text-[#8E3B5A] shrink-0 mr-2 mt-0.5">
                        R
                      </div>
                    )}
                    <div
                      className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-[#8E3B5A] text-white rounded-tr-sm"
                          : "bg-[#F7F7F6] border border-[#ECEAE8] text-[#242120] rounded-tl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input preview */}
              <div className="border-t border-[#ECEAE8] px-4 py-3">
                <div className="flex items-center gap-2 bg-[#F7F7F6] rounded-lg px-3 py-2">
                  <p className="text-sm text-[#6E6A66] flex-1">{t("inputPlaceholder")}</p>
                  <div className="w-7 h-7 rounded-lg bg-[#8E3B5A] flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-3 -right-3 bg-[#3C7A5E] text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" /> {t("badge")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
