import Link from "next/link";
import { Sparkles } from "lucide-react";

const LINKS = {
  Produto: [
    { label: "Módulos", href: "#modulos" },
    { label: "Como funciona", href: "#como-funciona" },
    { label: "FAQ", href: "#faq" },
  ],
  Conta: [
    { label: "Criar conta", href: "/register" },
    { label: "Entrar", href: "/login" },
    { label: "Assessment gratuito", href: "/register" },
  ],
  Legal: [
    { label: "Política de privacidade", href: "/privacidade" },
    { label: "Termos de uso", href: "/termos" },
  ],
};

export default function LandingFooter() {
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
              Terapia cristã integrativa. Fé, neurociência e endocrinologia ao
              serviço da cura profunda — para mulheres, casais, famílias e
              líderes.
            </p>
            <p className="text-xs text-stone-600 mt-4 italic">
              "Mulher virtuosa, quem a achará?"
              <br />— Provérbios 31:10
            </p>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
              <p className="text-xs font-medium text-stone-500 uppercase tracking-widest mb-4">
                {section}
              </p>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-stone-400 hover:text-white transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-600">
            © {new Date().getFullYear()} BLOOMING. Todos os direitos reservados.
          </p>
          <p className="text-xs text-stone-600">
            Construído com propósito · Fundamentado na Palavra
          </p>
        </div>
      </div>
    </footer>
  );
}
