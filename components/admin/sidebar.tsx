"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardList,
  Settings,
  ArrowLeft,
  Shield,
} from "lucide-react";
import type { JWTPayload } from "@/lib/auth/jwt";

const NAV = [
  { href: "/admin", label: "Painel", icon: LayoutDashboard, exact: true },
  { href: "/admin/modulos", label: "Módulos", icon: BookOpen, exact: false },
  { href: "/admin/usuarios", label: "Usuários", icon: Users, exact: false },
  { href: "/admin/assessment", label: "Assessments", icon: ClipboardList, exact: false },
];

export default function AdminSidebar({ user }: { user: JWTPayload }) {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-zinc-900 text-zinc-100 flex flex-col h-full shrink-0">
      <div className="px-5 py-5 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-amber-400" />
          <div>
            <p className="font-serif text-base text-white">BLOOMING Admin</p>
            <p className="text-xs text-zinc-500 mt-0.5">{user.name}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                active
                  ? "bg-amber-600 text-white font-medium"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-zinc-800">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao app
        </Link>
      </div>
    </aside>
  );
}
