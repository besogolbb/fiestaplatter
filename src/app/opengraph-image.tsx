import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const runtime = "edge";
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #C62828 0%, #8E1B1B 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 34,
            fontWeight: 700,
            color: "#F9A825",
          }}
        >
          🍽️ {siteConfig.name}
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.05,
            maxWidth: 900,
          }}
        >
          {siteConfig.tagline}
        </div>
        <div style={{ marginTop: 28, fontSize: 30, color: "rgba(255,255,255,0.9)" }}>
          Freshly prepared Filipino party trays for every celebration
        </div>
      </div>
    ),
    { ...size },
  );
}
