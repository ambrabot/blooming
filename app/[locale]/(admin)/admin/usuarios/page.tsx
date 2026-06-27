import { db } from "@/lib/db/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import UserRoleToggle from "@/components/admin/user-role-toggle";

const ROLE_LABEL: Record<string, { label: string; color: string }> = {
  WOMAN:  { label: "Mulher",   color: "bg-rose-100 text-rose-700" },
  COUPLE: { label: "Casal",    color: "bg-purple-100 text-purple-700" },
  FAMILY: { label: "Família",  color: "bg-orange-100 text-orange-700" },
  LEADER: { label: "Líder",    color: "bg-indigo-100 text-indigo-700" },
  ADMIN:  { label: "Admin",    color: "bg-zinc-800 text-white" },
};

export default async function AdminUsuariosPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          sessions: true,
          journalEntries: true,
          purchases: true,
          assessments: true,
        },
      },
      profile: { select: { currentSeason: true, cycleStartDate: true } },
    },
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-zinc-800">Usuários</h1>
        <p className="text-zinc-500 text-sm mt-1">
          {users.filter((u) => u.role !== "ADMIN").length} usuários · {users.filter((u) => u.role === "ADMIN").length} admin(s)
        </p>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-100 bg-zinc-50">
            <tr>
              <th className="text-left px-5 py-3 text-xs text-zinc-500 font-medium">Usuário</th>
              <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium">Perfil</th>
              <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium">Estação</th>
              <th className="text-center px-4 py-3 text-xs text-zinc-500 font-medium">Sessões</th>
              <th className="text-center px-4 py-3 text-xs text-zinc-500 font-medium">Diário</th>
              <th className="text-center px-4 py-3 text-xs text-zinc-500 font-medium">Módulos</th>
              <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium">Desde</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {users.map((user) => {
              const roleInfo = ROLE_LABEL[user.role] ?? { label: user.role, color: "bg-zinc-100 text-zinc-600" };
              return (
                <tr key={user.id} className="hover:bg-zinc-50">
                  <td className="px-5 py-3">
                    <p className="font-medium text-zinc-800">{user.name}</p>
                    <p className="text-xs text-zinc-400">{user.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleInfo.color}`}>
                      {roleInfo.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-400 max-w-[140px] truncate">
                    {user.profile?.currentSeason?.split(" — ")[0] ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-center text-zinc-600">{user._count.sessions}</td>
                  <td className="px-4 py-3 text-center text-zinc-600">{user._count.journalEntries}</td>
                  <td className="px-4 py-3 text-center text-zinc-600">{user._count.purchases}</td>
                  <td className="px-4 py-3 text-xs text-zinc-400">
                    {new Date(user.createdAt).toLocaleDateString("pt-BR", {
                      day: "numeric",
                      month: "short",
                      year: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <UserRoleToggle userId={user.id} currentRole={user.role} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
