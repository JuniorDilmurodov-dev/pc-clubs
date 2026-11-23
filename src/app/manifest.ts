import type { MetadataRoute } from "next";
import { THEME_BG } from "@/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PC Club Finder",
    short_name: "PC Club",
    // Til tanlash proxy'da (Accept-Language)
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: THEME_BG,
    theme_color: THEME_BG,
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
