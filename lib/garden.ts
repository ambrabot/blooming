// O Jardim — os 8 canteiros da vida que a Jardineira cultiva.
//
// Eixo NOVO e ortogonal à jornada das 7 Camadas (lib/journey.ts): as Camadas são
// a PROFUNDIDADE da renovação da mente (Solo→Fruto); os Jardins são a AMPLITUDE
// da vida que floresce. O Jardim mede CULTIVO (florescimento 1-5 + rega recente),
// nunca humor — fiel à Constituição (a árvore se conhece pelos frutos).
//
// Nomes dos canteiros vivem no i18n (Garden.beds.<key>); aqui só a chave estável,
// o ícone (lucide) e a âncora bíblica. Sem emoji (regra de casa vence o doc).

export type GardenKey =
  | "voce"
  | "casamento"
  | "familia"
  | "amizades"
  | "casa"
  | "trabalho"
  | "deus"
  | "legado";

export interface GardenDef {
  key: GardenKey;
  icon: string; // nome do ícone lucide (mapeado no componente)
  verse: string;
}

export const GARDENS: GardenDef[] = [
  { key: "voce", icon: "User", verse: "Salmos 139" },
  { key: "casamento", icon: "Heart", verse: "Gênesis 2:24" },
  { key: "familia", icon: "Users", verse: "Josué 24:15" },
  { key: "amizades", icon: "Handshake", verse: "Provérbios 27:17" },
  { key: "casa", icon: "Home", verse: "Provérbios 24:3-4" },
  { key: "trabalho", icon: "Briefcase", verse: "Colossenses 3:23" },
  { key: "deus", icon: "Sparkles", verse: "João 15:5" },
  { key: "legado", icon: "Globe", verse: "Salmos 78:4" },
];

// Estado de um canteiro a partir do florescimento (1-5) e da última rega.
// tier (0-5) decide a cor (seco→verde). label = chave de i18n (Garden.states.*).
// staleDays>14 sussurra "precisa de rega" sem nunca acusar.
export type BedInput = { flourishing: number | null; lastTendedAt: Date | string | null };

export interface BedState {
  tier: number; // 0..5 — 0 = ainda não cultivado
  label: string; // chave i18n: aCultivar | seco | aRegar | brotando | verdejando | florescendo
  stale: boolean; // true se faz >14 dias sem rega (e já cultivado)
}

const LABEL_BY_TIER: Record<number, string> = {
  0: "aCultivar",
  1: "seco",
  2: "aRegar",
  3: "brotando",
  4: "verdejando",
  5: "florescendo",
};

export function bedState(b: BedInput, now: Date = new Date()): BedState {
  const tier = b.flourishing && b.flourishing >= 1 && b.flourishing <= 5 ? b.flourishing : 0;
  let stale = false;
  if (tier > 0 && b.lastTendedAt) {
    const last = typeof b.lastTendedAt === "string" ? new Date(b.lastTendedAt) : b.lastTendedAt;
    stale = (now.getTime() - last.getTime()) / 86_400_000 > 14;
  }
  return { tier, label: LABEL_BY_TIER[tier], stale };
}

export function isGardenKey(k: string): k is GardenKey {
  return GARDENS.some((g) => g.key === k);
}
