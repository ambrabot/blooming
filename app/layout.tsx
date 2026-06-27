import type { ReactNode } from "react";

// Root layout = pass-through. O <html>/<body> reais vivem em app/[locale]/layout.tsx
// (padrão next-intl para roteamento por locale). As rotas /api não usam layout.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
