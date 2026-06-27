import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getSession } from "@/lib/auth/jwt";
import Sidebar from "@/components/layout/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    const locale = await getLocale();
    redirect({ href: "/login", locale });
    return null;
  }

  return (
    <div className="flex h-screen bg-stone-50">
      <Sidebar user={session} />
      <main className="flex-1 overflow-y-auto pt-14 md:pt-0 pb-20 md:pb-0">{children}</main>
    </div>
  );
}
