"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";

interface Props {
  lessonId: string;
  progressId: string | undefined;
  moduleId: string;
  completed: boolean;
}

export default function LessonCompleteButton({ lessonId, progressId, moduleId, completed }: Props) {
  const t = useTranslations("Modules");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(completed);

  async function markComplete() {
    if (done) return;
    setLoading(true);

    await fetch("/api/progress/lesson", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, progressId, moduleId }),
    });

    setLoading(false);
    setDone(true);
    router.refresh();
  }

  if (done) {
    return (
      <div className="flex items-center gap-1.5 text-sm text-teal-600">
        <CheckCircle2 className="h-4 w-4" />
        {t("completed")}
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={markComplete}
      disabled={loading}
      className="border-teal-300 text-teal-700 hover:bg-teal-50"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin mr-1" />
      ) : (
        <CheckCircle2 className="h-4 w-4 mr-1" />
      )}
      {t("markComplete")}
    </Button>
  );
}
