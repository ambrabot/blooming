import { getSession } from "@/lib/auth/jwt";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Lock, CheckCircle2 } from "lucide-react";

export default async function ModulosPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [modules, purchases] = await Promise.all([
    db.module.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    db.modulePurchase.findMany({
      where: { userId: session.userId, status: "COMPLETED" },
      select: { moduleId: true },
    }),
  ]);

  const purchasedIds = new Set(purchases.map((p: typeof purchases[number]) => p.moduleId));

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-stone-800">Módulos</h1>
        <p className="text-stone-500 mt-1">
          Cada módulo é uma jornada de cura profunda, fundamentada na Palavra.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((mod: typeof modules[number]) => {
          const owned = purchasedIds.has(mod.id);
          return (
            <Card
              key={mod.id}
              className="border-stone-200 hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{mod.iconEmoji}</span>
                  {owned ? (
                    <Badge className="bg-teal-100 text-teal-800 border-0">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Adquirido
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-stone-500">
                      <Lock className="h-3 w-3 mr-1" />
                      {(mod.priceInCents / 100).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </Badge>
                  )}
                </div>

                <h3 className="font-medium text-stone-800 mb-1">{mod.title}</h3>
                {mod.subtitle && (
                  <p className="text-xs text-amber-700 font-medium mb-2">
                    {mod.hebrewWord && `${mod.hebrewWord} · `}
                    {mod.subtitle}
                  </p>
                )}
                <p className="text-sm text-stone-500 line-clamp-3 mb-4">
                  {mod.description}
                </p>

                <div className="flex gap-2">
                  {owned ? (
                    <Button asChild size="sm" className="bg-amber-700 hover:bg-amber-800 text-white">
                      <Link href={`/modulos/${mod.slug}`}>Acessar</Link>
                    </Button>
                  ) : (
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/modulos/${mod.slug}`}>Ver detalhes</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
