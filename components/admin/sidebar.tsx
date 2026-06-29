"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardList,
  BarChart3,
  ArrowLeft,
  Shield,
  Menu,
  X,
} from "lucide-react";
import type { JWTPayload } from "@/lib/auth/jwt";

const NAV = [
  { href: "/admin", label: "Painel", icon: LayoutDashboard, exact: true },
  { href: "/admin/modulos", label: "Módulos", icon: BookOpen, exact: false },
  { href: "/admin/usuarios", label: "Usuários", icon: Users, exact: false },
  { href: "/admin/assessment", label: "Assessments", icon: ClipboardList, exact: false },
  { href: "/admin/metrics", label: "Métricas", icon: BarChart3, exact: false },
];

export default function AdminSidebar({ user }: { user: JWTPayload }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Topbar mobile */}
      <header className="md:hidden fixed top-0 inset-x-0 h-14 z-40 bg-zinc-900 text-zinc-100 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-berry" />
          <span className="font-serif text-base text-white">BLOOMING Admin</span>
        </div>
        <button onClick={() => setOpen(true)} aria-label="Abrir menu" className="text-zinc-300 p-1">
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Overlay mobile */}
      {open && (
        <div className="md:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar: estática no desktop, drawer no mobile */}
      <aside
        className={cn(
          "w-60 bg-zinc-900 text-zinc-100 flex flex-col z-50 shrink-0",
          "max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:shadow-xl max-md:transition-transform max-md:duration-300",
          open ? "max-md:translate-x-0" : "max-md:-translate-x-full",
          "md:static md:translate-x-0 md:h-full",
        )}
      >
        <div className="px-5 py-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-berry" />
            <div>
              <p className="font-serif text-base text-white">BLOOMING Admin</p>
              <p className="text-xs text-zinc-500 mt-0.5">{user.name}</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Fechar menu" className="md:hidden text-zinc-500 p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  active
                    ? "bg-berry text-white font-medium"
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
    </>
  );
}
