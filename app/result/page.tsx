"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import LoadingOverlay from "@/components/LoadingOverlay";
import ErrorView from "@/components/ErrorView";
import { matchSize } from "@/lib/matchSize";
import { SHORT_OVAL_SIZES } from "@/lib/sizeData";
import type { EstimateResponse, EstimateError } from "@/types";

type PageState = "loading" | "success" | "error" | "missing";

const ink = "#2A2326";
const inkSoft = "#6B5F63";
const inkMute = "#9A8F93";
const line = "rgba(42,35,38,0.08)";
const lineSoft = "rgba(42,35,38,0.05)";
const rose = "oklch(72% 0.07 18)";
const roseDeep = "oklch(58% 0.09 18)";
const roseTint = "oklch(97% 0.012 20)";

function formatDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

export default function ResultPage() {
  const router = useRouter();
  const [state, setState] = useState<PageState>("loading");
  const [result, setResult] = useState<EstimateResponse | null>(null);
  const [error, setError] = useState<EstimateError | null>(null);
  const hasAutoFetched = useRef(false);

  const fetchEstimate = useCallback(async () => {
    setState("loading");
    setError(null);

    const imageTop = sessionStorage.getItem("imageTop");

    if (!imageTop) {
      setState("missing");
      return;
    }

    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageTop }),
      });

      if (res.ok) {
        const data = (await res.json()) as EstimateResponse;
        setResult(data);
        setState("success");
      } else {
        const data = (await res.json()) as EstimateError;
        setError(data);
        setState("error");
      }
    } catch {
      setError({ error: "通信エラーが発生しました", retryable: true });
      setState("error");
    }
  }, []);

  useEffect(() => {
    if (hasAutoFetched.current) return;
    hasAutoFetched.current = true;
    void fetchEstimate();
  }, [fetchEstimate]);

  if (state === "loading") {
    return <LoadingOverlay visible={true} />;
  }

  if (state === "missing") {
    return (
      <div className="max-w-md mx-auto w-full">
        <ErrorView
          title="撮影データが見つかりません"
          message="撮影データが見つかりません。最初から撮影しなおしてください。"
          onBack={() => router.push("/")}
          backLabel="トップへ戻る"
        />
      </div>
    );
  }

  if (state === "error" || error !== null) {
    return (
      <div className="max-w-md mx-auto w-full">
        <ErrorView
          title="解析に失敗しました"
          message={error?.error ?? "不明なエラーが発生しました"}
          onRetry={
            error?.retryable === true ? () => void fetchEstimate() : undefined
          }
          retryLabel="再試行"
          onBack={() => router.push("/")}
          backLabel="トップへ戻る"
        />
      </div>
    );
  }

  if (state === "success" && result !== null) {
    const recommended = matchSize(result.width_mm, result.length_mm);
    const confidencePct = Math.round(result.confidence * 100);
    const measuredOn = formatDate(new Date());

    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(80% 60% at 20% 0%, oklch(96% 0.015 20) 0%, transparent 50%), radial-gradient(70% 50% at 100% 100%, oklch(95% 0.02 30) 0%, transparent 55%), #FBF8F6",
          color: ink,
        }}
      >
        <div
          style={{
            maxWidth: 480,
            margin: "0 auto",
            width: "100%",
            padding: "0 0 32px",
          }}
        >
          {/* 測定完了ヘッダー */}
          <div
            style={{
              padding: "24px 24px 12px",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 99,
                background: roseTint,
                color: roseDeep,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12l5 5L20 6" />
              </svg>
            </div>
            <span
              style={{
                fontSize: 12,
                color: inkSoft,
                letterSpacing: "0.08em",
              }}
            >
              測定完了
            </span>
            <button
              onClick={() => router.push("/")}
              aria-label="閉じる"
              style={{
                marginLeft: "auto",
                background: "transparent",
                border: 0,
                color: inkMute,
                fontSize: 12,
                cursor: "pointer",
                padding: 8,
                fontFamily: "inherit",
              }}
            >
              <svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          {/* 見出し */}
          <div style={{ padding: "4px 24px 24px" }}>
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.28em",
                color: rose,
                margin: 0,
                marginBottom: 8,
                fontWeight: 500,
              }}
            >
              YOUR NAIL · SHORT OVAL
            </p>
            <h1
              className="tz-serif"
              style={{
                fontWeight: 500,
                fontSize: 28,
                lineHeight: 1.35,
                margin: "0 0 4px",
              }}
            >
              あなたにぴったりなのは
              <br />
              <span style={{ color: roseDeep, fontWeight: 600 }}>
                サイズ #{recommended.size}
              </span>
            </h1>
          </div>

          {/* 計測値カード */}
          <div style={{ padding: "0 24px 20px" }}>
            <div
              style={{
                borderRadius: 24,
                padding: "26px 24px",
                background: "#fff",
                border: `1px solid ${line}`,
                boxShadow: "0 20px 40px -28px rgba(140, 90, 95, 0.3)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -20,
                  right: -30,
                  width: 140,
                  height: 140,
                  borderRadius: "50%",
                  background: roseTint,
                  opacity: 0.7,
                  pointerEvents: "none",
                }}
              />
              <div style={{ position: "relative", display: "flex", gap: 28 }}>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 10.5,
                      letterSpacing: "0.22em",
                      color: inkMute,
                      marginBottom: 8,
                    }}
                  >
                    幅 · WIDTH
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 4,
                    }}
                  >
                    <span
                      className="tz-serif"
                      style={{
                        fontWeight: 500,
                        fontSize: 44,
                        color: ink,
                      }}
                    >
                      {result.width_mm.toFixed(1)}
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        color: inkSoft,
                        fontWeight: 500,
                      }}
                    >
                      mm
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    width: 1,
                    background: line,
                    alignSelf: "stretch",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 10.5,
                      letterSpacing: "0.22em",
                      color: inkMute,
                      marginBottom: 8,
                    }}
                  >
                    長さ · LENGTH
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 4,
                    }}
                  >
                    <span
                      className="tz-serif"
                      style={{
                        fontWeight: 500,
                        fontSize: 44,
                        color: ink,
                      }}
                    >
                      {result.length_mm.toFixed(1)}
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        color: inkSoft,
                        fontWeight: 500,
                      }}
                    >
                      mm
                    </span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: 20,
                  paddingTop: 16,
                  borderTop: `1px solid ${lineSoft}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 11,
                  color: inkSoft,
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 99,
                    background: rose,
                  }}
                />
                信頼度{" "}
                <strong style={{ color: ink, fontWeight: 600 }}>
                  {confidencePct}%
                </strong>
                <span style={{ color: inkMute, marginLeft: "auto" }}>
                  {measuredOn} 測定
                </span>
              </div>
            </div>
          </div>

          {/* サイズチャート */}
          <div style={{ padding: "0 24px 20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  color: inkMute,
                  fontWeight: 500,
                }}
              >
                SIZE CHART
              </div>
              <div style={{ fontSize: 10.5, color: inkMute }}>
                Short Oval · {SHORT_OVAL_SIZES.length}段階
              </div>
            </div>

            <div
              style={{
                borderRadius: 18,
                overflow: "hidden",
                border: `1px solid ${line}`,
                background: "#fff",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "54px 1fr 1fr 24px",
                  padding: "10px 14px",
                  background: "rgba(42,35,38,0.025)",
                  fontSize: 10,
                  color: inkMute,
                  letterSpacing: "0.1em",
                  borderBottom: `1px solid ${lineSoft}`,
                }}
              >
                <div>SIZE</div>
                <div>幅 (mm)</div>
                <div>長さ (mm)</div>
                <div />
              </div>

              {SHORT_OVAL_SIZES.map((s, i) => {
                const selected = s.size === recommended.size;
                return (
                  <div
                    key={s.size}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "54px 1fr 1fr 24px",
                      padding: "11px 14px",
                      alignItems: "center",
                      background: selected ? roseTint : "transparent",
                      borderBottom:
                        i < SHORT_OVAL_SIZES.length - 1
                          ? `1px solid ${lineSoft}`
                          : "none",
                      fontSize: 13,
                      position: "relative",
                    }}
                  >
                    {selected && (
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: 3,
                          background: rose,
                        }}
                      />
                    )}
                    <div
                      className="tz-serif"
                      style={{
                        fontWeight: selected ? 600 : 500,
                        color: selected ? roseDeep : ink,
                        fontSize: selected ? 15 : 13.5,
                      }}
                    >
                      #{s.size}
                    </div>
                    <div
                      style={{
                        color: selected ? ink : inkSoft,
                        fontWeight: selected ? 600 : 400,
                        fontFamily: "ui-monospace, monospace",
                        fontSize: 12,
                      }}
                    >
                      {s.width.toFixed(1)}
                    </div>
                    <div
                      style={{
                        color: selected ? ink : inkSoft,
                        fontWeight: selected ? 600 : 400,
                        fontFamily: "ui-monospace, monospace",
                        fontSize: 12,
                      }}
                    >
                      {s.length.toFixed(1)}
                    </div>
                    <div
                      style={{
                        color: selected ? roseDeep : "transparent",
                      }}
                    >
                      {selected && (
                        <svg
                          width={14}
                          height={14}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.4}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 12l5 5L20 6" />
                        </svg>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* アクション */}
          <div
            style={{
              padding: "4px 24px 8px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <button
              onClick={() => router.push("/")}
              style={{
                width: "100%",
                height: 56,
                borderRadius: 18,
                border: 0,
                background: ink,
                color: "#fff",
                fontFamily: "inherit",
                fontWeight: 600,
                fontSize: 15,
                letterSpacing: "0.02em",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow: "0 10px 24px -12px rgba(42,35,38,0.45)",
              }}
            >
              <svg
                width={15}
                height={15}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              このサイズのチップを探す
            </button>
            <button
              onClick={() => router.push("/capture")}
              style={{
                width: "100%",
                height: 52,
                borderRadius: 18,
                border: `1px solid ${line}`,
                background: "transparent",
                color: ink,
                fontFamily: "inherit",
                fontWeight: 500,
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <svg
                width={14}
                height={14}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12a9 9 0 1 0 3-6.7" />
                <path d="M3 4v5h5" />
              </svg>
              もう一度測る
            </button>
          </div>

          {/* Notice */}
          <div style={{ padding: "16px 24px 0" }}>
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                padding: "12px 14px",
                borderRadius: 14,
                background: "rgba(42,35,38,0.03)",
                color: inkSoft,
                fontSize: 11.5,
                lineHeight: 1.65,
              }}
            >
              <span
                style={{
                  flexShrink: 0,
                  color: inkMute,
                  marginTop: 1,
                }}
              >
                <svg
                  width={14}
                  height={14}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 11v5M12 8v.01" />
                </svg>
              </span>
              <span>
                {result.notes
                  ? result.notes
                  : "本結果はPoCによる参考値です。測定精度は環境・撮影条件により変動し、実寸との差異が生じる場合があります。購入前に各販売サイトのサイズ表と照合してください。"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
