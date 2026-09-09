import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cut Tracker",
    short_name: "Cut Tracker",
    description: "Suivi mobile de perte de poids, repas et sport",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f7f4",
    theme_color: "#246b4b",
    orientation: "portrait",
    icons: [{ src: "/icons/app-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any maskable" }],
  };
}
