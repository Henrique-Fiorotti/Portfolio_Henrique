import { ImageResponse } from "next/og";

export const alt = "Henrique Fiorotti — Desenvolvimento de sistemas e suporte de TI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", padding: 60, background: "#eeeaff", color: "#17151d" }}>
      <div style={{ display: "flex", flexDirection: "column", width: "100%", border: "3px solid #24212b", background: "white", boxShadow: "12px 12px 0 #24212b" }}>
        <div style={{ display: "flex", padding: "18px 28px", background: "#dad3f4", borderBottom: "3px solid #24212b", fontSize: 24 }}>Portfolio.exe</div>
        <div style={{ display: "flex", flexDirection: "column", padding: "40px 44px", gap: 22 }}>
          <div style={{ display: "flex", fontSize: 80, fontWeight: 700 }}>Henrique Fiorotti<span style={{ color: "#004aad" }}>.</span></div>
          <div style={{ fontSize: 32 }}>Desenvolvimento de sistemas & suporte de TI</div>
          <div style={{ fontSize: 23, color: "#696570" }}>Projetos, experiência e soluções para problemas reais.</div>
        </div>
      </div>
    </div>, size,
  );
}
