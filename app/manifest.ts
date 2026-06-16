import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Blooming — Terapia Cristã Integrativa",
    short_name: "Blooming",
    description:
      "Uma jornada de cura fundamentada na Palavra — a Rafa, devocional diário e a Jornada de Florescimento, no seu bolso.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f3ece0",
    theme_color: "#f3ece0",
    categories: ["health", "lifestyle", "education"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
