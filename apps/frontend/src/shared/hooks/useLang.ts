import { useState, useCallback } from "react";

export type Lang = "vi" | "en";

const LANG_KEY = "nv-app-lang";

export function useLang(portalKey?: string): { lang: Lang; toggleLang: () => void; t: (vi: string, en: string) => string } {
  const storageKey = portalKey ? `nv-lang-${portalKey}` : LANG_KEY;
  const [lang, setLang] = useState<Lang>(() => {
    try { return (localStorage.getItem(storageKey) as Lang) || "vi"; } catch { return "vi"; }
  });

  const toggleLang = useCallback(() => {
    setLang((l) => {
      const next = l === "vi" ? "en" : "vi";
      try { localStorage.setItem(storageKey, next); } catch {}
      return next;
    });
  }, [storageKey]);

  const t = useCallback((vi: string, en: string) => lang === "vi" ? vi : en, [lang]);

  return { lang, toggleLang, t };
}
