import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/jwt";
import { db } from "@/lib/db/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Plus, Clock } from "lucide-react";

export default async function SessoesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const sessions = await db.therapySession.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { messages: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { content: true, role: true },
      },
    },
  });

  const grouped = sessions.reduce<Record<string, typeof sessions>>((acc, s) => {
    const key = new Date(s.createdAt).toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });
    acc[key] = acc[key] ?? [];
    acc[key].push(s);
    return acc;
  }, {});

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif text-stone-800">Sessões</h1>
          <p className="text-stone-500 text-sm mt-1">
            {sessions.length} {sessions.length === 1 ? "sessão" : "sessões"} com a Rafa
          </p>
        </div>
        <Button asChild className="bg-amber-700 hover:bg-amber-800 text-white">
          <Link href="/sessao/nova">
            <Plus className="h-4 w-4 mr-2" />
            Nova sessão
          </Link>
        </Button>
      </div>

      {sessions.length === 0 ? (
        <Card className="border-dashed border-stone-200">
          <CardContent className="p-12 text-center">
            <MessageCircle className="h-10 w-10 text-stone-200 mx-auto mb-3" />
            <p className="text-stone-500 font-medium">Nenhuma sessão ainda</p>
            <p className="text-stone-400 text-sm mt-1 mb-5">
              A Rafa está pronta para conversar. Como você está chegando hoje?
            </p>
            <Button asChild className="bg-amber-700 hover:bg-amber-800 text-white">
              <Link href="/sessao/nova">Iniciar primeira sessão</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {(Object.entries(grouped) as [string, typeof sessions][]).map(([month, monthSessions]) => (
            <div key={month}>
              <p className="text-xs font-medium text-stone-400 uppercase tracking-widest mb-3">
                {month}
              </p>
              <div className="space-y-2">
                {monthSessions.map((s) => {
                  const lastMsg = s.messages[0];
                  const isFromRafa = lastMsg?.role === "ASSISTANT";
                  return (
                    <Link key={s.id} href={`/sessao/${s.id}`}>
                      <Card className="border-stone-200 hover:shadow-sm transition-shadow cursor-pointer">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1.5">
                                <p className="font-medium text-stone-800 truncate">
                                  {s.title ?? "Sessão sem título"}
                                </p>
                                {s.mood && (
                                  <Badge variant="outline" className="text-xs shrink-0">
                                    Humor {s.mood}/10
                                  </Badge>
                                )}
                              </div>
                              {lastMsg && (
                                <p className="text-sm text-stone-400 line-clamp-1">
                                  <span className="font-medium">
                                    {isFromRafa ? "Rafa:" : "Você:"}
                                  </span>{" "}
                                  {lastMsg.content}
                                </p>
                              )}
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-xs text-stone-400">
                                {new Date(s.createdAt).toLocaleDateString("pt-BR", {
                                  day: "numeric",
                                  month: "short",
                                })}
                              </p>
                              <p className="text-xs text-stone-300 mt-0.5 flex items-center justify-end gap-1">
                                <Clock className="h-3 w-3" />
                                {s._count.messages} msgs
                              </p>
                            </div>
                          </div>
                          {s.summary && (
                            <p className="text-xs text-stone-400 italic mt-2 border-t border-stone-50 pt-2 line-clamp-2">
                              {s.summary}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
