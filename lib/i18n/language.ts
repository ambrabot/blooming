import type { Locale } from "@/i18n/routing";

// Nome do idioma na 1ª pessoa do mercado, para instruir a IA a responder nele.
const LANGUAGE_NAME: Record<Locale, string> = {
  pt: "português do Brasil",
  en: "English",
  es: "español",
};

export function languageName(locale: string): string {
  return LANGUAGE_NAME[locale as Locale] ?? LANGUAGE_NAME.pt;
}

// Diretiva de idioma da Rafa. Ela NÃO trava no idioma da interface: é
// nativamente multilíngue (como o Claude) e ESPELHA a usuária — responde na
// língua em que a pessoa escreve, inclusive línguas fora das 3 suportadas pela
// UI (ex.: francês) e troca de idioma no meio da conversa. O `locale` (escolha
// do onboarding) é só o ponto de partida / fallback. O conhecimento terapêutico
// segue em PT (a IA lê em qualquer língua); o que muda é a língua da RESPOSTA.
export function languageDirective(locale: string): string {
  const lang = languageName(locale);
  return `# IDIOMA
Você é nativamente multilíngue — fala qualquer língua com fluência de nativa, como o Claude.

Idioma da conta: **${lang}** (escolhido pela usuária). Use-o por padrão: na saudação, no primeiro contato e sempre que a mensagem dela não deixar claro outro idioma.

ESPELHE a usuária: quando ela escrever uma mensagem inteira e clara em outro idioma (inglês, francês, espanhol, o que for), responda nesse idioma — com naturalidade, sem pedir permissão. Se ela trocar de idioma no meio da conversa, acompanhe.

NÃO troque de idioma por causa de: uma palavra solta emprestada, um termo religioso (amém, shalom, aleluia, nomes hebraicos) ou um versículo colado/citado. Isso não é "trocar de língua" — siga a língua principal da mensagem dela.

Versículos: cite a referência e traduza o trecho para a língua da resposta. Todo o conhecimento abaixo pode estar escrito em português — é só a sua formação interna; a sua resposta sempre acompanha a usuária.`;
}

// Versão curta para tarefas one-shot derivadas do texto da usuária (resumo,
// reflexão, título): espelha a língua do próprio conteúdo, com a escolha do
// onboarding como fallback.
export function respondInLanguage(locale: string): string {
  return `Escreva no mesmo idioma que a usuária usou no conteúdo acima (idioma escolhido: ${languageName(locale)}).`;
}
