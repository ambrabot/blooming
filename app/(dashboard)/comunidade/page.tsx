import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/jwt";
import { Users } from "lucide-react";

export default async function ComunidadePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      <p className="text-[11px] uppercase tracking-[0.18em] text-stone-400 font-semibold">
        Você não floresce sozinha
      </p>
      <h1 className="font-serif text-3xl text-stone-800 mt-1">Comunidade</h1>

      <div className="mt-8 rounded-lg border border-stone-200 bg-white p-10 text-center">
        <div
          className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-4"
          style={{ background: "#f3ece0", color: "#9c7a39" }}
        >
          <Users className="h-5 w-5" />
        </div>
        <p className="font-serif text-xl text-stone-800">Em breve, um lugar para caminhar junto</p>
        <p className="text-sm text-stone-500 mt-2 max-w-sm mx-auto leading-relaxed">
          Círculos de mulheres por estação de vida, partilhas e um mural de oração — para que
          ninguém atravesse a jornada de florescimento sozinha. Faz parte da assinatura.
        </p>
        <Link
          href="/assinatura"
          className="inline-block mt-6 rounded text-sm font-medium text-white px-5 py-3"
          style={{ background: "#9c7a39" }}
        >
          Conhecer a assinatura
        </Link>
      </div>
    </div>
  );
}
