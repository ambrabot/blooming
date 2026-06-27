import Link from "next/link";
import { db } from "@/lib/db/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2 } from "lucide-react";
import AssessmentQuestionForm from "@/components/admin/assessment-question-form";

export default async function AdminAssessmentPage() {
  const questions = await db.assessmentQuestion.findMany({
    orderBy: [{ type: "asc" }, { order: "asc" }],
    include: { _count: { select: { answers: true } } },
  });

  const byType = questions.reduce<Record<string, typeof questions>>((acc: Record<string, typeof questions>, q: typeof questions[number]) => {
    acc[q.type] = acc[q.type] ?? [];
    acc[q.type].push(q);
    return acc;
  }, {});

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif text-zinc-800">Perguntas de Assessment</h1>
          <p className="text-zinc-500 text-sm mt-1">{questions.length} perguntas · {Object.keys(byType).length} tipos</p>
        </div>
        <AssessmentQuestionForm question={null} />
      </div>

      {(Object.entries(byType) as [string, typeof questions][]).map(([type, qs]) => (
        <div key={type} className="mb-8">
          <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wide mb-3">
            {type}
          </h2>
          <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-zinc-100 bg-zinc-50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium w-10">#</th>
                  <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium">Pergunta</th>
                  <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium">Tipo</th>
                  <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium">Categoria</th>
                  <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium">Respostas</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {qs.map((q) => (
                  <tr key={q.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-3 text-zinc-400 text-xs">{q.order}</td>
                    <td className="px-4 py-3">
                      <p className="text-zinc-800">{q.text}</p>
                      {q.scriptureRef && (
                        <p className="text-xs text-amber-600 mt-0.5">{q.scriptureRef}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-xs">{q.inputType}</Badge>
                    </td>
                    <td className="px-4 py-3 text-zinc-500 text-xs">{q.category}</td>
                    <td className="px-4 py-3 text-zinc-400 text-xs">{q._count.answers}</td>
                    <td className="px-4 py-3 text-right">
                      <AssessmentQuestionForm question={q} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
