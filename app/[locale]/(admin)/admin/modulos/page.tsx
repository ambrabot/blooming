import Link from "next/link";
import { db } from "@/lib/db/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Eye, EyeOff } from "lucide-react";

export default async function AdminModulosPage() {
  const modules = await db.module.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: { select: { lessons: true, purchases: true } },
    },
  });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif text-zinc-800">Módulos</h1>
          <p className="text-zinc-500 text-sm mt-1">{modules.length} módulos cadastrados</p>
        </div>
        <Button asChild className="bg-berry hover:bg-berry text-white">
          <Link href="/admin/modulos/novo">
            <Plus className="h-4 w-4 mr-2" />
            Novo módulo
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-100 bg-zinc-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium">Módulo</th>
              <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium">Lições</th>
              <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium">Compras</th>
              <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium">Preço</th>
              <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {modules.map((mod: typeof modules[number]) => (
              <tr key={mod.id} className="hover:bg-zinc-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{mod.iconEmoji}</span>
                    <div>
                      <p className="font-medium text-zinc-800">{mod.title}</p>
                      <p className="text-xs text-zinc-400">{mod.subtitle}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-zinc-600">{mod._count.lessons}</td>
                <td className="px-4 py-3 text-zinc-600">{mod._count.purchases}</td>
                <td className="px-4 py-3 text-zinc-600">
                  {(mod.priceInCents / 100).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </td>
                <td className="px-4 py-3">
                  {mod.isActive ? (
                    <Badge className="bg-green-wash text-green-deep border-0 text-xs">
                      <Eye className="h-3 w-3 mr-1" />
                      Ativo
                    </Badge>
                  ) : (
                    <Badge className="bg-zinc-100 text-zinc-500 border-0 text-xs">
                      <EyeOff className="h-3 w-3 mr-1" />
                      Inativo
                    </Badge>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/admin/modulos/${mod.slug}`}>
                      <Edit2 className="h-4 w-4" />
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
