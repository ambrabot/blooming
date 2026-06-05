import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

interface ModuleData {
  slug: string;
  title: string;
  subtitle: string | null;
  iconEmoji: string;
  hebrewWord: string | null;
  priceInCents: number;
  description: string;
  audience: string[];
}

const AUDIENCE_LABEL: Record<string, string> = {
  WOMAN: "Mulher",
  COUPLE: "Casais",
  FAMILY: "Família",
  LEADER: "Líderes",
};

export default function ModulesSection({ modules }: { modules: ModuleData[] }) {
  return (
    <section id="modulos" className="py-24 px-6 bg-gradient-to-b from-stone-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-medium text-amber-700 uppercase tracking-widest mb-3">
            8 módulos de cura profunda
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-stone-800 leading-tight">
            Cada módulo, uma jornada
          </h2>
          <p className="text-stone-400 mt-4 max-w-xl mx-auto text-lg">
            Compra individual, acesso vitalício. Você avança no seu ritmo, com a Rafa ao lado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {modules.map((mod) => (
            <div
              key={mod.slug}
              className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{mod.iconEmoji}</span>
                <div className="flex flex-wrap gap-1 justify-end">
                  {mod.audience.slice(0, 2).map((a) => (
                    <span
                      key={a}
                      className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full"
                    >
                      {AUDIENCE_LABEL[a] ?? a}
                    </span>
                  ))}
                </div>
              </div>

              {mod.hebrewWord && (
                <p className="text-xs text-amber-700 font-medium tracking-widest uppercase mb-1">
                  {mod.hebrewWord}
                </p>
              )}
              <h3 className="font-serif text-lg text-stone-800 mb-1">{mod.title}</h3>
              {mod.subtitle && (
                <p className="text-xs text-stone-400 mb-3">{mod.subtitle}</p>
              )}
              <p className="text-sm text-stone-500 leading-relaxed flex-1 line-clamp-3 mb-4">
                {mod.description}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-stone-100 mt-auto">
                <p className="text-sm font-semibold text-stone-700">
                  {(mod.priceInCents / 100).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="text-amber-700 border-amber-200 hover:bg-amber-50"
                >
                  <Link href="/register">
                    <Lock className="h-3 w-3 mr-1" />
                    Acessar
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Note on assessment */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-8 text-center">
          <p className="text-sm font-medium text-amber-900 mb-2">
            ✨ Não sabe por onde começar?
          </p>
          <p className="text-stone-600 text-sm mb-4 max-w-lg mx-auto">
            O assessment inicial é gratuito. Em 15 minutos, a Rafa analisa suas respostas e indica os módulos certos para você.
          </p>
          <Button
            asChild
            className="bg-amber-700 hover:bg-amber-800 text-white rounded-full"
          >
            <Link href="/register">Fazer o assessment gratuito</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
