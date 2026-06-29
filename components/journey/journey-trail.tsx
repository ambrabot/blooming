import { useTranslations } from "next-intl";
import { CAMADAS, statusFor } from "@/lib/journey";
import { cn } from "@/lib/utils";

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII"];

export default function JourneyTrail({ current }: { current: number }) {
  const t = useTranslations("Journey");
  const camadaText = t.raw("camadas") as { name: string; desc: string }[];
  return (
    <div>
      {CAMADAS.map((c, i) => {
        const status = statusFor(c.n, current);
        const last = i === CAMADAS.length - 1;
        const ct = camadaText[c.n - 1] ?? { name: c.name, desc: c.desc };
        return (
          <div key={c.n} className="flex gap-4 pb-4 last:pb-0">
            <div className="relative w-6 shrink-0 flex justify-center">
              {!last && (
                <span
                  className={cn(
                    "absolute top-1.5 -bottom-4 left-1/2 -translate-x-1/2 w-px",
                    status === "done" ? "bg-[#c2c6b5]" : "bg-stone-200",
                  )}
                />
              )}
              <span
                className={cn(
                  "mt-1 rounded-full z-10",
                  status === "done" && "h-3 w-3 bg-[#3c7a5e]",
                  status === "current" &&
                    "h-3.5 w-3.5 bg-white border-2 border-[#8e3b5a] ring-4 ring-[#8e3b5a]/10",
                  status === "locked" && "h-3 w-3 bg-stone-100 border border-stone-200",
                )}
              />
            </div>
            <div className={cn(status === "locked" && "opacity-50")}>
              <p
                className={cn(
                  "font-medium text-[15px]",
                  status === "current" ? "text-[#8e3b5a]" : "text-stone-800",
                )}
              >
                <span className="text-stone-400 font-normal mr-2">{ROMAN[c.n]}</span>
                {ct.name}
                {status === "current" && (
                  <span className="ml-2 inline-block text-[10px] uppercase tracking-wider text-[#8e3b5a] border border-[#d8c39a] rounded-full px-2 py-0.5 align-middle">
                    {t("youAreHere")}
                  </span>
                )}
              </p>
              <p className="text-[13px] text-stone-500 mt-0.5 leading-snug">{ct.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
