"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  MessageCircle,
  NotebookPen,
  User,
  LogOut,
  Sparkles,
  CalendarCheck,
  Menu,
  X,
} from "lucide-react";
import type { JWTPayload } from "@/lib/auth/jwt";

const NAV = [
  { href: "/dashboard", label: "Início", icon: LayoutDashboard, exact: true },
  { href: "/sessao", label: "Sessões", icon: MessageCircle, exact: false },
  { href: "/modulos", label: "Módulos", icon: BookOpen, exact: false },
  { href: "/check-in", label: "Check-in", icon: CalendarCheck, exact: false },
  { href: "/diario", label: "Diário", icon: NotebookPen, exact: false },
  { href: "/perfil", label: "Perfil", icon: User, exact: false },
];

export default function Sidebar({ user }: { user: JWTPayload }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Fecha o drawer ao trocar de rota.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <>
      {/* Topbar mobile */}
      <header className="md:hidden fixed top-0 inset-x-0 h-14 z-40 bg-white border-b border-stone-100 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-600" />
          <span className="font-serif text-base text-stone-800">BLOOMING</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir menu"
          className="text-stone-600 p-1"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Overlay mobile */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar: estática no desktop, drawer no mobile */}
      <aside
        className={cn(
          "w-64 bg-white border-r border-stone-100 flex flex-col z-50 shrink-0",
          "max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:shadow-xl max-md:transition-transform max-md:duration-300",
          open ? "max-md:translate-x-0" : "max-md:-translate-x-full",
          "md:static md:translate-x-0 md:h-full",
        )}
      >
        {/* Logo + fechar (mobile) */}
        <div className="px-6 py-6 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-600" />
            <div>
              <p className="font-serif text-lg text-stone-800 leading-none">BLOOMING</p>
              <p className="text-xs text-stone-400 mt-0.5">חַיִל</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
            className="md:hidden text-stone-400 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User */}
        <div className="px-6 py-4 border-b border-stone-100">
          <p className="text-sm font-medium text-stone-700 truncate">{user.name}</p>
          <p className="text-xs text-stone-400 truncate">{user.email}</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact
              ? pathname === href
              : pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  active
                    ? "bg-amber-50 text-amber-800 font-medium"
                    : "text-stone-600 hover:bg-stone-50 hover:text-stone-800",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-stone-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-500 hover:text-red-600 hover:bg-red-50 transition-colors w-full"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}
