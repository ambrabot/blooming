import { db } from "@/lib/db/client";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, NotebookPen, MessageCircle } from "lucide-react";

export default async function AdminDashboard() {
  const [modules, users, journals, sessions] = await Promise.all([
    db.module.count(),
    db.user.count({ where: { role: { not: "ADMIN" } } }),
    db.journalEntry.count(),
    db.therapySession.count(),
  ]);

  const recentUsers = await db.user.findMany({
    where: { role: { not: "ADMIN" } },
    orderBy: { createdAt: "desc" },
    take: 8,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  const stats = [
    { label: "Módulos", value: modules, icon: BookOpen, color: "text-berry" },
    { label: "Usuários", value: users, icon: Users, color: "text-green" },
    { label: "Entradas no diário", value: journals, icon: NotebookPen, color: "text-berry" },
    { label: "Sessões terapêuticas", value: sessions, icon: MessageCircle, color: "text-purple-600" },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-zinc-800">Painel Admin</h1>
        <p className="text-zinc-500 text-sm mt-1">Visão geral da plataforma BLOOMING</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border-zinc-200">
            <CardContent className="p-5">
              <Icon className={cn("h-5 w-5 mb-3", color)} />
              <p className="text-2xl font-bold text-zinc-800">{value}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wide mb-3">
          Usuários recentes
        </h2>
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-100 bg-zinc-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium">Nome</th>
                <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium">Email</th>
                <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium">Perfil</th>
                <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {recentUsers.map((u: typeof recentUsers[number]) => (
                <tr key={u.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3 text-zinc-800 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-zinc-500">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400 text-xs">
                    {new Date(u.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
