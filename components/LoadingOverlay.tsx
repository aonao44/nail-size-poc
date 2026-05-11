"use client";

import { useEffect, useState } from "react";

type Props = {
  visible: boolean;
  /** 未指定時は Tsumelier の定型メッセージを表示 */
  message?: string;
};

const stages = [
  "画像を取り込み中…",
  "500円玉を基準点として検出…",
  "爪の輪郭を抽出…",
  "寸法を推定しています…",
];

const ink = "#2A2326";
const inkSoft = "#6B5F63";
const inkMute = "#9A8F93";
const rose = "oklch(72% 0.07 18)";
const roseDeep = "oklch(58% 0.09 18)";
const roseTint = "oklch(97% 0.012 20)";
const roseSoft = "oklch(94% 0.02 20)";

export default function LoadingOverlay({ visible, message }: Props) {
  const [idx, setIdx] = useState(0);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const t1 = window.setInterval(
      () => setIdx((i) => Math.min(i + 1, stages.length - 1)),
      900
    );
    // 90% までゆっくり進めて以降は API 応答を待つ
    const t2 = window.setInterval(
      () => setPct((p) => (p < 90 ? Math.min(p + 1.5, 90) : p)),
      60
    );
    return () => {
      window.clearInterval(t1);
      window.clearInterval(t2);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "radial-gradient(80% 60% at 20% 0%, oklch(96% 0.015 20) 0%, transparent 50%), radial-gradient(70% 50% at 100% 100%, oklch(95% 0.02 30) 0%, transparent 55%), #FBF8F6",
        color: ink,
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "48px 24px 24px",
        overflow: "hidden",
      }}
    >
      {/* 背景パルス */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${roseSoft} 0%, transparent 70%)`,
          animation: "tz-pulse 3.2s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* 二重リング + 中央 Sparkle */}
      <div
        style={{
          position: "relative",
          marginTop: 40,
          marginBottom: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          style={{ animation: "tz-spin 8s linear infinite" }}
        >
          <circle
            cx="100"
            cy="100"
            r="94"
            fill="none"
            stroke="oklch(72% 0.07 18 / 0.22)"
            strokeWidth="0.8"
            strokeDasharray="2 6"
          />
        </svg>
        <svg
          width="160"
          height="160"
          viewBox="0 0 160 160"
          style={{
            position: "absolute",
            animation: "tz-spin-rev 6s linear infinite",
          }}
        >
          <circle
            cx="80"
            cy="80"
            r="74"
            fill="none"
            stroke="oklch(72% 0.07 18 / 0.35)"
            strokeWidth="1"
            strokeDasharray="1 4"
          />
          <circle cx="80" cy="6" r="3" fill={rose} />
        </svg>
        <div
          style={{
            position: "absolute",
            width: 110,
            height: 110,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${roseTint} 0%, #fff 100%)`,
            boxShadow: `0 20px 40px -16px oklch(72% 0.07 18 / 0.4), inset 0 0 0 1px oklch(72% 0.07 18 / 0.15)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "tz-breathe 2.4s ease-in-out infinite",
          }}
        >
          <div style={{ color: roseDeep }}>
            <svg
              width={34}
              height={34}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.3}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Zm6 11l.9 2.1L21 17l-2.1.9L18 20l-.9-2.1L15 17l2.1-.9L18 14Z" />
            </svg>
          </div>
        </div>
      </div>

      <h2
        className="tz-serif"
        style={{
          fontWeight: 500,
          fontSize: 22,
          margin: "0 0 10px",
          letterSpacing: "0.02em",
          textAlign: "center",
        }}
      >
        {message ?? "AIが爪を測定しています"}
      </h2>
      <p
        style={{
          fontSize: 12.5,
          color: inkSoft,
          margin: "0 0 32px",
          textAlign: "center",
        }}
      >
        通常 5〜10 秒ほどで完了します
      </p>

      <div style={{ width: "100%", maxWidth: 280, marginBottom: 24 }}>
        <div
          style={{
            height: 4,
            borderRadius: 99,
            background: "rgba(42,35,38,0.08)",
            overflow: "hidden",
            marginBottom: 18,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              borderRadius: 99,
              background: `linear-gradient(90deg, ${rose}, ${roseDeep})`,
              transition: "width 0.1s linear",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {stages.map((s, i) => {
            const state: "done" | "active" | "pending" =
              i < idx ? "done" : i === idx ? "active" : "pending";
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 12,
                  lineHeight: 1.5,
                  color:
                    state === "done"
                      ? inkMute
                      : state === "active"
                      ? ink
                      : "rgba(42,35,38,0.25)",
                  transition: "color 300ms",
                }}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color:
                      state === "done"
                        ? roseDeep
                        : state === "active"
                        ? rose
                        : "rgba(42,35,38,0.2)",
                  }}
                >
                  {state === "done" ? (
                    <svg
                      width={12}
                      height={12}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 12l5 5L20 6" />
                    </svg>
                  ) : state === "active" ? (
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: rose,
                        animation: "tz-blink 0.9s ease-in-out infinite",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "currentColor",
                      }}
                    />
                  )}
                </div>
                <span>{s}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          marginTop: "auto",
          marginBottom: 8,
          padding: "10px 18px",
          borderRadius: 99,
          background: "rgba(42,35,38,0.04)",
          color: inkSoft,
          fontSize: 10.5,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <svg
          width={12}
          height={12}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
        画像は安全に処理されます
      </div>
    </div>
  );
}
