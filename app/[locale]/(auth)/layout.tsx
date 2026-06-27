import { useTranslations } from "next-intl";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("Auth");
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-rose-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-stone-800 tracking-wide">
            BLOOMING
          </h1>
          <p className="text-stone-500 text-sm mt-1">{t("brandTagline")}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
