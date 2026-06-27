import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next 16: o arquivo de middleware foi renomeado para `proxy.ts` (export default aceito).
// next-intl detecta o locale (cookie NEXT_LOCALE → Accept-Language → defaultLocale) e reescreve.
export default createMiddleware(routing);

export const config = {
  // Roda em tudo, MENOS: /api, assets do Next, arquivos com extensão (favicon, imagens, sw.js, manifest).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
