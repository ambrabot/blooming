// Método Blooming — Jornada de Florescimento (7 camadas)
// A camada atual é derivada do progresso real da mulher (assessment + módulos
// em que ela já avançou). É um mapa de transformação, não um ranking — sempre
// erra para o lado do encorajamento.

export interface Camada {
  n: number;
  name: string;
  desc: string;
  verse: string;
  // módulos cujo progresso marca esta camada como tocada
  modules: string[];
}

export const CAMADAS: Camada[] = [
  {
    n: 1,
    name: "Solo",
    desc: "A mente como terra — reconhecer a semente original que Deus plantou",
    verse: "Salmos 139",
    modules: ["fundamentos"],
  },
  {
    n: 2,
    name: "Espinhos",
    desc: "Expor o joio: mentiras, votos internos, fortalezas",
    verse: "Mateus 13 · João 8:32",
    modules: ["cura-interior"],
  },
  {
    n: 3,
    name: "Poda",
    desc: "O Agricultor corta o que não dá fruto: perdão, dívidas, dependências",
    verse: "João 15:2",
    modules: ["familia-funcional"],
  },
  {
    n: 4,
    name: "Renovo",
    desc: "Renovar a mente — nova percepção, nova decisão",
    verse: "Romanos 12:2",
    modules: ["regulacao-emocional"],
  },
  {
    n: 5,
    name: "Broto",
    desc: "Firmar a identidade brotando na verdade de Deus",
    verse: "2 Coríntios 5:17",
    modules: ["mulher"],
  },
  {
    n: 6,
    name: "Flor",
    desc: "Florescer no destino: shalom e vida em abundância",
    verse: "João 10:10",
    modules: ["tempo-de-deus", "permissao-destino"],
  },
  {
    n: 7,
    name: "Fruto",
    desc: "Multiplicar — alimentar outras e plantar nova geração",
    verse: "João 15:8 · Gênesis 1:11",
    modules: ["lideranca"],
  },
];

/**
 * Calcula a camada atual (1..7) a partir dos slugs de módulos em que a mulher
 * já avançou e se o assessment foi concluído. Avança de forma linear: a camada
 * atual é a primeira ainda não tocada.
 */
export function computeCurrentCamada(
  touchedSlugs: Set<string>,
  assessmentDone: boolean,
): number {
  const isDone = (c: Camada): boolean => {
    const moduleTouched = c.modules.some((s) => touchedSlugs.has(s));
    if (c.n === 1) return assessmentDone || moduleTouched;
    return moduleTouched;
  };

  let current = 1;
  for (const c of CAMADAS) {
    if (isDone(c)) current = Math.min(c.n + 1, CAMADAS.length);
    else break;
  }
  return current;
}

export type CamadaStatus = "done" | "current" | "locked";

export function statusFor(camadaN: number, current: number): CamadaStatus {
  if (camadaN < current) return "done";
  if (camadaN === current) return "current";
  return "locked";
}
