import Image from "next/image";
import Link from "next/link";

const ink = "#2A2326";
const inkSoft = "#6B5F63";
const inkMute = "#9A8F93";
const line = "rgba(42,35,38,0.08)";
const lineSoft = "rgba(42,35,38,0.05)";
const rose = "oklch(72% 0.07 18)";
const roseDeep = "oklch(58% 0.09 18)";
const roseSoft = "oklch(94% 0.02 20)";
const roseTint = "oklch(97% 0.012 20)";

const steps = [
  {
    n: "01",
    title: "撮影",
    sub: "500円玉と爪を並べて、上から一枚",
    icon: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 4h-5L7.5 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3.5L14.5 4Z" />
        <circle cx="12" cy="13" r="3.5" />
      </svg>
    ),
  },
  {
    n: "02",
    title: "AI解析",
    sub: "コインを基準に爪の寸法を推定",
    icon: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Zm6 11l.9 2.1L21 17l-2.1.9L18 20l-.9-2.1L15 17l2.1-.9L18 14Z" />
      </svg>
    ),
  },
  {
    n: "03",
    title: "サイズ提案",
    sub: "10段階からあなたの最適を提示",
    icon: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 15l6 6 12-12-6-6L3 15Z" />
        <path d="M7 11l2 2M10 8l2 2M13 5l2 2M5 13l2 2" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(80% 60% at 20% 0%, oklch(96% 0.015 20) 0%, transparent 50%), radial-gradient(70% 50% at 100% 100%, oklch(95% 0.02 30) 0%, transparent 55%), #FBF8F6",
        color: ink,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ maxWidth: 480, margin: "0 auto", width: "100%", position: "relative" }}>
        {/* ブランドヘッダー */}
        <div style={{ padding: "24px 24px 28px", position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: -40,
              right: -80,
              width: 260,
              height: 260,
              borderRadius: "50%",
              background: roseSoft,
              filter: "blur(8px)",
              opacity: 0.8,
              pointerEvents: "none",
            }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 36, position: "relative" }}>
            <div
              className="tz-serif"
              style={{
                width: 26,
                height: 26,
                borderRadius: 8,
                background: rose,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              T
            </div>
            <span style={{ fontWeight: 600, letterSpacing: "0.08em", fontSize: 13 }}>Tsumelier</span>
            <span
              style={{
                marginLeft: "auto",
                fontSize: 10,
                color: inkMute,
                border: `1px solid ${line}`,
                padding: "3px 8px",
                borderRadius: 99,
                letterSpacing: "0.1em",
              }}
            >
              BETA
            </span>
          </div>

          <div style={{ position: "relative" }}>
            <p style={{ fontSize: 11, letterSpacing: "0.3em", color: rose, margin: 0, marginBottom: 14, fontWeight: 500 }}>
              NAIL CHIP SIZING · AI
            </p>
            <h1
              className="tz-serif"
              style={{
                fontWeight: 500,
                fontSize: 34,
                lineHeight: 1.35,
                letterSpacing: "0.01em",
                margin: 0,
                marginBottom: 18,
              }}
            >
              撮るだけで、
              <br />
              <span style={{ color: roseDeep }}>ぴったりの</span>ネイルチップ
              <br />
              サイズを。
            </h1>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: inkSoft, margin: 0, maxWidth: 320 }}>
              500円玉と一緒に爪を撮影すると、AI があなたの指に合うサイズを
              <span style={{ color: ink }}>1〜2分</span>で提案します。
            </p>
          </div>
        </div>

        {/* ヒーロービジュアル */}
        <div style={{ padding: "0 24px 32px" }}>
          <div
            style={{
              position: "relative",
              aspectRatio: "16 / 9",
            }}
          >
            <Image
              src="/hero-nail-coin.png"
              alt="500円玉と爪を並べて撮影するイメージ"
              fill
              sizes="(max-width: 768px) 100vw, 720px"
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div style={{ padding: "0 24px 28px" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", color: inkMute, marginBottom: 18, fontWeight: 500 }}>
            HOW IT WORKS
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {steps.map((s, i) => (
              <div
                key={s.n}
                style={{
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                  padding: "18px 4px",
                  borderBottom: i < steps.length - 1 ? `1px solid ${lineSoft}` : "none",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    flexShrink: 0,
                    borderRadius: 12,
                    background: roseTint,
                    color: roseDeep,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {s.icon}
                </div>
                <div style={{ flex: 1, paddingTop: 2 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 3 }}>
                    <span style={{ fontSize: 10, color: inkMute, fontFamily: "ui-monospace, monospace" }}>{s.n}</span>
                    <span style={{ fontWeight: 600, fontSize: 15 }}>{s.title}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12.5, color: inkSoft, lineHeight: 1.6 }}>{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* なぜ500円玉？ */}
        <div style={{ padding: "0 24px 24px" }}>
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              padding: "14px 16px",
              borderRadius: 16,
              background: roseTint,
              border: "1px solid oklch(90% 0.02 20)",
            }}
          >
            <div style={{ color: roseDeep }}>
              <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M9.5 9.5h4a1.5 1.5 0 0 1 0 3h-4m0 0v2.5m0-2.5h4a1.5 1.5 0 0 1 0 3h-4" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>なぜ500円玉?</div>
              <div style={{ fontSize: 11.5, color: inkSoft, lineHeight: 1.55 }}>
                直径 26.5mm の正確な基準として、AIが寸法を換算します。
              </div>
            </div>
          </div>
        </div>

        {/* はじめる */}
        <div style={{ padding: "8px 24px 28px", marginTop: 16 }}>
          <Link
            href="/capture"
            style={{
              width: "100%",
              height: 56,
              borderRadius: 18,
              background: ink,
              color: "#fff",
              fontFamily: "inherit",
              fontWeight: 600,
              fontSize: 15,
              letterSpacing: "0.02em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: "0 10px 24px -12px rgba(42,35,38,0.45)",
              textDecoration: "none",
            }}
          >
            はじめる
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </Link>
          <p style={{ textAlign: "center", margin: "16px 0 0", fontSize: 10.5, color: inkMute, lineHeight: 1.6 }}>
            PoCのため測定精度は保証されません ・ 参考値としてご利用ください
          </p>
        </div>
      </div>
    </div>
  );
}
