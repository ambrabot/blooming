import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getSession } from "@/lib/auth/jwt";
import { db } from "@/lib/db/client";
import ConversationEngine from "@/components/conversation/conversation-engine";

export default async function ConversaPage() {
  const session = await getSession();
  const locale = await getLocale();
  if (!session) {
    redirect({ href: "/login", locale });
    return null;
  }

  const convos = await db.conversation.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  const initial = convos.map((c) => ({
    id: c.id,
    withWhom: c.withWhom,
    topic: c.topic,
    gardenKey: c.gardenKey,
    preserve: c.preserve,
    fear: c.fear,
    otherPreserve: c.otherPreserve,
    howTruth: c.howTruth,
    status: c.status,
    learnedSelf: c.learnedSelf,
    learnedOther: c.learnedOther,
    closeness: c.closeness,
    reflection: c.reflection,
  }));

  return <ConversationEngine initial={initial} />;
}
