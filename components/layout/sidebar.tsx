"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  BookOpen,
  MessageCircle,
  Sprout,
  Users,
  NotebookPen,
  CalendarCheck,
  Sparkles,
  User,
  LogOut,
} from "lucide-react";
import type { JWTPayload } from "@/lib/auth/jwt";

// 5 destinos primários (sitemap aprovado)
const PRIMARY = [
  { href: "/dashboard", label: "Início", icon: Home, exact: true },
  { href: "/devocional", label: "Devocional", icon: BookOpen, exact: false },
  { href: "/sessao", label: "Rafa", icon: MessageCircle, exact: false },
  { href: "/modulos", label: "Jornada", icon: Sprout, exact: false },
  { href: "/comunidade", label: "Comunidade", icon: Users, exact: false },
];

const SECONDARY = [
  { href: "/diario", label: "Diário", icon: NotebookPen },
  { href: "/check-in", label: "Check-in", icon: CalendarCheck },
  { href: "/assinatura", label: "Assinatura", icon: Sparkles },
  { href: "/perfil", label: "Perfil", icon: User },
];

const GOLD = "#9c7a39";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Sidebar({ user }: { user: JWTPayload }) {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <>
      {/* Topbar mobile */}
      <header className="md:hidden fixed top-0 inset-x-0 h-14 z-40 bg-white/90 backdrop-blur border-b border-stone-100 flex items-center justify-between px-4">
        <span className="font-serif text-lg tracking-[0.14em] text-stone-800">
          BLOOMING
        </span>
        <Link
          href="/perfil"
          aria-label="Perfil"
          className="w-8 h-8 rounded-full border border-stone-200 bg-white flex items-center justify-center text-xs font-serif"
          style={{ color: GOLD }}
        >
          {initials(user.name)}
        </Link>
      </header>

      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-60 bg-white border-r border-stone-100 flex-col shrink-0 h-full">
        <div className="px-6 py-6 border-b border-stone-100">
          <p className="font-serif text-xl tracking-[0.14em] text-stone-800 leading-none">
            BLOOMING
          </p>
          <p className="text-xs text-stone-400 mt-1">חַיִל</p>
        </div>

        <div className="px-6 py-4 border-b border-stone-100">
          <p className="text-sm font-medium text-stone-700 truncate">{user.name}</p>
          <p className="text-xs text-stone-400 truncate">{user.email}</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {PRIMARY.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  active
                    ? "bg-stone-100 text-stone-900 font-medium"
                    : "text-stone-600 hover:bg-stone-50 hover:text-stone-800",
                )}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" style={active ? { color: GOLD } : undefined} />
                {label}
              </Link>
            );
          })}

          <div className="pt-3 mt-3 border-t border-stone-100 space-y-1">
            {SECONDARY.map(({ href, label, icon: Icon }) => {
              const active = isActive(href, false);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-colors",
                    active
                      ? "bg-stone-100 text-stone-900 font-medium"
                      : "text-stone-500 hover:bg-stone-50 hover:text-stone-800",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>

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

      {/* Bottom tab bar mobile */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-stone-100 flex">
        {PRIMARY.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium tracking-wide"
              style={{ color: active ? "#1c1917" : "#a8a29e" }}
            >
              <Icon className="h-5 w-5" style={active ? { color: GOLD } : undefined} />
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
