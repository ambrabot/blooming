import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Navegação ciente de locale: Link/redirect/useRouter prefixam o idioma automaticamente.
// Usar estes no lugar de `next/link` e `next/navigation` em qualquer rota dentro de app/[locale].
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
